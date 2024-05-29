import mongoose from "mongoose";
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true,"Please enter you name"],
        maxLength:[50,"Name should not exceed 50 characters"]
    },
    email:{
        type:String,
        unique:[true,"Email should be unique"],
        required:[true,"Please enter the email"]
    },
    password:{
        type:String,
        required:[true,"Please enter the password"],
        minLength:[6,"Enter password of length greater than 5 characters"],
        select:false
    },
    avatar:{
        public_id:String,
        url:String
    },
    role:{
        type:String,
        default:"user"
    },
    resetPasswordToken:String,
    resetPasswordExpire:Date

},{timestamps:true})

//hashing the password
userSchema.pre("save", async function(next){
   if(!this.isModified("password")){
    next();
   }
   this.password= await bcrypt.hash(this.password,10)
})

//generating jwt token
userSchema.methods.getJwtToken = function (){
   return jwt.sign({id:this._id}, process.env.JWT_STRING,{
        expiresIn:process.env.JWT_EXPIRES_IN
    })
}

export default mongoose.model('User',userSchema)