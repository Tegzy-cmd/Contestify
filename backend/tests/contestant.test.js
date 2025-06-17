import request from "supertest";
import express from "express";
import contestantRouter from "../routes/contestant.js";

// Mock middlewares and controllers
jest.mock("../middlewares/isAuthenticated.js", () => ({
  isAuthenticated: (req, res, next) => next(),
}));
jest.mock("../middlewares/upload.js", () => ({
  single: () => (req, res, next) => next(),
}));
const mockCreateProfile = jest.fn((req, res) =>
  res.status(201).json({ message: "Profile created" })
);
const mockDeleteProfile = jest.fn((req, res) =>
  res.status(200).json({ message: "Profile deleted" })
);
const mockGetProfile = jest.fn((req, res) =>
  res.status(200).json({ id: "123", name: "Test User" })
);

jest.mock("../controllers/contestantController.js", () => ({
  createProfile: (...args) => mockCreateProfile(...args),
  approveProfile: jest.fn(),
  listApprovedProfiles: jest.fn(),
  deleteProfile: (...args) => mockDeleteProfile(...args),
  getProfile: (...args) => mockGetProfile(...args),
}));

const app = express();
app.use(express.json());
app.use("/contestant", contestantRouter);

describe("Contestant Routes", () => {
  describe("POST /contestant/create-profile", () => {
    it("should call createProfile controller and return 201", async () => {
      const res = await request(app)
        .post("/contestant/create-profile")
        .field("name", "Test User")
        .attach("photo", Buffer.from("dummy"), "photo.jpg");
      expect(res.statusCode).toBe(201);
      expect(res.body).toHaveProperty("message", "Profile created");
      expect(mockCreateProfile).toHaveBeenCalled();
    });
  });

  describe("POST /contestant/:id/delete", () => {
    it("should call deleteProfile controller and return 200", async () => {
      const res = await request(app).post("/contestant/123/delete");
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty("message", "Profile deleted");
      expect(mockDeleteProfile).toHaveBeenCalled();
    });
  });

  describe("GET /contestant/get-profile", () => {
    it("should call getProfile controller and return 200", async () => {
      const res = await request(app).get("/contestant/get-profile");
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty("id", "123");
      expect(res.body).toHaveProperty("name", "Test User");
      expect(mockGetProfile).toHaveBeenCalled();
    });
  });
});
