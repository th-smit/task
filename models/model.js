const mongoose =  require('mongoose')


//schema design
const userSchema = new  mongoose.Schema({
    title:{
        type:String,
        unique:true
    },
    description:{
        type:String
    },
    is_released:{
    } 
},{timestamps : true})

module.exports = mongoose.model('movies',userSchema)




// userSchema.methods.joiValidate = function(obj){
//     var Joi = require('joi')
//     var schema = {
//         name: Joi.types.String().min(3).max(100).required(),
//         description : Joi.types.String().min(1).max(1000).required(),
//         is_released: Joi.types.String().required()
//     }
//     return Joi.ValidationError(obj,schema)
// }

