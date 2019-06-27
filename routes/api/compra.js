var express = require('express');
var multer = require('multer');
var router = express.Router();
var fs = require('fs');
var jwt = require('jsonwebtoken');

const COMPRAS = require('../../database/models/compra');

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

router.post("/",verifytoken,(req, res)=>{
  var infocompra=req.body;
  // validacion

  //validacion
  var compradata = {
    idusers: infocompra.idusers,
    pagoTotal: infocompra.pagoTotal,
    lat: infocompra.lat,
    long: infocompra.long,
    registerdate: new Date

  }
  //-------
  //inforder["registerdate"]=new Date();
  //console.log("servicio encontrado");
  var compra= new COMPRAS(compradata);
  //console.log("ruta del modelo encontrado");
  compra.save().then((rr)=>{
      res.status(200).json({
        "msn": "orden de compra agregado con exito"
      });
  });

});

router.get("/user",(req,res)=>{
  var idu = req.query.idu;

  COMPRAS.find({idusers: idu}).exec((err,docs)=>{
    if(err){
      res.status(500).json({
        "msn":"Error en la base de datos"
      });
      return;
    }
    res.status(200).json(docs);
  });

});


router.delete("", verifytoken, (req, res) => {
  //var url = req.url;
  var id = req.query.id;
  COMPRAS.find({_id : id}).remove().exec( (err, docs) => {
      res.status(200).json(docs);
  });
});
router.patch("/",verifytoken,(req,res)=>{
  var params = req.body;
  var idcom = req.query.idcom;
  //Collection of data
  var keys = Object.keys(params);
  var updatekeys = ["pagoTotal", "lat","long"];
  var newkeys = [];
  var values = [];
  //seguridad
  for (var i  = 0; i < updatekeys.length; i++) {
    var index = keys.indexOf(updatekeys[i]);
    if (index != -1) {
        newkeys.push(keys[index]);
        values.push(params[keys[index]]);
    }
  }
  var objupdate = {}
  for (var i  = 0; i < newkeys.length; i++) {
      objupdate[newkeys[i]] = values[i];
  }
  console.log(objupdate);
  COMPRAS.findOneAndUpdate({_id: idcom}, objupdate ,(err, docs) => {
    if (err) {
      res.status(500).json({
          msn: "Existe un error en la base de datos"
      });
      return;
    }
    var ido = docs._ido
    res.status(200).json({
      msn: docs
    })
  });
});


module.exports = router;
//
