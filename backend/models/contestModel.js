/**
 * Contest model schema
 *
 * This model represents a contest with fields for:
 * - clientId: Reference to the client who owns the contest.
 * - title: The title of the contest.           
 * - slug: A unique identifier for the contest, used in public URLs.
 * - description: A brief description of the contest.
 * - votePrice: The cost of voting in the contest, defaulting to 50 Naira.
 * - startsAt: The start date and time of the contest.
 * - endsAt: The end date and time of the contest.
 * - isActive: A boolean indicating if the contest is currently active, defaulting to true.
 * - createdAt: The date and time when the contest was created, automatically set to the current date.
 * */

// models/Contest.js
import mongoose from 'mongoose';
import slugify from 'slugify';

const contestSchema = new mongoose.Schema({
  clientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Client',
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  description: {
    type: String,
  },
  votePrice: {
    type: Number,
    required: true,
    default: 50,
  },
  startsAt: {
    type: Date,
  },
  endsAt: {
    type: Date,
    validate: {
      validator: function (value) {
        // Ensure endsAt is after startsAt
        return !this.startsAt || value > this.startsAt;
      },
      message: 'End date must be after start date',
    },
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  }
});

// 🔁 Generate slug from title before saving
contestSchema.pre('validate', function (next) {
  if (!this.slug && this.title) {
    this.slug = slugify(this.title, { lower: true, strict: true });
  }
  next();
});

const contest = mongoose.models.Contest || mongoose.model('Contest', contestSchema);
export {contest};
