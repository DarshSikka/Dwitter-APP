const mongoose=require("mongoose")
const schema=new mongoose.Schema({
    name:{
        type:String, 
        required:true
    },
    password:{
        type:String, 
        required:true
    },
    update_time:{
        type:Date, 
        default:Date.now
    }
});
const User=mongoose.model('User', schema, "everybody");
module.exports=User;