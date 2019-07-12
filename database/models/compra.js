const mongoose = require('../connect');
const Schema = mongoose.Schema;

const compraSchema = Schema({
    idComprador: String,
    idVendedor:String,
    idProducto: String,
    pagoTotal: String,
    registerDate: Date,
    cantidad:Number,
})

const compra = mongoose.model('compra',compraSchema);

module.exports = compra;
