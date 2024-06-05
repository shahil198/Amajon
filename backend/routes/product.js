import express from "express";
import {
   addProducts,
   createProductReview,
   deleteProduct,
   deleteReview,
   getAllReview,
   getProductById,
   getProducts,
   updateProduct,
} from "../controllers/productController.js";
import { isAuthenticatedUser, authorizedUser } from "../middlewares/auth.js";

const router = express.Router();

router.route("/products").get(getProducts);
router
   .route("/admin/products")
   .post(isAuthenticatedUser, authorizedUser("admin"), addProducts);
router.route("/products/:id").get(getProductById);
router
   .route("/admin/products/:id")
   .put(isAuthenticatedUser, authorizedUser("admin"), updateProduct);
router
   .route("/admin/products/:id")
   .delete(isAuthenticatedUser, authorizedUser("admin"), deleteProduct);

router.route("/reviews").put(isAuthenticatedUser, createProductReview);
router.route("/reviews").get(isAuthenticatedUser, getAllReview);

router
   .route("/admin/reviews")
   .delete(isAuthenticatedUser, authorizedUser("admin"), deleteReview);

export default router;
