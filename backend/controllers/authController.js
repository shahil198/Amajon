import { resolveSoa } from 'dns';
import catchAsyncErrors from '../middlewares/catchAsyncErrors.js';
import User from '../models/user.js';
import { getResetPasswordTemplate } from '../utils/emailTemplate.js';

import ErrorHandler from '../utils/errorHandler.js';
import sendEmail from '../utils/sendEmail.js';
import { sendToken } from '../utils/sendToken.js';
import crypto from 'crypto';

//register user /api/v1/register
export const registerUser = catchAsyncErrors(async (req,res,next)=>{

    const {name,email,password} = req.body;
    const user = await User.create({name,email,password});

   
    sendToken(user,201,res);
   

})

//login user /api/v1/login

export const loginUser = catchAsyncErrors(async (req,res,next)=>{

    const {email,password}=req.body;

    if(!email || !password){
        return next(new ErrorHandler("Please enter email & password",400));
    }

    const user = await User.findOne({email}).select("+password");

    if(!user){
        return next(new ErrorHandler("Incorrect user Email",400));
    }

    const isPassword = await user.comparePassword(password);
   

    if(!isPassword){
        return next(new ErrorHandler("Please enter correct password",401));
    }
    sendToken(user,201,res);

})

//logout user /api/v1/logout

export const logout = catchAsyncErrors(async(req,res,next)=>{

    res.cookie("token",null,{
        expires:new Date(Date.now()),
        httpOnly:true
    })

    res.status(200).json({
        success:true
    })
})

// forgot password  /api/v1/password/forgot

export const forgotPassword = catchAsyncErrors( async (req,res,next)=>{

   const  email=req.body.email;
   const user = await User.findOne({email});

   if(!user){
        return next(new ErrorHandler('User with this email does not exist.',404));
   }
   //get reset password token

   const resetToken = user.getResetPasswordToken();

   await user.save();

   //create reseturl
    const resetUrl = `${process.env.FRONTEND_URL}/api/v1/password/reset/${resetToken}`;

    const message = getResetPasswordTemplate(user?.name,resetUrl);

    try {
         await sendEmail({
            email:user.email,
            subject:'Amajon recovery password link',
            message
         })

         res.status(200).json({
            message:`email sent successfully to the ${user?.email}`
         })
    } catch (error) {
        user.resetPasswordToken=undefined,
        user.resetPasswordToken=undefined

        await user.save();

        return  next(new ErrorHandler(error?.message, 500))
    }


})

//reset password /api/v1/password/reset/:token
export const resetPassword = catchAsyncErrors( async (req,res,next)=>{

    const resetPasswordToken = crypto.createHash('sha256').update(req.params.token).digest('hex');
                                 

    console.log(resetPasswordToken);

    // const user = await User.findOne({
    //     resetPasswordToken,
    //     resetPasswordExpire :{ $gt : Date.now() },
    // })
    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire: { $gt: Date.now() },
      });

    console.log(user);
    console.log(user?.email)
     console.log("DDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDdd");

    if(!user){
        return next(new ErrorHandler(`Reset Password Token is invalid or reset Password Token expires`, 400))
    }

    if(req.body.password !== req.body.confirmPassword){
        return next(new ErrorHandler(`Passwords doesn't matched`,404))
    }

    user.password=req.body.password;

    user.resetPasswordExpire=undefined;
    user.resetPasswordToken=undefined;

    await user.save();

    sendToken(user,200,res)
    


})