import mongoose from "mongoose";
import User from "../models/User.js"; // Make sure User.js exports with ES module syntax

const users = [
  {
    name: "Alice Johnson",
    email: "alice@example.com",
    password: "password123",
    role: "user",
  },
  {
    name: "Bob Smith",
    email: "bob@example.com",
    password: "password123",
    role: "admin",
  },
  {
    name: "Charlie Brown",
    email: "charlie@example.com",
    password: "password123",
    role: "user",
  },
  {
    name: "Diana Prince",
    email: "diana@example.com",
    password: "password123",
    role: "user",
  },
  {
    name: "Ethan Hunt",
    email: "ethan@example.com",
    password: "password123",
    role: "user",
  },
  {
    name: "Fiona Gallagher",
    email: "fiona@example.com",
    password: "password123",
    role: "user",
  },
  {
    name: "George Miller",
    email: "george@example.com",
    password: "password123",
    role: "user",
  },
  {
    name: "Hannah Lee",
    email: "hannah@example.com",
    password: "password123",
    role: "user",
  },
  {
    name: "Ian Curtis",
    email: "ian@example.com",
    password: "password123",
    role: "user",
  },
  {
    name: "Julia Roberts",
    email: "julia@example.com",
    password: "password123",
    role: "user",
  },
];

async function seedUsers() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    await User.deleteMany({});
    await User.insertMany(users);
    console.log("User data seeded!");
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

seedUsers();
