var mongoose = require('mongoose');

var resultSchema = new mongoose.Schema({
   stu_id :{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'student'
   },
   sub1:{
    type: Number
   },
   sub2:{
    type: Number
   },
   sub3:{
    type: Number
   },
   sub4:{
    type: Number
   },
   sub5:{
    type: Number
   },
   total:{
    type: Number
   },
   min:{
    type: Number
   },
   max:{
    type: Number
   },
   percentage:{
    type: Number
   },
   grade:{
    type: String
   },
   status:{
    type: String
   }
})

module.exports = mongoose.model('student_result', resultSchema)