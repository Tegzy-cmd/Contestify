import mongoose, { Schema, model } from 'mongoose';

const voteSchema = new Schema({
  voterEmail: String,
  contestantId: Schema.Types.ObjectId,
  numVotes: Number,
  amountPaid: Number,
  status: { type: String, default: 'pending' },
  reference: String
}, { timestamps: true });

const voteModel = mongoose.models.vote || mongoose.model('Vote', voteSchema);

export default {voteModel};
