import Community from '../models/communitySchema.js';
import Follows from '../models/followsSchema.js';
/**
 * Create a new community
 * @route POST /communities
 */
export const search= async(req, res) => {
    try {
        const { query } = req.query; // Extract the search query from the URL

        if (!query) {
            return res.status(400).json({ message: 'Search query is required' });
        }

        // Find communities using text search
        const results = await Community.find({
            $or: [
                { name: { $regex: query, $options: 'i' } }, // Case-insensitive regex
                { description: { $regex: query, $options: 'i' } },
            ],
        });

        res.status(200).json({ data: results });
    } catch (error) {
        console.error('Error searching communities:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
export const createCommunity = async (req, res) => {
    const { name, description } = req.body;

    try {
        // The user must be authenticated, so `req.user` is available
        const creatorId = req.user.id;

        // Check if a community with the same name already exists
        const existingCommunity = await Community.findOne({ name });
        if (existingCommunity) {
            return res.status(400).json({ error: 'Community name already exists' });
        }

        // Create and save the new community
        const community = new Community({ name, description, creator: creatorId });
        await community.save();

        await Follows.create({
            userId: req.user.id,
            communityId: community._id,
        });

        res.status(201).json({ message: 'Community created successfully', community });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
};

/**
 * Get all communities
 * @route GET /communities
 */
export const getAllCommunities = async (req, res) => {
    try {
        const communities = await Community.find().populate('creator', 'username displayname'); // Populate creator info
        res.status(200).json(communities);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
};

/**
 * Get a single community by ID
 * @route GET /communities/:id
 */
export const getCommunityById = async (req, res) => {
    const { id } = req.params;

    try {
        const community = await Community.findById(id).populate('creator', 'username displayname');

        if (!community) {
            return res.status(404).json({ error: 'Community not found' });
        }

        res.status(200).json(community);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
};

/**
 * Update a community (only the creator can update it)
 * @route PUT /communities/:id
 */
export const updateCommunity = async (req, res) => {
    const { id } = req.params;
    const { name, description } = req.body;

    try {
        const community = await Community.findById(id);

        if (!community) {
            return res.status(404).json({ error: 'Community not found' });
        }

        // Check if the logged-in user is the creator of the community
        if (community.creator.toString() !== req.user.id) {
            return res.status(403).json({ error: 'Unauthorized to update this community' });
        }

        community.name = name || community.name;
        community.description = description || community.description;

        await community.save();

        res.status(200).json({ message: 'Community updated successfully', community });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
};

