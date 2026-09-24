import { ZodError } from 'zod';
export function notFound(req,res){res.status(404).json({success:false,message:'Resource not found',code:'NOT_FOUND'});}
export function errorHandler(err,req,res,next){
  if(res.headersSent)return next(err);
  if(err instanceof ZodError)return res.status(422).json({success:false,message:'Validation failed',code:'VALIDATION_ERROR',errors:Object.fromEntries(err.issues.map(i=>[i.path.join('.'),i.message]))});
  const status=Number.isInteger(err.status)?err.status:500;
  if(status>=500)req.log?.error?.({err},'request failed');
  res.status(status).json({success:false,message:status>=500?'An unexpected error occurred':err.message,code:err.code||'INTERNAL_ERROR',...(err.errors?{errors:err.errors}:{})});
}
