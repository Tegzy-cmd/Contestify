import mongoose from "mongoose";
import {User} from '../models/userModel.js' // Make sure User.js exports with ES module syntax
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
dotenv.config();

const users = [
  {
    name: "Alice Johnson",
    email: "alice@example.com",
    password: "password123",
    role: "admin",
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
    role: "contestant",
  },
  {
    name: "Diana Prince",
    email: "diana@example.com",
    password: "password123",
    role: "contestant",
  },
  {
    name: "Ethan Hunt",
    email: "ethan@example.com",
    password: "password123",
    role: "contestant"
  },
  {
    name: "Fiona Gallagher",
    email: "fiona@example.com",
    password: "password123",
    role: "client",
  },
  {
    name: "George Miller",
    email: "george@example.com",
    password: "password123",
    role: "client",
  },
  {
    name: "Hannah Lee",
    email: "hannah@example.com",
    password: "password123",
    role: "client",
  },
  {
    name: "Ian Curtis",
    email: "ian@example.com",
    password: "password123",
    role: "contestant"
  },
  {
    name: "Julia Roberts",
    email: "julia@example.com",
    password: "password123",
    role: "contestant",
  },
];



async function seedUsers() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    await User.deleteMany({});
    const hashedUsers = await Promise.all(
      users.map(async (user) => ({
        ...user,
        password: await bcrypt.hash(user.password, 10),
      }))
    );
    await User.insertMany(hashedUsers);
    console.log("User data seeded!");
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

seedUsers();
