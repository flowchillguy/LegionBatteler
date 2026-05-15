import { AppError } from "./AppError.js";

// Lỗi 400: Sai logic/Thiếu thông tin
export class BadRequestError extends AppError {
  constructor(message: string = "Yêu cầu không hợp lệ!") {
    super(400, message);
  }
}

// Lỗi 401: Chưa xác thực
export class UnauthorizedError extends AppError {
  constructor(message: string = "Vui lòng đăng nhập để thực hiện!") {
    super(401, message);
  }
}

// Lỗi 403: Không có quyền
export class ForbiddenError extends AppError {
  constructor(message: string = "Bạn không có quyền thực hiện hành động này!") {
    super(403, message);
  }
}

// Lỗi 404: Không tìm thấy
export class NotFoundError extends AppError {
  constructor(message: string = "Tài nguyên không tồn tại!") {
    super(404, message);
  }
}

// Lỗi 409: Xung đột dữ liệu (Ví dụ: Trùng tên nhân vật)
export class ConflictError extends AppError {
  constructor(message: string) {
    super(409, message);
  }
}
