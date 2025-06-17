import express from 'express';
import {
  createContest,
  getMyContests,
  getContest,
  updateContest,
  deleteContest
} from '../controllers/contestController.js';
import { isAuthenticated, isClient } from '../middlewares/authMiddleware.js';

const contestRouter = express.Router();

router.use(isAuthenticated, isClient); // Protect all contest routes

router.post('/', createContest);
router.get('/', getMyContests);
router.get('/:id', getContest);
router.put('/:id', updateContest);
router.delete('/:id', deleteContest);

export default contestRouter;