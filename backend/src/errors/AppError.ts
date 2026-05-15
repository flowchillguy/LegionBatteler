export class AppError extends Error {
  constructor(
    public statusCode: number,
    message: string,
  ) {
    super(message);
    // Lưu lại dấu vết lỗi để debug
    Error.captureStackTrace(this, this.constructor);
  }
}
