var mongoose = require("mongoose");
var videoSchema = mongoose.Schema({
    title:{type:String,required:true},
    content:{type:String,required:true},
    createdAt:{type:Date,default:Date.now()},
    videos:{type:String,required:false,unique:false},
    thumbnail:{type:String,required:false,unique:false},
    userID:{type:mongoose.Schema.Types.ObjectId,required:false,unique:false},
    // postID:{type:mongoose.Schema.Types.ObjectId,required:true,unique:false},
    public:{type:Boolean,default:false,required:false,unique:false}
});
var Video = mongoose.model("Video",videoSchema);
module.exports = Video;