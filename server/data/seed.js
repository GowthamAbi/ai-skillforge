import 'dotenv/config'; import mongoose from 'mongoose'; import Day from '../models/Day.js'; import {roadmap} from './roadmap.js';
await mongoose.connect(process.env.MONGODB_URI); for(const d of roadmap) await Day.updateOne({day:d.day},{$setOnInsert:d},{upsert:true}); console.log('50-day roadmap seeded'); await mongoose.disconnect();
