import Post from '../models/postSchema.js';
import Community from '../models/communitySchema.js';
import User from '../models/userschema.js';

/**
 * @desc Create a new post
 * @route POST /posts
 * @access Authenticated users only
 */
/**
 * @desc Create a new post
 * @route POST /posts
 * @access Authenticated users only
 */
export const createPost = async (req, res) => {
    const { title, content, community, media } = req.body; // 'community' will now be the name of the community
    const author = req.user.id; // AuthMiddleware ensures this exists

    try {
        // Find the community by its name
        const communityData = await Community.findOne({ name: community });
        if (!communityData) {
            return res.status(404).json({ error: 'Community not found' });
        }

        // Create and save the post
        const post = await Post.create({
            title,
            content,
            author,
            community: communityData._id, // Save the ID of the community
            media,
        });

        res.status(201).json({ message: 'Post created successfully!', post });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
};


/**
 * @desc Edit an existing post
 * @route PATCH /posts/:id
 * @access Authenticated users only (Author of the post)
 */
export const editPost = async (req, res) => {
    const { id } = req.params;
    const { title, content, media } = req.body;
    const userId = req.user.id;

    try {
        const post = await Post.findById(id);

        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        }

        if (post.author.toString() !== userId) {
            return res.status(403).json({ error: 'You are not authorized to edit this post' });
        }

        // Update the fields
        if (title) post.title = title;
        if (content) post.content = content;
        if (media) post.media = media;

        await post.save();

        res.status(200).json({ message: 'Post updated successfully', post });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
};

/**
 * @desc Create a comment on a post
 * @route POST /posts/:id/comments
 * @access Authenticated users only
 */
export const addComment = async (req, res) => {
    const { id } = req.params;
    const { text } = req.body;
    const userId = req.user.id;

    try {
        const post = await Post.findById(id);

        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        }

        // Add the comment
        const comment = {
            user: userId,
            text,
        };

        post.comments.push(comment);
        await post.save();

        res.status(201).json({ message: 'Comment added successfully', post });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
};

/**
 * @desc React to a post (like or dislike)
 * @route POST /posts/:id/reactions
 * @access Authenticated users only
 */
export const reactToPost = async (req, res) => {
    const { id } = req.params;
    const { reaction } = req.body; // Expected values: 'like' or 'dislike'

    try {
        const post = await Post.findById(id);

        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        }

        if (reaction === 'like') {
            post.reactions.likes += 1;
        } else if (reaction === 'dislike') {
            post.reactions.dislikes += 1;
        } else {
            return res.status(400).json({ error: 'Invalid reaction type' });
        }

        await post.save();

        res.status(200).json({ message: 'Reaction added successfully', post });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
};

/**
 * @desc Get all posts in a community
 * @route GET /communities/:communityId/posts
 * @access Public
 */
export const getPostsByCommunity = async (req, res) => {
    const { communityId } = req.params;

    try {
        const posts = await Post.find({ community: communityId }).populate('author', 'username displayname');

        if (!posts.length) {
            return res.status(404).json({ message: 'No posts found in this community' });
        }

        res.status(200).json({ posts });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
};

/**
 * @desc Get all posts by a user
 * @route GET /users/:userId/posts
 * @access Public
 */
export const getPostsByUser = async (req, res) => {
    const { userId } = req.params;

    try {
        const posts = await Post.find({ author: userId }).populate('community', 'name description');

        if (!posts.length) {
            return res.status(404).json({ message: 'No posts found by this user' });
        }

        res.status(200).json({ posts });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
};
export const deletePost = async (req, res) => {
    const { id } = req.params;
    const userId = req.user.id;

    try {
        const post = await Post.findById(id);

        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        }

        if (post.author.toString() !== userId) {
            return res.status(403).json({ error: 'You are not authorized to delete this post' });
        }

        await post.remove();

        res.status(200).json({ message: 'Post deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
};
