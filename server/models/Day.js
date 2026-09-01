import mongoose from "mongoose";
const taskSchema=new mongoose.Schema( {
  startTime:String,endTime:String,durationMinutes: {
    type:Number,default:0
  },type:String,label:String,title: {
    type:String,required:true
  },completed: {
    type:Boolean,default:false
  }
});
const videoSchema=new mongoose.Schema( {
  title:String,duration:String,completed: {
    type:Boolean,default:false
  }
});
const mcqSchema=new mongoose.Schema( {
  question:String,options:[String],answer:Number
}, {
  _id:false
});
const attemptSchema=new mongoose.Schema( {
  answers:[Number],score:Number,total:Number,
  wrong:[Number],attemptedAt: {
    type:Date,default:Date.now
  }
}, {
  _id:false
});
const reviewSchema=new mongoose.Schema( {
  score:Number,passed:Boolean,feedback:String,
  corrections:[String],submittedAt: {
    type:Date,default:Date.now
  }
}, {
  _id:false
});
const projectSchema=new mongoose.Schema( {
  title:String,goal:String,requirements: {
    type:[String],default:[]
  },status: {
    type:String,default:"not-started"
  },githubUrl:String,submission:String,filename:String,
  score: {
    type:Number,default:0
  },feedback:String,corrections: {
    type:[String],default:[]
  },attempts: {
    type:[reviewSchema],default:[]
  }
}, {
  _id:false
});
const daySchema=new mongoose.Schema( {
  day: {
    type:Number,required:true,unique:true
  },course:String,title:String,topic:String,
  learningGoal:String,project:projectSchema,
  targetMinutes: {
    type:Number,default:280
  },videos: {
    type:[videoSchema],default:[]
  },mcqs: {
    type:[mcqSchema],default:[]
  },quizAttempts: {
    type:[attemptSchema],default:[]
  },tasks: {
    type:[taskSchema],default:[]
  },studyMinutes: {
    type:Number,default:0
  },daySubmitted: {
    type:Boolean,default:false
  },submittedAt: {
    type:Date,default:null
  },score: {
    type:Number,default:0
  },feedback: {
    type:String,default:""
  }
}, {
  timestamps:true
});
export default mongoose.model("Day",daySchema);
