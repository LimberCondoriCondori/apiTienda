var CHATS=require("../../database/models/chats");
var MESSAGE=require('../../database/models/message');
module.exports.nuevo=(datos)=>{
    let chat=new CHATS(datos);
    return chat.save();
}
module.exports.get=async (datos)=>{
    var chats=(await CHATS.find(datos));    
    return chats;
}
module.exports.delete=(datos)=>{
    CHATS.findOne(datos).remove((err)=>{
        console.log("Error al eliminar chat!!!");
    });
}
module.exports.setMessage=(datos)=>{
    //datos.registerDate=new Date;
    let mess=new MESSAGE(datos);
    mess.save();
}
module.exports.getMessage=(chatId)=>{
    let mess=null;
    MESSAGE.find({idChat:chatId},(err,docs)=>{
        if(docs)
            mess=docs;
    });
    return docs;
}

module.exports.deleteMessage=(datos)=>{
    MESSAGE.findOne(datos).remove((err)=>{
        console.log("Error al eliminar Mensage!!!");
    });
}