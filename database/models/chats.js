const mongoose=require("../connect");

var chatsSchema=new mongoose.Schema({
    idVendedor:String,
    idComprador:String,
    idProduct:String
});

module.exports=mongoose.model("chats",chatsSchema);