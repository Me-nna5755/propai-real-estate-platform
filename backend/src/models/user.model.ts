
import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
    fullName:{
       type: String,
       required:true
    },

  email: {
    type: String,
    required: true,
    unique: true ,
    lowercase:true
  },
  password: {
    type: String,
    required: true
  },
  role:{
    type:String,
    enum:["Customer","Admin","Agent"],
    default:"Customer"
  }

}, {
  timestamps: true
})

export const User = mongoose.model('User', userSchema)