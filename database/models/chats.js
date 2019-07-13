const mongoose=require("../connect");

var chatsSchema=new mongoose.Schema({
    idVendedor:String,
    idComprador:String,
    idProduct:{
        type:String,
        default:"gifukfkuflfkuf"
    }
});

module.exports=mongoose.model("chats",chatsSchema);