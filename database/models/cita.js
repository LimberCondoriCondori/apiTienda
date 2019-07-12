const mongoose=require('../connect');

var citaSchema=new mongoose.Schema({
    idCompra:String,
    date:Date,
    time:String,
    lat:Number,
    long:Number,
    accept:{
        type:Boolean,
        default:false
    },
    state:{
        type:Boolean,
        default:false
    }
});

module.exports=mongoose.model("cita",citaSchema);