import mongoose, { Schema } from "mongoose";
import validator from "validator";


const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, "First Name Is Required!"],
    minLength: [3, "First Name Must Contain At Least 3 Characters!"],
  },
  lastName: {
    type: String,
    required: [true, "Last Name Is Required!"],
    minLength: [3, "Last Name Must Contain At Least 3 Characters!"],
  },
  email: {
    type: String,
    required: [true, "Email Is Required!"],
    Validator: [validator.isEmail, "Provide A Valid Email!"],
  },
  password: {
    type: String,
    required: [true, "Password Is Required!"],
    minLength: [8, "Password Must Contain At Least 8 Characters!"],
    select: false,
  },
  location:{type: String},
  profession:{type: String},
  verificationcode:{type:String},
  isVerified:{type:Boolean,default:false},
  friends:[{type: Schema.Types.ObjectId, ref : "User"}],
  views:[{type: Schema.Types.ObjectId , ref:"User"}],
  profileUrl: {
    public_id: String,
    url: String,
  },

},{timestamps:true});



export const User = mongoose.model("User", userSchema);