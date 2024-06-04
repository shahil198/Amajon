import catchAsyncErrors from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../utils/errorHandler.js";
import Order from "../models/order.js"



//new order  /api/v1/orders/new
export const newOrder = catchAsyncErrors(async (req,res,next)=>{
  const {
    shippingInfo,
     orderItems,
     paymentMethod,
     paymentInfo,
     itemsPrice,
     taxAmount,
     shippingAmount,
     totalAmount
  }=req.body;

  const order = await Order.create({
    shippingInfo,
    orderItems,
    paymentMethod,
    paymentInfo,
    itemsPrice,
    taxAmount,
    shippingAmount,
    totalAmount,
    user:req.user._id
  });

  res.status(200).json({
    order
  })

})
