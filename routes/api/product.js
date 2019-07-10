var express = require('express');
var multer = require('multer');
var router = express.Router();
var jwt = require('jsonwebtoken');
var fmr= require('../../utils/FilesManagerReq');
fmr.setPathStorage('products');
fmr.setDefaultNameAndExtencion("IMG",".jpg");

//router.use(fmr.catchFile());

const PRODUCTS = require('../../database/models/product');

//verificacion verifytoken

//Middelware
function verifytoken (req, res, next) {
  //Recuperar el header

  console.log(req.headers);
  console.log(req.query);
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
  //var infoproduct=req.body;
  // validacion
  var name_reg = /\w{3,}/g
   var price_reg =/\d{1,3}.\d{0,2}/g
   var des_reg =/\w{3,}/g
   if(req.body.name.match(name_reg) == null){
    res.status(200).json({
      msn : "nombre de producto invalido "
    });
    return;
   }
   if(req.body.price.match(price_reg) == null){
    res.status(200).json({
      msn : "precio invalido"
    });
    return;
   }
   if(req.body.description.match(des_reg) == null){
    res.status(200).json({
      msn : "descripcion no introducida"
    });
    return;
  }
  if(req.body.cant==undefined){
    res.status(200).json({
      msn : "cantidad no introducida"
    });
    return;
  }
  req.body.registerdate= new Date;
  //validacion
  var productos= new PRODUCTS(req.body);

  console.log(productos);
  console.log("ruta del modelo encontrado");
  productos.save().then((docs)=>{
    console.log(docs);
    res.status(200).json({
      id:docs._id
    }
    );
  }).catch((rr)=>{
      res.status(404).json({
        "msn": rr
      });
  });

});
//n subida de imagenes
router.post("/uploadImg",verifytoken,fmr.catchFile(),(req,res)=>{
  var id =req.query.id;
  if(id == null){
    res.status(300).json({
      "msn":"se debe especificar id"
    });
    return;
  }
  PRODUCTS.find({_id:id}).exec((err,docs)=>{
    if(err){
      res.status(300).json({
        "msn":"se debe especificar id"
      });
      return;
    }
    if(docs.length==1){

          let imagename=req.file.filename;
          PRODUCTS.update({_id: id}, {$set:{picture:imagename}}, (err, docs) => {
            if (err) {
              res.status(200).json({
                "msn" : err
            });
              return;
            }
            res.status(200).json(docs);
          });
    }else{
      res.status(300).json({
        "msn":"el id del producto no a sido encontrado"
      });
    }
  });
});

router.patch("/",verifytoken,(req,res)=>{
  var params = req.body;
  var id = req.query.id;
  //Collection of data
  var keys = Object.keys(params);
  var updatekeys = ["name", "price", "description"];
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
  PRODUTS.findOneAndUpdate({_id: id}, objupdate ,(err, docs) => {
    if (err) {
      res.status(500).json({
          msn: "Existe un error en la base de datos"
      });
      return;
    }
    var id = docs._id
    res.status(200).json({
      msn: docs
    })
  });
});

router.get("/",(req,res)=>{
  var skip = 0;
  var limit = 50;
  if(req.query.skip != undefined)
    skip = req.query.skip;
  if(req.query.limit != undefined)
    limit = req.query.limit;
  PRODUCTS.find({}).skip(skip).limit(limit).exec((err,docs)=>{
    if(err){
      res.status(500).json({
        "msn":"Error en la base de datos"
      });
      return;
    }
    res.status(200).json(docs);
  });

});

router.get("/user",(req,res)=>{
  var idUser=req.query.idUser;
  var skip = 0;
  var limit = 50;
  if(req.query.skip != undefined)
    skip = req.query.skip;
  if(req.query.limit != undefined)
    limit = req.query.limit;
  PRODUCTS.find({idUser:idUser}).skip(skip).limit(limit).exec((err,docs)=>{
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
  PRODUCTS.find({_id : id}).remove().exec( (err, docs) => {
      res.status(200).json(docs);
  });
});
router.patch('/:id', function (req, res, next) {
  let idProduct = req.params.id;
  let productData = {};
  Object.keys(req.body).forEach((key) => {
      productData[key] = req.body[key];
  })

  PRODUCTS.findByIdAndUpdate(idProduct, productData).exec((err, result) => {
      if (err) {
          res.status(500).json({
              error: err
          });
          return;
      }
      if (result) {
          res.status(200).json({
              message: "Se actualizaron los datos"

          })
      }
  })
});

router.get('/downloadImg',(req,res)=>{
  var img=fmr.getFile(req.query.img);
  res.contentType('image/jpeg');
  res.status(200).send(img);
});

module.exports = router;
