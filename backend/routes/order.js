import express from 'express'
import { allOrders, deleteOrder, getAllOrders, getOrderDetails, newOrder, updateOrders } from '../controllers/orderController.js'
import { authorizedUser, isAuthenticatedUser } from '../middlewares/auth.js';

const router= express.Router();

router.route('/orders/new').post(isAuthenticatedUser, newOrder)
router.route('/orders/:id').get(isAuthenticatedUser,getOrderDetails);
router.route('/me/orders').get(isAuthenticatedUser,getAllOrders);
router.route('/admin/orders').get(isAuthenticatedUser,authorizedUser('admin'),allOrders)
router.route('/admin/orders/:id').put(isAuthenticatedUser,authorizedUser('admin'),updateOrders);
router.route('/admin/orders/:id').delete(isAuthenticatedUser,authorizedUser('admin'),deleteOrder);
export default router