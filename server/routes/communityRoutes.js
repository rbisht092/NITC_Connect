import express from 'express';
import {
    createCommunity,
    getCommunityById,
    getAllCommunities,
    updateCommunity,
    search

} from '../controllers/communityControllers.js';
import authMiddleware from '../middleware/authMiddleware.js';

const communityRouter = express.Router();

communityRouter.post('/', authMiddleware, createCommunity);


communityRouter.get('/', getAllCommunities);

communityRouter.get('/', search);

communityRouter.get('/:id', getCommunityById);


communityRouter.patch('/:id', authMiddleware, updateCommunity);


export default communityRouter;
