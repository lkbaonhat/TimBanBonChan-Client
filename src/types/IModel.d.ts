declare namespace IModel {
  export interface IResponseBase<P = any> {
    status?: number | string;
    errorCode?: string | null;
    message?: string | null;
    success: boolean;
    result: P;
  }
  export interface IPagingResult<P = any> {
    pageIndex: number;
    pageSize: number;
    totalCount: number;
    items: P[];
  }
}
