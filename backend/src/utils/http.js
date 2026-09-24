export const asyncHandler = (fn) => (req,res,next) => Promise.resolve(fn(req,res,next)).catch(next);
export const success = (res,data,message='Operation successful',status=200) => res.status(status).json({success:true,message,data});
export class AppError extends Error { constructor(status,message,code='REQUEST_ERROR',errors){super(message);this.status=status;this.code=code;this.errors=errors;} }
