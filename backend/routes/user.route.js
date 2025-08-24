import express from 'express'
import { verifyJWT } from '../lib/verifyJWT.js';
import { acceptFriendRequest, getFriendRequests, getMyFriends, getOutgoingFriendReqs, getRecommendedUsers, sendFriendRequest } from '../controller/user.controller.js';

const router = express.Router();

router.use(verifyJWT);

router.get("/",getRecommendedUsers);
router.get("/friends",getMyFriends);
router.post("/friend-request/:id",sendFriendRequest);
router.put("/friend-request/:id/accept",acceptFriendRequest);
router.get("/friend-requests",getFriendRequests);
router.get("/friend-requests/sent",getOutgoingFriendReqs);
export default router;