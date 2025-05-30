import {Payment} from '../models/paymentModel.js';
import {Contestant} from '../models/contestantModel.js';

export const paystackWebhook = async (req, res) => {
  const event = req.body;

  if (event.event === 'charge.success') {
    const reference = event.data.reference;

    const payment = await Payment.findOne({ reference });
    if (payment && payment.status !== 'success') {
      payment.status = 'success';
      payment.paidAt = new Date();
      await payment.save();

      await Contestant.findByIdAndUpdate(payment.contestantId, {
        $inc: { voteCount: payment.voteCount }
      });
    }
  }

  res.sendStatus(200);
};

