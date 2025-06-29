const request = require("supertest");
const app = require("../server.js"); // Adjust path if needed
const { disconnect } = require("mongoose");

describe("Auth API", () => {
  let token;

  afterAll(async () => {
    await disconnect();
  });

  it("should register a new contestant", async () => {
    const res = await request(app).post("/api/auth/register").send({
      name: "Test User",
      email: "testuser@example.com",
      password: "password123",
      role: "contestant",
    });

    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty("token");
    token = res.body.token;
  });

  it("should log in the user", async () => {
    const res = await request(app).post("/api/auth/login").send({
      email: "testuser@example.com",
      password: "password123",
    });

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("token");
    token = res.body.token;
  });

  it("should not log in with wrong password", async () => {
    const res = await request(app).post("/api/auth/login").send({
      email: "testuser@example.com",
      password: "wrongpassword",
    });

    expect(res.statusCode).toBe(401);
  });

  it("should check if user is authenticated", async () => {
    const res = await request(app)
      .post("/api/auth/is-authenticated")
      .set("Authorization", `Bearer ${token}`);

    expect([200, 201]).toContain(res.statusCode);
    expect(res.body).toHaveProperty("authenticated");
  });

  it("should send verify OTP", async () => {
    const res = await request(app)
      .post("/api/auth/sendVerifyOtp")
      .set("Authorization", `Bearer ${token}`);

    expect([200, 201]).toContain(res.statusCode);
    expect(res.body).toHaveProperty("message");
  });

  it("should send reset OTP", async () => {
    const res = await request(app)
      .post("/api/auth/send-reset-otp")
      .send({ email: "testuser@example.com" });

    expect([200, 201]).toContain(res.statusCode);
    expect(res.body).toHaveProperty("message");
  });

  it("should logout the user", async () => {
    const res = await request(app)
      .post("/api/auth/logout")
      .set("Authorization", `Bearer ${token}`);

    expect([200, 201, 204]).toContain(res.statusCode);
  });

  // You can add more tests for /reset-password and /verify-account if you mock OTPs
});
