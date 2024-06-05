import ErrorHandler from "../utils/errorHandler.js";

export default (err, req, res, next) => {
  let error = {
    statusCode: err?.statusCode || 500,
    message: err?.message || "Product not found!!",
  };
  //handling invalid id
  if (err.name === "CastError") {
    const message = `Resources not found, Invalid: ${err?.path}`;
    error = new ErrorHandler(message, 404);
  }

  //handle validation
  if (err.name === "ValidationError") {
    const message = Object.values(err.errors).map((value) => {
      return value.message;
    });
    error = new ErrorHandler(message, 400);
  }
  //handling mongoose duplicate key error

  if (err.code === 11000) {
    const message = `Duplicate ${Object.keys(err.keyValue)} entered`;
    error = new ErrorHandler(message, 400);
  }
  // handling jwt token error
  if (err.name === "JsonWebTokenError") {
    const message = `Invalid JSON web token, try again!`;
    error = new ErrorHandler(message, 400);
  }

  //handle expired JWT error
  if (err.name === "TokenExpiredError") {
    const message = `Json web token expired, login again.`;
    error = new ErrorHandler(message, 400);
  }

  if (process.env.NODE_ENV === "DEVELOPMENT") {
    res.status(error.statusCode).json({
      message: error.message,
      error: err,
      stack: err.stack,
    });
  }
  if (process.env.NODE_ENV === "PRODUCTION") {
    res.status(error.statusCode).json({
      message: error.message,
    });
  }
};
