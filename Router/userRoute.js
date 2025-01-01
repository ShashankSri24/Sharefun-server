import { getAllUser, UpdateUser } from '../Controller/SignUP.js';
import { authentication } from '../middleware/Authentication.js';
import { AcceptRequest, FriendRequest, GetFriendRequest, ProfileViews, SuggestedFriends } from '../Controller/FriendController.js';
import express from 'express';
const router = express.Router()
//  To get or Update User router//
router.get("/getUser",authentication,getAllUser);
router.put('/update/:id',authentication,UpdateUser)

// Friend request router//
router.post("/friend-request",authentication,FriendRequest);
router.post('/get-friendrequest',authentication,GetFriendRequest);

// Accept / deny Frind request//
router.post("/accept-request",authentication,AcceptRequest);

// Profileviews Router
router.post('/Profile-view',authentication,ProfileViews);
router.post('/suggestion',authentication,SuggestedFriends)

export default router;