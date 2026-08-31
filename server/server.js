import 'dotenv/config';import express from 'express';import cors from 'cors';import mongoose from 'mongoose';import api from './routes/api.js';
const app=express();app.use(cors({origin:process.env.CLIENT_URL||'http://localhost:5173'}));app.use(express.json());app.get('/api/health',(_,r)=>r.json({ok:true}));app.use('/api',api);
const port=process.env.PORT||5000;mongoose.connect(process.env.MONGODB_URI).then(()=>app.listen(port,()=>console.log(`API http://localhost:${port}`))).catch(e=>{console.error(e);process.exit(1)});
