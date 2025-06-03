import {Config} from '../models/configModel.js';

// Get current config
export const getConfig = async (req, res) => {
    try {
        const config = await Config.findOne();
        res.json(config);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Update config (admin only)
export const updateConfig = async (req, res) => {
    try {
        const { votePrice, isVotingOpen, contestTitle } = req.body;

        const config = await Config.findOneAndUpdate(
            {},
            {
                ...(votePrice && { votePrice }),
                ...(isVotingOpen !== undefined && { isVotingOpen }),
                ...(contestTitle && { contestTitle }),
                updatedBy: req.user._id
            },
            { new: true, upsert: true }
        );

        res.json(config);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};