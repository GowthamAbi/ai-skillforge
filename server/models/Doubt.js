import mongoose from "mongoose";
const schema=new mongoose.Schema({day:Number,topic:String,question:{type:String,required:true},answer:String},{timestamps:true});
export default mongoose.model("Doubt",schema);
