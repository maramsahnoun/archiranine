import axios from "axios";
import { demoApi } from "./demo.js";
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "/api",
  withCredentials: true,
});
api.interceptors.response.use((response)=>{if(response.headers?.['x-archihome-demo']){window.__ARCHIHOME_DEMO__=true;window.dispatchEvent(new Event('archihome:demo'))}return response},(error)=>{
  if(import.meta.env.DEV&&(!error.response||error.response.status>=500)){
    const data=demoApi(error.config||{});
    if(data!==undefined){window.__ARCHIHOME_DEMO__=true;window.dispatchEvent(new Event('archihome:demo'));return Promise.resolve({data:{success:true,message:'Local demo data',data},status:200,statusText:'OK',headers:{'x-archihome-demo':'true'},config:error.config})}
  }
  return Promise.reject(error);
});
export async function request(promise) {
  const r = await promise;
  return r.data.data;
}
