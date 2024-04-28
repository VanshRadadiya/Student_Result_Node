var mongoose = require('mongoose');

var staffSchema = new mongoose.Schema({
    name:{
        type: String
    },
    username: {
        type: String
    },
    password:{
        type: String
    },
    std:{
        type: String
    },
    div:{
        type: String
    } 
})

module.exports = mongoose.model('staff', staffSchema)