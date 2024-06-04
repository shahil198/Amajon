
import catchAsyncErrors from '../middlewares/catchAsyncErrors.js';
import Product from '../models/product.js'
import ApiFilters from '../utils/apiFilters.js';
import ErrorHandler from '../utils/errorHandler.js';

// to get all the product /api/v1/product
export  const  getProducts =catchAsyncErrors(async (req,res) =>{

    const resPerPage =3;
      const apiFilters = new ApiFilters(Product,req.query).search().filter()
   
    //   console.log('req?.user',req?.user)
    // const apiFilters = new ApiFilters(Product,req.query).filter()

      let products = await apiFilters.query
      const FilteredElement = products.length

      apiFilters.pagination(resPerPage);

      products = await apiFilters.query.clone();


    res.status(200).json({
        
        FilteredElement,
        resPerPage,
        message:"getting all the products",
        data:products
    })
})

//to add product by admin  /api/v1/admin/products
export const addProducts =catchAsyncErrors(async (req,res) =>{
    req.body.user= req.user._id
    const product = await Product.create(req.body);

    res.status(200).json({
        product
    })
})

//get product by id   /ap/v1/product/id

export const getProductById = catchAsyncErrors(async (req,res,next)=>{
  
    const product = await Product.findById(req?.params?.id);
    if(!product){
        return next(new ErrorHandler("Product not found!",404))
    }
    else {
        res.status(200).json({
            product
        })
    }
})

//update product by ID api/v1/products/:id but method will be put

export  const updateProduct  = catchAsyncErrors(async (req,res,next)=>{
  
    let product = await Product.findById(req?.params?.id);

    if(!product){
        return next(new ErrorHandler("Product not found!",404))
    }

    product = await Product.findByIdAndUpdate(req?.params?.id,req.body,{new:true});

    res.status(200).json({
        message:'product updated successfully',
        data:product
    })

})


//delete product by id  api/v1/products/:id but method is delete

export const deleteProduct = catchAsyncErrors(async (req,res,next) =>{
  
    const product = await Product.findById(req?.params?.id);
    if(!product){
        return next(new ErrorHandler("Product not found!",404))
    }

    await Product.findByIdAndDelete(req?.params?.id);
    res.status(200).json({
        message:'product deleted successfully'
    })
})

