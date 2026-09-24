import crypto from 'node:crypto';
import { pool } from '../config/database.js';
import { env } from '../config/env.js';
import { AppError } from '../utils/http.js';

const sign=value=>crypto.createHmac('sha256',env.SESSION_SECRET).update(value).digest('base64url');
export function makeSession(admin){const payload=Buffer.from(JSON.stringify({id:admin.id,exp:Date.now()+8*60*60*1000})).toString('base64url');return `${payload}.${sign(payload)}`;}
export async function requireAdmin(req,res,next){try{
  const token=req.cookies?.archihome_session;if(!token)throw new AppError(401,'Authentication required','UNAUTHENTICATED');
  const [payload,signature]=token.split('.');const expected=payload?sign(payload):'';if(!payload||!signature||signature.length!==expected.length||!crypto.timingSafeEqual(Buffer.from(signature),Buffer.from(expected)))throw new AppError(401,'Invalid session','UNAUTHENTICATED');
  const session=JSON.parse(Buffer.from(payload,'base64url').toString());if(!Number.isFinite(session.exp)||session.exp<Date.now())throw new AppError(401,'Session expired','SESSION_EXPIRED');
  const [rows]=await pool.execute('SELECT id,name,email,role,is_active FROM admins WHERE id=? LIMIT 1',[session.id]);
  if(!rows.length||!rows[0].is_active)throw new AppError(401,'Account unavailable','ACCOUNT_INACTIVE');
  req.admin=rows[0];next();
}catch(error){next(error)}}
export function requireRole(...roles){return(req,res,next)=>roles.includes(req.admin?.role)?next():next(new AppError(403,'Insufficient permissions','FORBIDDEN'));}
