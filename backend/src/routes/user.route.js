import express from 'express';
import { protectedRoute } from '../middleware/protectedRoute.js';
import { getRecommendedUsers, getMyFriends } from '../controllers/user.controller.js';
const router = express.Router();
//user routes in this recommended user will be shown 
//and the friends which i have will be shown
//for this we need to have 2 routes 
router.use(protectedRoute)
router.get('/getfriends',getRecommendedUsers);
router.get('/friends',getMyFriends);
export default router;