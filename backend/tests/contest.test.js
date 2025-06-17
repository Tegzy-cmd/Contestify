import request from 'supertest';
import express from 'express';
import contestRouter from '../routes/contest.js';

// Mock middlewares and controllers
jest.mock('../middlewares/authMiddleware.js', () => ({
    isAuthenticated: (req, res, next) => next(),
    isClient: (req, res, next) => next(),
}));

jest.mock('../controllers/contestController.js', () => ({
    createContest: (req, res) => res.status(201).json({ message: 'Contest created' }),
    getMyContests: (req, res) => res.status(200).json([{ id: 1, name: 'Test Contest' }]),
    getContest: (req, res) => res.status(200).json({ id: req.params.id, name: 'Test Contest' }),
    updateContest: (req, res) => res.status(200).json({ message: 'Contest updated' }),
    deleteContest: (req, res) => res.status(200).json({ message: 'Contest deleted' }),
}));

const app = express();
app.use(express.json());
app.use('/contests', contestRouter);

describe('Contest Routes', () => {
    it('should create a contest', async () => {
        const res = await request(app)
            .post('/contests')
            .send({ name: 'New Contest' });
        expect(res.statusCode).toBe(201);
        expect(res.body).toHaveProperty('message', 'Contest created');
    });

    it('should get all my contests', async () => {
        const res = await request(app).get('/contests');
        expect(res.statusCode).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
        expect(res.body[0]).toHaveProperty('name', 'Test Contest');
    });

    it('should get a contest by id', async () => {
        const res = await request(app).get('/contests/123');
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('id', '123');
    });

    it('should update a contest', async () => {
        const res = await request(app)
            .put('/contests/123')
            .send({ name: 'Updated Contest' });
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('message', 'Contest updated');
    });

    it('should delete a contest', async () => {
        const res = await request(app).delete('/contests/123');
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('message', 'Contest deleted');
    });
});