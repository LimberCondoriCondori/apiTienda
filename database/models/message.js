const mongoose=require("../connect");

var messageSchema=new mongoose.Schema({
    registerDate:Date,
    idChat:String,
    idUser:String,
    msn:String,
});

module.exports=mongoose.model("messege",messageSchema);