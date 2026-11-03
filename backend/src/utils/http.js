export class HttpError extends Error {
  constructor(status, message, code = 'request_failed', details) {
    super(message);
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

export const badRequest = (message, details) => new HttpError(400, message, 'bad_request', details);
export const unauthorized = (message = 'Sesi tidak valid.') => new HttpError(401, message, 'unauthorized');
export const forbidden = (message = 'Akses ditolak.') => new HttpError(403, message, 'forbidden');
export const notFound = (message = 'Data tidak ditemukan.') => new HttpError(404, message, 'not_found');
export const conflict = (message, code = 'conflict') => new HttpError(409, message, code);

export function asyncHandler(fn) {
  return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
}

export function parsePagination(query, { maxLimit = 100 } = {}) {
  const page = Math.max(1, Number.parseInt(query.page ?? '1', 10) || 1);
  const limit = Math.min(maxLimit, Math.max(1, Number.parseInt(query.limit ?? '20', 10) || 20));
  return { page, limit, skip: (page - 1) * limit };
}
