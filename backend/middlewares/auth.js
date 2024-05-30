import catchAsyncErrors from "../middlewares/catchAsyncErrors.js";
import jwt from 'jsonwebtoken'
import User from "../models/user.js";

export const isAuthenticatedUser = catchAsyncErrors(async (req,res,next)=>{

    const {token} =req.cookies;

    if(!token){
        return next(new Error('Login first to access',400))
    }
    const decode = jwt.verify(token,process.env.JWT_STRING);
    //the decode will have payload of the user which is id through which we can get the detail of the login user

    // console.log(decode);  

    req.user= await User.findById(decode.id);
    next();

})