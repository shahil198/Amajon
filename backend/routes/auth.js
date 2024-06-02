import express from 'express'
import {forgotPassword, getProfile, loginUser, logout, registerUser, resetPassword, updatePassword, updateProfile } from '../controllers/authController.js';
import { isAuthenticatedUser } from '../middlewares/auth.js';
const router = express.Router();


router.route('/register').post(registerUser);
router.route('/login').post(loginUser);
router.route('/logout').get(logout)
router.route('/password/forgot').post(forgotPassword);
router.route('/password/reset/:token').put(resetPassword);
router.route('/me').get(isAuthenticatedUser, getProfile);
router.route('/password/update').put(isAuthenticatedUser,updatePassword);
router.route('/me/update').put(isAuthenticatedUser,updateProfile)

export default router;