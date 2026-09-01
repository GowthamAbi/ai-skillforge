import "dotenv/config";
import mongoose from "mongoose";
import Day from "../models/Day.js";
import {
  roadmap
} from "./roadmap.js";
async function seed() {
  try {
    if(!process.env.MONGODB_URI)throw new Error("MONGODB_URI is missing");
    await mongoose.connect(process.env.MONGODB_URI,
    {
      dbName:process.env.MONGODB_DB||"aitraning"
    });
    for(const item of roadmap) {
      const old=await Day.findOne( {
        day:item.day
      }).lean(),taskDone=new Map((old?.tasks||[]).map(x=>[`${x.type}|${x.startTime}`,
      !!x.completed])),videoDone=new Map((old?.videos||[]).map(x=>[x.title,
      !!x.completed]));
      const tasks=item.tasks.map(x=>( {
        ...x,completed:taskDone.get(`${x.type}|${x.startTime}`)??false
      })),videos=item.videos.map(x=>( {
        ...x,completed:videoDone.get(x.title)??false
      }));
      await Day.updateOne( {
        day:item.day
      }, {
        $set: {
          ...item,tasks,videos,quizAttempts:old?.quizAttempts||[],
          project:old?.project?.title===item.project.title?old.project:item.project,
          studyMinutes:old?.studyMinutes||0,score:old?.score||0,
          feedback:old?.feedback||""
        }
      }, {
        upsert:true
      })
    }console.log(`Seeded/updated ${roadmap.length} days.`)
  }catch(e) {
    console.error(e);
    process.exitCode=1
  }finally {
    await mongoose.disconnect()
  }
}seed();
