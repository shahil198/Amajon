import { resolveSoa } from "dns";
import catchAsyncErrors from "../middlewares/catchAsyncErrors.js";
import User from "../models/user.js";
import { getResetPasswordTemplate } from "../utils/emailTemplate.js";

import ErrorHandler from "../utils/errorHandler.js";
import sendEmail from "../utils/sendEmail.js";
import { sendToken } from "../utils/sendToken.js";
import crypto from "crypto";
import user from "../models/user.js";

//register user /api/v1/register
export const registerUser = catchAsyncErrors(async (req, res, next) => {
   const { name, email, password } = req.body;

   const user = await User.create({ name, email, password });

   sendToken(user, 201, res);
});

//login user /api/v1/login

export const loginUser = catchAsyncErrors(async (req, res, next) => {
   const { email, password } = req.body;

   if (!email || !password) {
      return next(new ErrorHandler("Please enter email & password", 400));
   }

   const user = await User.findOne({ email }).select("+password");

   if (!user) {
      return next(new ErrorHandler("Incorrect user Email", 400));
   }

   const isPassword = await user.comparePassword(password);

   if (!isPassword) {
      return next(new ErrorHandler("Please enter correct password", 401));
   }
   sendToken(user, 201, res);
});

//logout user /api/v1/logout

export const logout = catchAsyncErrors(async (req, res, next) => {
   res.cookie("token", null, {
      expires: new Date(Date.now()),
      httpOnly: true,
   });

   res.status(200).json({
      success: true,
   });
});

// forgot password  /api/v1/password/forgot

export const forgotPassword = catchAsyncErrors(async (req, res, next) => {
   const email = req.body.email;
   const user = await User.findOne({ email });

   if (!user) {
      return next(
         new ErrorHandler("User with this email does not exist.", 404),
      );
   }
   //get reset password token

   const resetToken = user.getResetPasswordToken();

   await user.save();

   //create reseturl
   const resetUrl = `${process.env.FRONTEND_URL}/api/v1/password/reset/${resetToken}`;

   const message = getResetPasswordTemplate(user?.name, resetUrl);

   try {
      await sendEmail({
         email: user.email,
         subject: "Amajon recovery password link",
         message,
      });

      res.status(200).json({
         message: `email sent successfully to the ${user?.email}`,
      });
   } catch (error) {
      (user.resetPasswordToken = undefined),
         (user.resetPasswordToken = undefined);

      await user.save();

      return next(new ErrorHandler(error?.message, 500));
   }
});

//reset password /api/v1/password/reset/:token
export const resetPassword = catchAsyncErrors(async (req, res, next) => {
   const resetPasswordToken = crypto
      .createHash("sha256")
      .update(req.params.token)
      .digest("hex");

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
   console.log(user?.email);
   console.log("DDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDdd");

   if (!user) {
      return next(
         new ErrorHandler(
            `Reset Password Token is invalid or reset Password Token expires`,
            400,
         ),
      );
   }

   if (req.body.password !== req.body.confirmPassword) {
      return next(new ErrorHandler(`Passwords doesn't matched`, 404));
   }

   user.password = req.body.password;

   user.resetPasswordExpire = undefined;
   user.resetPasswordToken = undefined;

   await user.save();

   sendToken(user, 200, res);
});

//curr user profile  api/v1/me

export const getProfile = catchAsyncErrors(async (req, res) => {
   const user = await User.findById(req?.user?.id);

   res.status(200).json({
      user,
   });
});

//update user password   api/v1/password/update

export const updatePassword = catchAsyncErrors(async (req, res, next) => {
   const user = await User.findById(req?.user?.id).select("+password");

   const isPasswordMatched = await user.comparePassword(req.body.oldPassword);

   if (!isPasswordMatched) {
      return next(new ErrorHandler("Old password didn't matched", 400));
   }

   user.password = req.body.password;

   await user.save();

   res.status(200).json({
      success: true,
   });
});

//update profile /api/v1/me/update

export const updateProfile = catchAsyncErrors(async (req, res, next) => {
   const newDetails = {
      email: req.body.email,
      name: req.body.name,
   };

   const user = await User.findByIdAndUpdate(req?.user?.id, newDetails, {
      new: true,
   });

   res.status(200).json({
      user,
   });
});

//get all users  /api/v1/admin/users

export const getUsers = catchAsyncErrors(async (req, res, next) => {
   const users = await User.find();

   res.status(200).json({
      users,
   });
});

//get particular user  /api/v1/admin/users/:id

export const getUserDetails = catchAsyncErrors(async (req, res, next) => {
   const user = await User.findById(req.params.id);

   if (!user) {
      return next(
         new ErrorHandler(`user not found with id: ${req.params.id}`, 404),
      );
   }
   res.status(200).json({
      user,
   });
});

//update the user by admin   /api/v1/admin/users/:id
export const updateUser = catchAsyncErrors(async (req, res, next) => {
   const updatedData = {
      name: req.body.name,
      email: req.body.email,
      role: req.body.role,
   };

   const user = await User.findByIdAndUpdate(req.params.id, updatedData, {
      new: true,
   });
   res.status(200).json({
      user,
   });
});

//delete the user by admin   /api/v1/admin/users/:id

export const deleteUser = catchAsyncErrors(async (req, res, next) => {
   const user = await User.findById(req.params.id);

   if (!user) {
      return next(
         new ErrorHandler(`user not found with id ${req.params.id}`, 404),
      );
   }
   await user.deleteOne();

   res.status(200).json({
      success: true,
   });
});
