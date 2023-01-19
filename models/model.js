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


