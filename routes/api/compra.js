var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');

const COMPRAS = require('../../database/models/compra');
const CITA = require('../../database/models/cita');

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
  //infocompra.registerDate=new Date;
  // validacion
  console.log(infocompra);
  //validacion
  //-------
  //inforder["registerdate"]=new Date();
  //console.log("servicio encontrado");
  var compra= new COMPRAS(infocompra);
  //console.log("ruta del modelo encontrado");
  console.log(compra);
  compra.save().then((rr)=>{
      res.status(200).json({
        id:compra._id,
        "msn": "orden de compra agregado con exito",
      });
  });

});

router.get("/user",(req,res)=>{
  var idu = req.query.idu;

  COMPRAS.find({idUsers: idu}).exec((err,docs)=>{
    if(err){
      res.status(500).json({
        "msn":"Error en la base de datos"
      });
      return;
    }
    res.status(200).json(docs);
  });

});

router.get("/",(req,res)=>{
  //var idu = req.query.idu;

  COMPRAS.find(req.query).exec((err,docs)=>{
    if(err){
      res.status(500).json({
        "msn":"Error en la base de datos"
      });
      return;
    }
    res.status(200).json(docs);
  });

});


router.delete("/", verifytoken, (req, res) => {
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
  /*var keys = Object.keys(params);
  var updatekeys = ["pagoTotal"];
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
  console.log(objupdate);*/
  COMPRAS.findOneAndUpdate({_id: idcom}, req.body ,(err, docs) => {
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
