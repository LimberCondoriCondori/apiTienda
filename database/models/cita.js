const mongoose=require('../connect');

var citaSchema=new mongoose.Schema({
    idCompra:String,
    date:String,
    time:String,
    lat:Number,
    long:Number,
    street:String,
    
    state:{
        type:Boolean,
        default:false
    }
});

module.exports=mongoose.model("cita",citaSchema);