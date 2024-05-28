import ErrorHandler from "../utils/errorHandler.js";

export default (err,req,res,next)=>{
    let error= {
        statusCode: err?.statusCode || 500,
        message:err?.message ||"Product not found!!"
    }
    //handling invalid id
    if(err.name==="CastError"){
        const message=  `Resources not found, Invalid: ${err?.path}`;
        error = new ErrorHandler(message,404);
    }

    //handle validation
    if(err.name==="ValidationError"){
        const message = Object.values(err.errors).map((value)=>{
            return value.message
        })
        error = new ErrorHandler(message,400)
    }

    if(process.env.NODE_ENV==="DEVELOPMENT"){
        res.status(error.statusCode).json({
            message:error.message,
            error:err,
            stack:err.stack
        })
    }
    if(process.env.NODE_ENV==="PRODUCTION"){
        res.status(error.statusCode).json({
            message:error.message
        })
    }
   
} 