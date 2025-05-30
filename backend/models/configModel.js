import { config } from 'dotenv';
import mongoose from 'mongoose';
/**
 * Config model for managing voting settings and contest details.
 * 
 * This model includes fields for:
 * - votePrice: The cost of a single vote.
 * - isVotingOpen: A boolean to indicate if voting is currently open.
 * - contestTitle: The title of the contest.
 * - updatedBy: Reference to the user who last updated the configuration.
 */
// - timestamps: Automatically managed createdAt and updatedAt fields.

const configSchema = new mongoose.Schema({
  votePrice: {
    type: Number,
    default: 50, // ₦50 per vote
    required: true
  },
  isVotingOpen: {
    type: Boolean,
    default: true
  },
  contestTitle: {
    type: String,
    default: 'Main Contest'
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, { timestamps: true });
const Config = mongoose.models.config || mongoose.model('Config', configSchema);

export {Config};
