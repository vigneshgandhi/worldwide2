var bcrypt = require("bcryptjs");
var mongoose = require("mongoose");
var SALT_FACTOR = 10;
var adminSchema = mongoose.Schema({
    username:{type:String, required:true},
    email:{type:String, required:true , unique:true}, 
    mobile:{type:Number,required:true,unique:true},
    avatar:{type:String,required:true,unique:false},
    password:{type:String, required:true},
    createdAt:{type:Date,default:Date.now()}
});

adminSchema.pre("save",function(done){
    var user =this;
    if(this.password >8){
        if(!user.isModified("password")){
            return done;
        }
    }
    bcrypt.genSalt(SALT_FACTOR,function(err,salt){
        if(err){
            return done(err);
        }
        else{
            bcrypt.hash(user.password,salt,function(err, hashedPassword){
                if(err){
                    return done(err);
                }
                else{
                    user.password = hashedPassword;
                    done();
                }
            });
        }
    });
});


adminSchema.methods.checkPassword = function(guess,done){
    if(this.password != null){
        bcrypt.compare(guess,this.password,function(err,isMatch){
            done(err,isMatch);
        });
    }
}

var Auser = mongoose.model("Auser",adminSchema);

module.exports = Auser;