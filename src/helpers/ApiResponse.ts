export class ApiResponse<T> {
  constructor(
    public sucess: boolean,
    public data: T,
    public message?: string
  ) {}
}
