import { Router, raw } from 'express';
const router = Router();
import { paystackWebhook } from '../controllers/webhookController.js';
// This file defines the webhook routes for handling Paystack payment notifications.

// Don't use bodyParser.json() on this route (use raw)
router.post('/paystack', raw({ type: 'application/json' }), paystackWebhook);

export default router;
