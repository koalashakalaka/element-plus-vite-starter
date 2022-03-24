import type { AxiosRequestConfig } from 'axios';

/**
 * @description 请求回调方法
 */
interface CallbackFn<T> {
  (response: T, status: number, config: AxiosRequestConfig<T>): void;
}

/**
 * @description 基于axios的参数
 */
export interface Options<R = any, D = any> extends AxiosRequestConfig<D> {
  /**
   * 判断是否是业务成功
   */
  isSuccess?: (response: R) => boolean;
  /**
   * 是否显示"加载中"模态框
   */
  showSpin?: boolean;
  /**
   * 是否是文件上传
   */
  upload?: boolean;
}

/**
 * @description 请求拓展参数
 */
export interface Params<R = any, D = any> {
  onSuccess?: CallbackFn<R>;
  // 请求失败回调
  onFail?: CallbackFn<R>;
  extraData?: D;
}

/**
 * @description 标准的返回体结构
 */
export interface Result<T = any> {
  /**
   * 接口是否返回成功(业务成功)
   */
  success: boolean;
  /**
   * HTTP返回码
   */
  status: number;
  /**
   * 接口返回体
   */
  data?: T;
}

/**
 * @description: request method
 */
export enum RequestEnum {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  DELETE = 'DELETE',
}

/**
 * @description:  contentType
 */
export enum ContentTypeEnum {
  // json
  JSON = 'application/json;charset=UTF-8',
  // form-data qs
  FORM_URLENCODED = 'application/x-www-form-urlencoded;charset=UTF-8',
  // form-data  upload
  FORM_DATA = 'multipart/form-data;charset=UTF-8',
}
