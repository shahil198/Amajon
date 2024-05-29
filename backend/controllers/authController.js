import catchAsyncErrors from '../middlewares/catchAsyncErrors.js';
import User from '../models/user.js';

export const registerUser = catchAsyncErrors(async (req,res,next)=>{

    const {name,email,password} = req.body;
    const user = await User.create({name,email,password});


    const token = user.getJwtToken();

    res.status(201).json({
        token,
        success:true,
        data:user
    })

})