import type { AxiosInstance, AxiosResponse, AxiosError } from 'axios';
import axios from 'axios';
import qs from 'qs';
import { cloneDeep } from 'lodash-es';
import download from 'downloadjs';
import { parse, compile } from 'path-to-regexp';
import { isFunction } from '~/utils/is';
import { ContentTypeEnum, RequestEnum } from './types';
import type { Result, Options, Params } from './types';
// import { AxiosCanceler } from './axiosCancel';

export class Requex<T = any> {
  private axiosInstance: AxiosInstance;
  private readonly options: Options;
  private readonly params?: Params;

  constructor(options: Options, params?: Params, customizeInstance?: (instance: AxiosInstance) => void) {
    this.options = options;
    this.params = params;
    this.axiosInstance = axios.create(options);
    if (isFunction(customizeInstance)) {
      customizeInstance(this.axiosInstance);
    }
  }

  /**
   * @description URL转换逻辑，包括模板替换
   */
  transformURL(options: Options) {
    let url = options.url || '';
    let data = options.data;
    let domain = '';

    const urlMatch = url?.match(/[a-zA-z]+:\/\/[^/]*/);

    if (urlMatch) {
      [domain] = urlMatch;
      url = url?.slice(domain.length);
    }

    const match = parse(url);
    url = compile(url)(data);
    // only replace pattern when matched
    if (match.length > 1) {
      const cloneData = cloneDeep(data);
      match.forEach((item) => {
        if (item instanceof Object && item.name in cloneData) {
          delete cloneData[item.name];
        }
      });
      data = cloneData;
    }
    url = domain + url;

    options.url = url;
    options.data = data;
  }

  /**
   * @description Data转换逻辑
   */
  transformData(options: Options) {
    const headers = options.headers;
    const contentType = headers?.['Content-Type'] || headers?.['content-type'];

    if (options.upload) {
      const formData = new window.FormData();

      if (options.data) {
        Object.keys(options.data).forEach((key) => {
          const value = options.data![key];
          if (Array.isArray(value)) {
            value.forEach((item) => {
              formData.append(`${key}[]`, item);
            });
            return;
          }

          formData.append(key, value);
        });
      }

      options.data = formData;
      options.method = RequestEnum.POST;
    }

    if (
      contentType === ContentTypeEnum.FORM_URLENCODED &&
      Reflect.has(options, 'data') &&
      options.method?.toUpperCase() !== RequestEnum.GET
    ) {
      options.data = qs.stringify(options.data, { arrayFormat: 'brackets' });
    }

    if (Reflect.has(options, 'data') && options.method?.toUpperCase() === 'GET') {
      options.params = options.data;
      delete options.data;
    }
  }

  /**
   * @description 请求后流程
   */
  afterResponse<R = T>(res: AxiosResponse<R>, options: Options): Result<R> {
    const { data, status } = res;

    if (!data) {
      // return '[HTTP] Request has no return value';
      throw new Error('HTTP Request has no return value');
    }

    const isAttachment: boolean = res.headers['content-disposition']?.indexOf('attachment') >= 0;

    const contentType = res.headers?.['Content-Type'] || res.headers?.['content-type'];

    const isHtml: boolean = contentType?.indexOf('text/html') >= 0;

    const ret: Result<R> = {
      success: false,
      data,
      status,
    };

    /**
     * 返回文件下载
     */
    if (isAttachment) {
      const filename = decodeURIComponent(res.headers['content-disposition']?.split('filename=')[1]);
      const contentType = res.headers['content-type'];
      download(data as any, filename, contentType);

      ret.success = true;
      return ret;
    }

    /**
     * 返回页面
     */
    if (isHtml) {
      ret.success = true;
      ret.data = undefined;
      return ret;
    }

    /**
     * 使用外部判断逻辑判断success
     */
    if (isFunction(options.isSuccess)) {
      const success = options.isSuccess(data);
      ret.success = success;
    }

    return ret;
  }

  /**
   * @description 发送请求
   */
  async request<D = any, R = T>(opts: Options<R, D>, pars?: Params<R, D>): Promise<Result<R>> {
    const options = Object.assign({}, this.options, cloneDeep(opts));
    const params = Object.assign({}, this.params, cloneDeep(pars));

    options.data = options.data || params.extraData;

    this.transformURL(options);
    this.transformData(options);

    try {
      const response = await this.axiosInstance.request<R, AxiosResponse<R>, D>(options);

      const { data } = response;

      if (!data) {
        // return '[HTTP] Request has no return value';
        throw new Error('HTTP Request has no return value');
      }

      const ret = this.afterResponse<R>(response, options);

      if (ret.success && isFunction(params?.onSuccess)) {
        params?.onSuccess(ret.data, ret.status, options);
      } else if (!ret.success && isFunction(params?.onFail)) {
        params?.onFail(ret.data, ret.status, options);
      }

      return ret;
    } catch (e) {
      if (axios.isAxiosError(e)) {
        // rewrite error message from axios in here
        const { response } = e as AxiosError<R>;

        if (!response) {
          throw e;
        }

        if (isFunction(params?.onFail)) {
          params?.onFail(response.data, response.status, options);
          return {
            success: false,
            data: response.data,
            status: response.status,
          };
        }
      }

      throw e;
    }
  }
}
