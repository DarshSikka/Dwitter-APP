const mongoose=require("mongoose")
const DweetSchema=new mongoose.Schema({
    posted_by_name:{
        type:String, 
        required:true
    },
    posted_at:{
        type:Date, 
        default:new Date()
    },
    last_updated_at:{
        type:String, 
        default:new Date()
    },
    dweet:{
        type:String,
        required:true
    }
});
const Dweeter=mongoose.model("Dweeter", DweetSchema, "dweets");
module.exports=Dweeter;