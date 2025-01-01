import mongoose from "mongoose";
import validator from "validator";
const passwordReset = mongoose.Schema({
    user_id:{type: String},
    uniqueString:{type:String}  ,
    email: {
        type: String,
        required: [true, "Email Is Required!"],
        Validator: [validator.isEmail, "Provide A Valid Email!"],
      },
    createdAt:{type:Date, default:Date.now()},
    expireAt:{type:Date,default:Date.now()},
})

export const PasswordReset = mongoose.model('PasswordReset',passwordReset);