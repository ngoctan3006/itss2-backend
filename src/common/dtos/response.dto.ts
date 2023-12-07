import { IPagination } from '.';

export class IResponse<T> {
  success: boolean;
  message: string;
  data: T;
  pagination?: IPagination;
}
