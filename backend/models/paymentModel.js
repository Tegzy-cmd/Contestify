import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema({
  contestantId: { type: mongoose.Schema.Types.ObjectId, ref: 'Contestant', required: true },
  contestId:{type: mongoose.Schema.Types.ObjectId, ref: 'Contest',required:true} ,
  email: String,
  phone: String,  
  voteCount: Number,
  amountPaid: Number,
  reference: { type: String, unique: true },
  status: { type: String, enum: ['pending', 'success', 'failed'], default: 'pending' },
  paidAt: Date
}, { timestamps: true });

const Payment = mongoose.models.Payment || mongoose.model('Payment', paymentSchema);

export  {Payment};