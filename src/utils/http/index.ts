import { ElMessage, ElNotification } from 'element-plus';
import { Requex } from './axios';
import { ContentTypeEnum } from './types';
import type { Options } from './types';

const codeMessage: Record<string, string> = {
  200: '服务器成功返回请求的数据。',
  201: '新建或修改数据成功。',
  202: '一个请求已经进入后台排队（异步任务）。',
  204: '删除数据成功。',
  400: '发出的请求有错误，服务器没有进行新建或修改数据的操作。',
  401: '用户没有权限（令牌、用户名、密码错误）。',
  403: '用户得到授权，但是访问是被禁止的。',
  404: '发出的请求针对的是不存在的记录，服务器没有进行操作。',
  406: '请求的格式不可得。',
  410: '请求的资源被永久删除，且不会再得到的。',
  422: '当创建一个对象时，发生一个验证错误。',
  500: '服务器发生错误，请检查服务器。',
  502: '网关错误。',
  503: '服务不可用，服务器暂时过载或维护。',
  504: '网关超时。',
  '(canceled)': '重复请求被关闭。',
};

/**
 * 通过options.ts文件生成的默认请求器
 */
const instance = new Requex<RequexResponse>(
  {
    baseURL: (import.meta.env.VITE_API_URL || '/') as string,
    withCredentials: true,
    headers: {
      Accept: 'application/json',
      'X-Requested-With': 'XMLHttpRequest',
      'Content-Type': ContentTypeEnum.JSON,
    },
    isSuccess: (response) => {
      return response?.success === true;
    },
  },
  {
    onSuccess: (response) => {
      if (response?.message) {
        ElMessage.success(response.message);
      }
    },
    onFail: (response, status, { url }) => {
      console.log('response', response);
      if ([401, 403].includes(status as number)) {
        const currHref = window.location.href;
        window.location.href = `${import.meta.env.VITE_API_URL}/me?redirect_uri=${encodeURIComponent(currHref)}`;
      } else if (status >= 200 && status < 300) {
        if (response?.message) {
          ElMessage.error(response.message);
        }
      } else {
        ElNotification({
          title: `请求错误 ${status}: ${url}`,
          message: codeMessage[String(status)],
          type: 'error',
        });
      }
    },
  },
);

export { Options };

export default instance;
