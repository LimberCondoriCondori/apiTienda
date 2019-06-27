const mongoose = require('../connect');
const Schema = mongoose.Schema;

const compraSchema = Schema({

    idusers: String,
    pagoTotal: String,
    lat: String,
    long: String,
    registerdate: Date

})

const compra = mongoose.model('compra',compraSchema);

module.exports = compra;
