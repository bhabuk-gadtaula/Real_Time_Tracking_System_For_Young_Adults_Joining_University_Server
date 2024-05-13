export interface IPaginationReturnValue {
  offset: number;
  limit: number;
}

export interface IPagination {
  offset?: string | number;
  limit?: string | number;
  sortBy?: string;
}
