const mongoose=require("../connect");

var messageSchema=new mongoose.Schema({
    registerDate:{
        type:Date,
        default:new Date
    },
    idChat:String,
    idUser:String,
    msn:String,
    leido:{
        type:Boolean,
        default:false
    }
});

module.exports=mongoose.model("messege",messageSchema);