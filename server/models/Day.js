import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
  startTime:String, endTime:String, durationMinutes:{type:Number,default:0},
  type:{type:String,default:"learn"}, label:String, title:{type:String,required:true}, completed:{type:Boolean,default:false}
});
const daySchema = new mongoose.Schema({
  day:{type:Number,required:true,unique:true}, title:{type:String,required:true}, topic:{type:String,default:""},
  learningGoal:{type:String,default:""}, project:{type:String,default:""}, targetMinutes:{type:Number,default:280},
  tasks:{type:[taskSchema],default:[]}, studyMinutes:{type:Number,default:0}, score:{type:Number,default:0}, feedback:{type:String,default:""}
},{timestamps:true});
export default mongoose.model("Day",daySchema);
