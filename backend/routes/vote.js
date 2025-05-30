import { Router } from "express";
const router = Router();

import {initiateVote, getVoteSummary} from '../controllers/voteController.js';


//Anyone can vote (no auth)
router.post('/initiate',initiateVote);
router.post('/summary/:contestantId',getVoteSummary)


export default router;
