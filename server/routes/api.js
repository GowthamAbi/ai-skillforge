import {Router} from 'express';import Day from '../models/Day.js';import {githubToday} from '../services/githubService.js';import {mentor} from '../services/openaiService.js';
const r=Router();
r.get('/days',async(_,res)=>res.json(await Day.find().sort({day:1})));
r.get('/dashboard',async(_,res)=>{const days=await Day.find().sort({day:1});const done=days.reduce((a,d)=>a+d.tasks.filter(t=>t.completed).length,0),total=days.reduce((a,d)=>a+d.tasks.length,0);const current=days.find(d=>d.tasks.some(t=>!t.completed))||days.at(-1);res.json({days,current,completion:total?Math.round(done/total*100):0,totalMinutes:days.reduce((a,d)=>a+d.studyMinutes,0)});});
r.patch('/days/:day/task/:taskId',async(req,res)=>{const d=await Day.findOne({day:req.params.day});const t=d?.tasks.id(req.params.taskId);if(!t)return res.status(404).json({error:'Task not found'});t.completed=!!req.body.completed;await d.save();res.json(d);});
r.patch('/days/:day/time',async(req,res)=>res.json(await Day.findOneAndUpdate({day:req.params.day},{$set:{studyMinutes:Math.max(0,Number(req.body.studyMinutes)||0)}},{new:true})));
r.get('/github',async(_,res)=>res.json(await githubToday()));
r.post('/days/:day/score',async(req,res)=>{const d=await Day.findOne({day:req.params.day});if(!d)return res.status(404).json({error:'Day not found'});const g=await githubToday();const a=await mentor(d,g);d.score=Math.max(0,Math.min(100,Number(a.score)||0));d.feedback=a.feedback||'';await d.save();res.json({day:d,github:g});});
export default r;
