import express from 'express';
import { signin,signup,logout } from '../controllers/auth.controller.js';
import { onboard } from '../controllers/auth.controller.js';
import { protectedRoute } from '../middleware/protectedRoute.js';
const router=express.Router();
router.post('/signup',signup)
router.post('/signin',signin)
router.post('/logout',logout)

router.post('/onboarding',protectedRoute,onboard)
router.get('/me',protectedRoute,(req,res)=>{
    res.status(200).json({
        success: true,
        user: req.user, // The user is attached to the request object by the protectedRoute middleware
    });
})
export default router;