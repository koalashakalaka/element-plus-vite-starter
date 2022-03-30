import type { Options } from '~/utils/http';

/**
 * 请求一般在Options内传入泛型
 * 参数1为请求出参类型
 * 参数2为请求入参类型
 */
export const getTableData: Options<{ a: string }, { pageNo: number; pageSize: number }> = {
  url: '/services/weilidai/account/list',
  method: 'GET',
  contentType: 'JSON',
  // contentType: 'FORM_DATA',
};
