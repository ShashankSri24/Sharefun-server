import express from 'express';
import { authentication } from '../middleware/Authentication.js';
import { commentsOnPost, CreatePost, deletePost, getComments, GetPost, likeComment, likeOnReply, likePost, replyToComment, userPost } from '../Controller/PostController.js';

const router = express.Router();

router.post('/posts_create',authentication,CreatePost);
router.get('/posts_get',authentication, GetPost)
router.get('/posts_user/:_id',authentication, userPost)
router.post('/like/:_id',authentication,likePost)
router.delete('/delete_post/:id',authentication, deletePost)

router.post('/comment_post/:_id',authentication, commentsOnPost)
router.get('/comments/:_id',authentication,getComments);
router.post('/like_comment/:_id',authentication, likeComment)
router.post('/reply/:_id',authentication,replyToComment)
router.post('/like/:_id/:_id',authentication,likeOnReply)
export default router;