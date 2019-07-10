var express = require('express');
var multer = require('multer');
var router = express.Router();
var fs = require('fs');
var jwt = require("jsonwebtoken");
var sha1 = require('sha1');

const USERS = require("../../database/models/users");

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
          });
        } else {
          next();
        }
      });
  }
}
router.post("/login", (req, res, next) => {
  var email = req.body.email;
  var password = req.body.password  ;
  var result = USERS.findOne({email: email,password: sha1(password)}).exec((err, doc) => {
    if (err) {
      console.log("error");
      res.status(200).json({
        msn : "No se puede concretar con la peticion "
      });
      return;
    }
    if (doc) {
      //res.status(200).json(doc);
      jwt.sign({email: doc.email, password: sha1(doc.password)}, "seponeunallavesecreta", (err, token) => {
          console.log("sesion exitosa");
          res.status(200).json({
            token : token,
            idUser: doc._id
          });
      })
    } else {
      console.log("error enviar token");
      res.status(200).json({
        msn : "El usuario no existe ne la base de datos"
      });
    }
  });
});

router.post("/login_with_google",(req,res)=>{
  var email=req.body.email;
  var firstname=req.body.firstname;
  USERS.findOne({email: email,firstname: firstname}).exec((err, doc) => {
      if(!doc){
          req.body.password=sha1(req.body.password);
          req.body.registerdate=Date.now();
          var user=new USERS(req.body);
          user.save().then((docs)=>{
            jwt.sign({email: docs.email, password: docs.password}, "seponeunallavesecreta", (err, token) => {
              console.log("sesion exitosa");
              res.status(200).json({
                token : token,
                idUser: docs._id
              });
            });
          }); 
      }else{
        jwt.sign({email: doc.email, password: doc.password}, "seponeunallavesecreta", (err, token) => {
          console.log("sesion exitosa");
          res.status(200).json({
            token : token,
            idUser: doc._id
          });
        });
      }
  });

});

router.post("/", (req, res) => {
  var users = req.body;
  //Validacion de datosssss
  var firstname_reg = /\w{3,}/g
  var surname_reg = /\w{3,}/g
  var email_reg = /\w{1,}@[\w.]{1,}[.][a-z]{2,3}/g
  var phone_reg = /\d{7}[0-9]/g
  var password_reg =/\w{6,}/g
  console.log(users);
  if(users.firstname.match(firstname_reg) == null){
    res.status(400).json({
      msn : "el nombre de usuario no es correcto"
    });
    return;
  }
  if(users.surname.match(surname_reg) == null){
    res.status(400).json({
      msn : "el nombre de usuario no puede ser incompleto"
    });
    return;
  }
  if(users.email.match(email_reg) == null){
    res.status(400).json({
      msn : "el email no es correcto"
    });
    return;
  }
  if(users.password==undefined || users.password.match(password_reg) == null){
    res.status(400).json({
      msn : "el password no es correcto requiere mas de 6 caracteres "
    });
    return;
  }

  var usersdata = {
    firstname: users.firstname,
    surname: users.surname,
    email: users.email,
    phone: users.phone,
    password: sha1(users.password),
    registerdate: new Date
  };
  //Validar ojo
  users["registerdate"] = new Date();
  var use = new USERS(usersdata);
  use.save().then((docs) => {
    res.status(200).json(docs);
  });
});

router.get("/",(req, res) => {

  USERS.find(req.query).exec((err, docs) => {
    if (err) {
      res.status(500).json({
        "msn" : "Error en la db"
      });
      return;
    }
    res.status(200).json(docs);
  });
});

router.patch("/", function (req, res) {
  var params = req.body;
  var id = req.query.id;
  //Collection of data
  var keys = Object.keys(params);
  var updatekeys = ["firstname", "surname", "email", "phone"];
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
  USERS.findOneAndUpdate({_id: id}, objupdate,(err, docs) => {
    if (err) {
      res.status(500).json({
          msn: "Existe un error en la base de datos"
      });
      return;
    }
    var id = docs._id
    res.status(200).json({
      msn: id
    })
  });
});


router.delete('/:id', function (req, res, next) {
  var idUser = req.params.id;

  USERS.remove({
      _id: idUser
  }).exec((err, result) => {
      if (err) {
          res.status(500).json({
              error: err
          });
          return;
      }
      if (result) {
          res.status(200).json({
              message: "Usuario eliminado",
              result: result
          })
      }
  })
});

module.exports = router;
