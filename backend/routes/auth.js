import express from 'express'
import {deleteUser, forgotPassword, getProfile, getUserDetails, getUsers, loginUser, logout, registerUser, resetPassword, updatePassword, updateProfile, updateUser } from '../controllers/authController.js';
import { authorizedUser, isAuthenticatedUser } from '../middlewares/auth.js';
const router = express.Router();


router.route('/register').post(registerUser);
router.route('/login').post(loginUser);
router.route('/logout').get(logout)
router.route('/password/forgot').post(forgotPassword);
router.route('/password/reset/:token').put(resetPassword);
router.route('/me').get(isAuthenticatedUser, getProfile);
router.route('/password/update').put(isAuthenticatedUser,updatePassword);
router.route('/me/update').put(isAuthenticatedUser,updateProfile)

router.route('/admin/users').get(isAuthenticatedUser,authorizedUser('admin'), getUsers)
router.route('/admin/users/:id').get(isAuthenticatedUser,authorizedUser('admin'), getUserDetails)
router.route('/admin/users/:id').put(isAuthenticatedUser, authorizedUser('admin'), updateUser);
router.route('/admin/users/:id').delete(isAuthenticatedUser,authorizedUser('admin'),deleteUser);


export default router;