var mongoose = require('mongoose');

var adminSchema = new mongoose.Schema({
    name:{
        type: String
    },
    email: {
        type: String
    },
    password:{
        type: String
    } 
})

module.exports = mongoose.model('admin', adminSchema)