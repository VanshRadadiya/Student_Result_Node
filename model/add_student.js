var mongoose = require('mongoose');

var studentSchema = new mongoose.Schema({
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

module.exports = mongoose.model('student', studentSchema)