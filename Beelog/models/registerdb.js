const moongose = require('mongoose');
const Schema = moongose.Schema;

const userRegiter = new Schema({
name:{
    type:String,
    required:true
},

password:{
    type:String,
    required:true
}


})

const Register = moongose.model('Register',userRegiter)

module.exports = Register;