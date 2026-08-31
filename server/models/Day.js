import mongoose from 'mongoose';
const taskSchema=new mongoose.Schema({title:String,type:{type:String,enum:['learn','code','project','interview']},completed:{type:Boolean,default:false}},{_id:true});
const schema=new mongoose.Schema({day:{type:Number,unique:true},topic:String,tasks:[taskSchema],studyMinutes:{type:Number,default:0},score:{type:Number,default:0},feedback:{type:String,default:''}},{timestamps:true});
export default mongoose.model('Day',schema);
