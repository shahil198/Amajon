import express from 'express'
import { addProducts, deleteProduct, getProductById, getProducts, updateProduct } from '../controllers/productController.js';
import { isAuthenticatedUser } from '../middlewares/auth.js';
const router = express.Router();

router.route('/products').get(isAuthenticatedUser, getProducts);
router.route('/admin/products').post(addProducts);
router.route('/products/:id').get(getProductById);
router.route('/products/:id').put(updateProduct);
router.route('/products/:id').delete(deleteProduct);



export default router;