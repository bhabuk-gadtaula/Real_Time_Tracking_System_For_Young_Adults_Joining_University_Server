import { CustomError } from '../errors';
import { IPagination, IPaginationReturnValue } from '../interface';

export function calculatePagination(data: IPagination): IPaginationReturnValue {
  if (isNaN(Number(data?.offset ?? 0))) throw new CustomError('Offset must be in number', 400);
  else data.offset = Number(data?.offset ?? 0);
  if (isNaN(Number(data?.limit ?? 10))) throw new CustomError('Limit must be in number', 400);
  else data.limit = Number(data.limit ?? 10);

  return { offset: data.offset, limit: data.limit };
}
