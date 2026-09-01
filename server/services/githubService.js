export async function githubToday() {
 const u=process.env.GITHUB_USERNAME,t=process.env.GITHUB_TOKEN;
  if(!u) return {
    configured:false,commits:0,repos:[]
  };
 const headers= {
    Accept:'application/vnd.github+json',...(t? {
      Authorization:`Bearer ${t}`
    }: {
    })
  };
 const q=encodeURIComponent(`author:${u} committer-date:${new Date().toISOString().slice(0,10)}`);
 const r=await fetch(`https://api.github.com/search/commits?q=${q}`,
  {
    headers
  });
   if(!r.ok)return {
    configured:true,error:`GitHub ${r.status}`,
    commits:0,repos:[]
  };
 const j=await r.json();
   return {
    configured:true,commits:j.total_count||0,
    repos:[...new Set((j.items||[]).map(x=>x.repository?.full_name).filter(Boolean))].slice(0,
    5)
  };
}
