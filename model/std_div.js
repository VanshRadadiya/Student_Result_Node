var mongoose = require('mongoose');

var Std_Div_Schema = new mongoose.Schema({
    std:{
        type: String
    },
    div:{
        type: String
    } 
})

module.exports = mongoose.model('std_div', Std_Div_Schema)