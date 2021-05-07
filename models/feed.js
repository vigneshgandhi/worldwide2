var mongoose = require("mongoose");

var fbSchema = mongoose.Schema({
    name:{type:String,required:true},
    email:{type:String,required:true},
    comment:{type:String,required:true},
    userID:{type:mongoose.Schema.Types.ObjectId,required:false,unique:false},
    public:{type:Boolean,default:true,required:false,unique:false},
    createdAt:{type:Date,default:Date.now()}
});

var Feed = mongoose.model("Feed",fbSchema);

module.exports = Feed;