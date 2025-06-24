import express from 'express';
import {protectedRoute} from '../middleware/protectedRoute.js';
import { getRecommendedUsers } from '../controllers/user.controller.js';
import { getMyFriends } from '../controllers/user.controller.js';
import { acceptFriendRequest,sendFriendRequest,getFriendRequests,getOutgoingFriendReqs } from '../controllers/user.controller.js';
const router = express.Router();
//user routes in this recommended user will be shown 
//and the friends which i have will be shown
//for this we need to have 2 routes 
router.use(protectedRoute)
router.get('/getfriends',getMyFriends);
router.get('/getUsers',getRecommendedUsers);
router.post('/friend-request/:id',sendFriendRequest)
router.put('/friend-request/:id/accept',acceptFriendRequest);
router.get('/friend-request',getFriendRequests);
router.get('/outgoing-requests',getOutgoingFriendReqs);
export default router;