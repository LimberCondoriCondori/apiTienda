const mongoose = require('../connect');
const Schema = mongoose.Schema;

const usersSchema = Schema({

    firstname: String,
    surname: String,
    email: String,
    phone: String,
    password: String,
    registerdate: Date
});




const users = mongoose.model('users', usersSchema);

module.exports = users;
