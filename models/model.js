const mongoose =  require('mongoose')
const Joi = require('joi')
//schema design
const userSchema = Joi.object({
    title: Joi.string().min(3).max(100).required().timestamp().messages("you must enter the letter between 3-100"),
        
    
    description:Joi.string().min(1).max(1000).required().timestamp().messages("you must enter the letter between 1-1000"),
    is_released:Joi.boolean().required().timestamp().messages("you must enter the boolean value")   
     
});

const userModel = mongoose.model('movies',userSchema)
module.exports =  userModel