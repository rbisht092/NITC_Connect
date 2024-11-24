import express from 'express';
import {
    createPost,
    editPost,
    addComment,
    reactToPost,
    getPostsByCommunity,
    getPostsByUser,
    deletePost,
} from '../controllers/postControllers.js';
import authMiddleware  from '../middleware/authMiddleware.js'; // Ensure this middleware checks for authenticated users

const postRouter = express.Router();

// Route to create a new post
postRouter.post('/', authMiddleware, createPost);

// Route to edit an existing post
postRouter.patch('/:id', authMiddleware, editPost);

// Route to add a comment to a post
postRouter.post('/:id/comments', authMiddleware, addComment);

// Route to react to a post (like/dislike)
postRouter.post('/:id/reactions', authMiddleware, reactToPost);

// Route to get all posts in a specific community
postRouter.get('/communities/:communityId', getPostsByCommunity);

// Route to get all posts by a specific user
postRouter.get('/users/:userId', getPostsByUser);

// Route to delete a post
postRouter.delete('/:id', authMiddleware, deletePost);

export default postRouter;
