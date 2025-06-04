import express from 'express';
import { signin,signup,logout } from '../controllers/auth.controller.js';
import { onboard } from '../controllers/auth.controller.js';
import { protectedRoute } from '../middleware/protectedRoute.js';
const router=express.Router();
router.post('/signup',signup)
router.post('/signin',signin)
router.post('/logout',logout)

router.post('/onboarding',protectedRoute,onboard)
export default router;