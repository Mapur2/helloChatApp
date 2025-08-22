import express from 'express'
import { verifyJWT } from '../lib/verifyJWT';
import { getMyFriends, getRecommendedUsers } from '../controller/user.controller';

const router = express.Router();

router.use(verifyJWT);

router.get("/",getRecommendedUsers);
router.get("/friends",getMyFriends);
router.post("/friend-request/:id",sendFriendRequest);

export default router;