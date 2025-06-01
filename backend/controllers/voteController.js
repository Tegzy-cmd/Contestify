import {Payment}  from '../models/paymentModel.js';
import { v4 as uuidv4 } from 'uuid';
import {Config} from '../models/configModel.js';



export const initiateVote = async (req,res) =>{
    try {
        const costPerVote = await Config.findOne({ key: 'votePrice' }) || { value: 50 }; // Default to 50 if not found
        const {email, phone, voteCount,contestantId,approved} = req.body
        const amount = voteCount * costPerVote; 

        if (!email || !phone || !voteCount || !contestantId) {
            return res.status(400).json({error: 'Email, phone, vote count and contestant ID are required'});
        }
        if (!approved) {
            return res.status(403).json({error: 'Voting is not allowed at this time'});
        }
        // Validate vote count
        if (voteCount <= 0 || !Number.isInteger(voteCount)) {
            return res.status(400).json({error: 'Vote count must be a positive integer'});
        }

        const reference = uuidv4();

        const payment = await new Payment.create({
            contestantId,
            email,
            phone,
            voteCount,
            amountPaid: amount,
            reference,
            status: 'pending'
        });

        //Send ref + amount to frontend for Paysatck
        res.status(201).json({reference, amount})

    } catch (error) {

        res.status(500).json({error: error.message})
        
    }
}

export const getVoteSummary = async (req, res) => {
  try {
    const { contestantId } = req.params;
    const totalVotes = await Payment.aggregate([
      { $match: { contestantId: require('mongoose').Types.ObjectId(contestantId), status: 'success' } },
      { $group: { _id: null, total: { $sum: '$voteCount' } } }
    ]);

    res.json({ votes: totalVotes[0]?.total || 0 });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};