import request from "supertest";
import express from "express";
import adminRouter from "../routes/admin.js";

// Mock middlewares and controllers
jest.mock("../middlewares/isAdminAuth.js", () => ({
  isAdminAuth: (req, res, next) => next(),
}));
jest.mock("../middlewares/isAuthenticated.js", () => ({
  isAuthenticated: (req, res, next) => next(),
}));
jest.mock("../controllers/authController.js", () => ({
  login: (req, res) => res.status(200).json({ message: "Logged in" }),
  logout: (req, res) => res.status(200).json({ message: "Logged out" }),
  isAuthenticated: (req, res, next) => next(),
}));
jest.mock("../controllers/contestantController.js", () => ({
  approveProfile: (req, res) =>
    res.status(200).json({ message: "Profile approved", id: req.params.id }),
  listApprovedProfiles: (req, res) =>
    res.status(200).json({ profiles: ["profile1", "profile2"] }),
  deleteProfile: (req, res) =>
    res.status(200).json({ message: "Profile deleted", id: req.params.id }),
}));
jest.mock("../controllers/configController.js", () => ({
  getConfig: (req, res) =>
    res.status(200).json({ config: { siteName: "Contestify" } }),
  updateConfig: (req, res) =>
    res.status(200).json({ message: "Config updated" }),
}));

const app = express();
app.use(express.json());
app.use("/admin", adminRouter);

describe("Admin Routes", () => {
  it("should login admin", async () => {
    const res = await request(app).post("/admin/login").send({
      username: "admin",
      password: "password",
    });
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("Logged in");
  });

  it("should logout admin", async () => {
    const res = await request(app).post("/admin/logout");
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("Logged out");
  });

  it("should list approved profiles", async () => {
    const res = await request(app).get("/admin/approved-profiles");
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body.profiles)).toBe(true);
  });

  it("should approve a profile", async () => {
    const res = await request(app).put("/admin/123/approve");
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("Profile approved");
    expect(res.body.id).toBe("123");
  });

  it("should delete a profile", async () => {
    const res = await request(app).delete("/admin/456");
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("Profile deleted");
    expect(res.body.id).toBe("456");
  });

  it("should get website config", async () => {
    const res = await request(app).get("/admin/config");
    expect(res.statusCode).toBe(200);
    expect(res.body.config).toHaveProperty("siteName", "Contestify");
  });

  it("should update website config", async () => {
    const res = await request(app)
      .put("/admin/config")
      .send({ siteName: "NewName" });
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("Config updated");
  });
});

// We recommend installing an extension to run jest tests.
