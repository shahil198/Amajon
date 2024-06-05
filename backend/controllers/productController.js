import catchAsyncErrors from "../middlewares/catchAsyncErrors.js";
import Product from "../models/product.js";
import ApiFilters from "../utils/apiFilters.js";
import ErrorHandler from "../utils/errorHandler.js";

// to get all the product /api/v1/product
export const getProducts = catchAsyncErrors(async (req, res) => {
   const resPerPage = 3;
   const apiFilters = new ApiFilters(Product, req.query).search().filter();

   //   console.log('req?.user',req?.user)
   // const apiFilters = new ApiFilters(Product,req.query).filter()

   let products = await apiFilters.query;
   const FilteredElement = products.length;

   apiFilters.pagination(resPerPage);

   products = await apiFilters.query.clone();

   res.status(200).json({
      FilteredElement,
      resPerPage,
      message: "getting all the products",
      data: products,
   });
});

//to add product by admin  /api/v1/admin/products
export const addProducts = catchAsyncErrors(async (req, res) => {
   req.body.user = req.user._id;
   const product = await Product.create(req.body);

   res.status(200).json({
      product,
   });
});

//get product by id   /ap/v1/product/id

export const getProductById = catchAsyncErrors(async (req, res, next) => {
   const product = await Product.findById(req?.params?.id);
   if (!product) {
      return next(new ErrorHandler("Product not found!", 404));
   } else {
      res.status(200).json({
         product,
      });
   }
});

//update product by ID api/v1/products/:id but method will be put

export const updateProduct = catchAsyncErrors(async (req, res, next) => {
   let product = await Product.findById(req?.params?.id);

   if (!product) {
      return next(new ErrorHandler("Product not found!", 404));
   }

   product = await Product.findByIdAndUpdate(req?.params?.id, req.body, {
      new: true,
   });

   res.status(200).json({
      message: "product updated successfully",
      data: product,
   });
});

//delete product by id  api/v1/products/:id but method is delete

export const deleteProduct = catchAsyncErrors(async (req, res, next) => {
   const product = await Product.findById(req?.params?.id);
   if (!product) {
      return next(new ErrorHandler("Product not found!", 404));
   }

   await Product.findByIdAndDelete(req?.params?.id);
   res.status(200).json({
      message: "product deleted successfully",
   });
});

// create/update product review   /api/v1/reviews

export const createProductReview = catchAsyncErrors(async (req, res, next) => {
   const { rating, comment, productId } = req.body;

   const review = {
      user: req?.user?._id,
      rating: Number(rating),
      comment,
   };

   const product = await Product.findById(productId);

   if (!product) {
      return next(new ErrorHandler("Product not found", 400));
   }

   const isReviewed = await product?.reviews?.find(
      (x) => x.user.toString() === req?.user?._id.toString(),
   );

   if (isReviewed) {
      product.reviews.forEach((x) => {
         if (x.user.toString() === req.user._id.toString()) {
            (x.comment = comment),
               (x.rating = rating),
               (product.rating = rating);
         }
      });
   } else {
      product.reviews.push(review);
      product.numOfReviews = product.reviews.length;
   }

   product.ratings =
      product.reviews.reduce((acc, curr) => acc + curr.rating, 0) /
      product.reviews.length;

   await product.save({ validateBeforeSave: false });
   res.status(200).json({
      success: true,
   });
});

//get all review of any product  /api/v1/reviews
export const getAllReview = catchAsyncErrors(async (req, res, next) => {
   const product = await Product.findById(req?.query?.id);

   if (!product) {
      return next(new ErrorHandler("Product not found", 400));
   }

   res.status(200).json({
      reviews: product.reviews,
   });
});

//delete product review by admin  admin/reviews

export const deleteReview = catchAsyncErrors(async (req, res, next) => {
   const product = await Product.findById(req?.query?.productId);

   if (!product) {
      return next(new ErrorHandler("Product not found", 400));
   }

   const reviews = product?.reviews?.filter(
      (review) => review._id.toString() !== req?.query?.id.toString(),
   );

   const numOfReviews = reviews.length;

   const ratings =
      numOfReviews === 0
         ? 0
         : product.reviews.reduce((acc, curr) => curr.rating + acc, 0) /
           numOfReviews;

   const product1 = await Product.findByIdAndUpdate(
      req.query.productId,
      { reviews, numOfReviews, ratings },
      { new: true },
   );

   res.status(200).json({
      success: true,
      product1,
   });
});
