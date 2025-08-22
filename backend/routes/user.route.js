import express from 'express'
import { verifyJWT } from '../lib/verifyJWT';
import { acceptFriendRequest, getFriendRequests, getMyFriends, getOutgoingFriendReqs, getRecommendedUsers } from '../controller/user.controller';

const router = express.Router();

router.use(verifyJWT);

router.get("/",getRecommendedUsers);
router.get("/friends",getMyFriends);
router.post("/friend-request/:id",sendFriendRequest);
router.put("/friend-request/:id/accept",acceptFriendRequest);
router.get("/friend-requests",getFriendRequests);
router.get("/friend-requests/sent",getOutgoingFriendReqs);
export default router;