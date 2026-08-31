const BASE=import.meta.env.VITE_API_URL||'http://localhost:5000/api';
export async function api(path,opts={}){const r=await fetch(BASE+path,{headers:{'Content-Type':'application/json'},...opts});const j=await r.json();if(!r.ok)throw new Error(j.error||'Request failed');return j;}
