import "dotenv/config";
import mongoose from "mongoose";
import Day from "../models/Day.js";
import { roadmap } from "./roadmap.js";
async function seed(){
 try{
  if(!process.env.MONGODB_URI) throw new Error("MONGODB_URI is missing");
  await mongoose.connect(process.env.MONGODB_URI);
  for(const item of roadmap){
   const old=await Day.findOne({day:item.day}).lean();
   const completedByKey=new Map((old?.tasks||[]).map(t=>[`${t.type}|${t.startTime||''}`,!!t.completed]));
   const tasks=item.tasks.map(t=>({...t,completed:completedByKey.get(`${t.type}|${t.startTime}`)??false}));
   await Day.updateOne({day:item.day},{$set:{...item,tasks,studyMinutes:old?.studyMinutes||0,score:old?.score||0,feedback:old?.feedback||''}},{upsert:true});
  }
  console.log(`Seeded/updated ${roadmap.length} roadmap days without resetting tracked scores/time.`);
 }catch(e){console.error(e);process.exitCode=1}finally{await mongoose.disconnect()}
}
seed();
