import { Contestant } from '../models/contestantModel.js';


export const createProfile = async (req, res) => {
  try {
    const { stageName, bio, photo } = req.body;
    const userId = req.user._id; // Assuming user ID is stored in req.user after authentication

    const existing =await Contestant.findOne({ userID});

    if (existing) {
        return res.status(400).json({ error: 'Profile already exist' });
    }

    const profile = await Contestant.create({
      userId,
      stageName,
      bio,
      photo
    });

    res.status(201).json(profile);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const listApprovedProfiles = async (req, res) => {
    try {
       const contestants = await Contestant.find({ approved: true })
            .populate('userId', 'name email') // Populate user details
            .sort({ createdAt: -1 }); // Sort by creation date

        res.json(contestants);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}


export const approveProfile = async (req, res) => {

        try {
            const { id } = req.params;
            const profile = await Contestant.findByIdAndUpdate(id, { approved: true }, { new: true });

            if (!profile) {
                return res.status(404).json({success:false, error: 'Profile not found' });
            }

            res.json({success: true, message:profile.stageName + ' approved successfully', profile });
        }
        catch (error) {
            res.status(500).json({success:false, error: error.message });
        }
}


export const deleteProfile = async (req, res) => {

        try {
            const { id } = req.params;
            // const profile = await Contestant.findByIdAndUpdate(id, { approved: true }, { new: true });
            const profile = await Contestant.findByIdAndDelete(id);

            if (!profile) {
                return res.status(404).json({success:false, error: 'Profile not found' });
            }

            res.status(200).json({ success:true, message: 'Profile deleted successfully' });
        }
        catch (error) {
            res.status(500).json({success:false, error: error.message });
        }
}