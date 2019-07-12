var router=require('express').Router();
var jwt=require('jsonwebtoken');
var CHAT=require("./chatController");
const MESSAGES=require("../../database/models/message");

function verifytoken (req, res, next) {
    //Recuperar el header
    const header = req.headers["authorization"];
    if (header  == undefined) {
        res.status(403).json({
          msn: "No autotizado"
        })
    } else {
        req.token = header.split(" ")[1];
        jwt.verify(req.token, "seponeunallavesecreta", (err, authData) => {
          if (err) {
            res.status(403).json({
              msn: "No autotizado"
            })
          } else {
            next();
          }
        });
    }
}

//router.use(verifytoken);

router.post("/",(req,res)=>{
    let doc=CHAT.nuevo(req.body);
    if(doc)
        res.status(200).json(doc);
});

router.delete("/",(req,res)=>{
    CHAT.delete({_id:req.query.id});
    CHAT.deleteMessage({idChat:req.query.id});
    res.status(200).json({msn:"chat eliminado con exito!!!"});
});

router.delete("/msn/",(req,res)=>{
    CHAT.deleteMessage({_id:req.query.id});
    res.status(200).json({msn:"mensaje eliminado con exito!!!"});
});

router.get("/",async (req,res)=>{
    var chats=await CHAT.get(req.query);
    
    var result=[];
    for(var numC=0;numC<chats.length;numC++){
        console.log(chats);
        var messs=await MESSAGES.find({idChat: chats[numC]._id});
        var messU=[];
        var cont=0;
        for(var i=messs.length-1;i>=messs.length-31&&i>=0;i--){
            messU[cont++]=messs[i];
        }
        result[numC]={
            _id:chats[numC]._id,
            idVendedor:chats[numC].idVendedor,
            idComprador:chats[numC].idComprador,
            msns:messU
        };
    }
    res.status(200).json(result);
});







module.exports=router;