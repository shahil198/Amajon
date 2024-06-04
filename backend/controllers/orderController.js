import catchAsyncErrors from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../utils/errorHandler.js";
import Order from "../models/order.js"
import Product from "../models/product.js";



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

//get order details by id  /api/v1/orders/:id

export const getOrderDetails = catchAsyncErrors(async (req,res,next)=>{
    const order= await Order.findById(req.params.id).populate("user" ,"name email");

    if(!order){
        return next(new ErrorHandler(`no order found with the order id :${req.params._id}`))
    }

    res.status(200).json(order);
})

//get orders of the current user /api/v1/me/orders

export const getAllOrders = catchAsyncErrors(async(req,res,next)=>{
    const orders = await Order.find({user:req.user.id});

    res.status(200).json({
        orders
    })
})

//get all orders by admin  /api/v1/admin/orders

export const allOrders = catchAsyncErrors(async (req,res,next)=>{
    const order = await Order.find();

    res.status(200).json({
        order
    })
})

//update the order by admin   admin/orders/:id

export const updateOrders = catchAsyncErrors(async (req,res,next)=>{
    const order = await Order.findById(req?.params?.id);

    if(!order){
        return next(new ErrorHandler(`Order not found with id :${req?.params?.id}`,404))
    }
    if(order?.orderStatus === "Delivered"){
        return next(new ErrorHandler(`Order with id: ${req?.params?.id} is already shipped`, 400)
        )
    }

    //update the stock of the product 
    order.orderItems.forEach(async (item)=>{
        const product = await Product.findById(item?.product?.toString());
        if(!product){
            return next(new ErrorHandler(`Product not found with id:${item.product}`,400))
        }
        product.stock-=item.quantity

        await product.save({validateBeforeSave:false})
    })
    order.orderStatus=req.body.status;
    order.deliveredAt= Date.now();

    await order.save();

    res.status(200).json({
        success:true
    })
})

//delete the order by admin  admin/orders/:id


export const deleteOrder = catchAsyncErrors(async (req,res,next)=>{

    const order=await Order.findById(req?.params?.id);
    if(!order){
        return next(`Order not found with id:${req?.params?.id}`,400)
    }
    await order.deleteOne();

   
    res.status(200).json({
        success:true
    })
})