import mongoose, { Schema, model } from 'mongoose';

const contestantSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  stageName: String,
  bio: String,
  photo: String,
  photoPublicId: String,
  voteCount: { type: Number, default: 0 },
  approved: { type: Boolean, default: false }
}, { timestamps: true });

const Contestant = mongoose.models.Contestant || model('Contestant', contestantSchema);
export  {Contestant};
// This model represents contestants in the contest.