/**
 * 后台标准返回格式
 */
declare type RequexResponse =
  | {
      message?: string;
      success?: boolean;
    }
  | undefined;
