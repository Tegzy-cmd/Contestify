import Contest from '../models/Contest.js';

// Create new contest
export const createContest = async (req, res) => {
  try {
    const { title, description, votePrice, startsAt, endsAt } = req.body;

    const contest = await Contest.create({
      clientId: req.user?._id, // assumes req.user is set from auth middleware
      title,
      description,
      votePrice,
      startsAt,
      endsAt,
    });

    res.status(201).json({ success: true, contest });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Get all contests by client
export const getMyContests = async (req, res) => {
  try {
    const contests = await Contest.find({ clientId: req.user?._id });
    res.json({ success: true, contests });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Get single contest (owned by client)
export const getContest = async (req, res) => {
  try {
    const contest = await Contest.findOne({ _id: req.params.id, clientId: req.user?._id });
    if (!contest) return res.status(404).json({ message: 'Contest not found' });
    res.json({ success: true, contest });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Update contest
export const updateContest = async (req, res) => {
  try {
    const updated = await Contest.findOneAndUpdate(
      { _id: req.params.id, clientId: req.user?._id },
      req.body,
      { new: true, runValidators: true }
    );
    if (!updated) return res.status(404).json({ message: 'Contest not found or unauthorized' });
    res.json({ success: true, contest: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Delete contest
export const deleteContest = async (req, res) => {
  try {
    const deleted = await Contest.findOneAndDelete({ _id: req.params.id, clientId: req.user?._id });
    if (!deleted) return res.status(404).json({ message: 'Contest not found or unauthorized' });
    res.json({ success: true, message: 'Contest deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Get all active contests
export const getActiveContests = async (req, res) => {
  try {
    const contests = await Contest.find({ isActive: true })
      .sort({ createdAt: -1 }) // Sort by creation date
      .select('title description votePrice startsAt endsAt'); // Select only necessary fields

    res.json({ success: true, contests });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}


