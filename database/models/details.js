const mongoose = require('../connect');
const Schema = mongoose.Schema;

const detailsSchema = Schema({
    idproduct: String,
    idcompra: String,
    cantidad: Number,
    registerdate: Date

})

const details = mongoose.model('details', detailsSchema);

module.exports = details;
