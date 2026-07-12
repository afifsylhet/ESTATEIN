export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export class ApiResponse<T> {
  public success = true;
  public message: string;
  public data: T;
  public meta?: PaginationMeta;

  constructor(message: string, data: T, meta?: PaginationMeta) {
    this.message = message;
    this.data = data;
    this.meta = meta;
  }
}
