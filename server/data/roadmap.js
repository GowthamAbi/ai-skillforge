const phases=[
[1,10,['Python & Git','Python for AI','ML foundations','ML evaluation','Neural networks','PyTorch','NLP basics','Transformers','LLM inference','Prompt engineering']],
[11,17,['Embeddings','Chunking','Vector databases','Basic RAG','Advanced RAG','Reranking','RAG evaluation']],
[18,23,['Hugging Face','Transformer practice','Fine-tuning','PEFT & LoRA','QLoRA','Fine-tune evaluation']],
[24,34,['Agent fundamentals','Tool calling','Memory & context','LangChain','LangGraph state','LangGraph tools','Checkpointing','Human-in-loop','Multi-agent systems','CrewAI','Agentic RAG']],
[35,38,['MCP fundamentals','MCP server','Agentic RAG + MCP','Agent evaluation & guardrails']],
[39,45,['FastAPI','LLM API service','Docker','AWS basics','AWS Bedrock','CI/CD & Terraform','Monitoring & security']],
[46,50,['Python/ML interview','LLM interview','RAG interview','Agentic AI interview','Portfolio & mock interview']]
];
export const roadmap=[];
for(const [start,end,names] of phases){for(let d=start;d<=end;d++){const topic=names[d-start];roadmap.push({day:d,topic,tasks:[{title:`Learn ${topic}`,type:'learn'},{title:`Code ${topic}`,type:'code'},{title:`Project practice: ${topic}`,type:'project'},{title:`Interview revision: ${topic}`,type:'interview'}]});}}
