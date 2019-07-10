const mongoose = require('../connect');
const Schema = mongoose.Schema;

const productSchema ={
    idUser: String,
    name: String,
    price: Number,
    description: String,
    cant: Number,
    registerdate: Date,
    picture: String
};
//Nombre, precio, descripción, fechaderegistro, fotografía del producto
const product = mongoose.model('product', productSchema);

module.exports = product;
