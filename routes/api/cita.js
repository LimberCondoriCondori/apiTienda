var express=require('express');
var router=express.Router();
var jwt = require('jsonwebtoken');

const CITAS = require('../../database/models/cita');

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

router.use(verifytoken);

router.get("/",(req,res)=>{
    CITAS.find(req.query,(err,docs)=>{
        if(err){
            res.status(500).json({msn:'error en la base de datos'});
        }
        res.status(200).json({docs});
    });
});

router.post("/",(req,res)=>{
    var cita=new CITAS(req.body);
    cita.save().then((doc)=>{
        res.status(200).json({
            msn:'Cita creada con exito',
            doc
        });
    }).catch((err)=>{
        res.status(500).json({
            msn:'error en la base de datos o algun parametro incorrecto',
            err
        });
    });
});

router.delete("/",(req,res)=>{
    CITAS.findOne({_id:req.query.id}).remove().exec((err,doc)=>{
        if(err)
            res.status(500).json({msn:'error en la base de datos',err});
        res.status(200).json({
            msn:"cita eliminada exitosamente!!!",
            doc
        });    
    });
});

router.patch("/",(req,res)=>{
    CITAS.findOneAndUpdate({_id:req.query.id},req.body,(err,doc)=>{
        if(err)
            res.status(500).json({msn:"error en la base de datos",err});
        res.status(200).json({msn:'cita actualizada exitosamente!!!',doc});
    });
});
module.exports=router;