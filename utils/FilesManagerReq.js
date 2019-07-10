var fs = require('fs');
var multer=require('multer');
var pathStorage="./public/images/";
var Name="File";
var Extencion="";
module.exports.setPathStorage=function(dir){
  pathStorage=pathStorage.concat(dir);
}
module.exports.setDefaultNameAndExtencion = function(name,extecion){
  Name=name;
  Extencion=extecion;
}
module.exports.catchFile = function(){
    let diskStr={
      destination: pathStorage,
      filename: function(req,res,cb){

        cb(null, Name + "_" + Date.now() + Extencion);
      }
    };
    return  multer({
      storage: multer.diskStorage(diskStr)
    }).single('img');
}
module.exports.getFile=function(name){
  var file = fs.readFileSync(pathStorage + "/" + name);
  
  return file;
};
