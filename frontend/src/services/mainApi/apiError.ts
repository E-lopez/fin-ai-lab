export default class ApiError extends Error {
  type: string;
  status: number;

  constructor(type: string, message: string, status: number) {
    super(message);
    this.name = 'ApiError';
    this.type = type;
    this.status = status;
  }
}