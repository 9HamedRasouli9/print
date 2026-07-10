import jwt from "jsonwebtoken";
import User from "../models/user.js";

const JWT_SECRET = process.env.JWT_SECRET || "dev-secret-change-in-production";
const JWT_EXPIRES_IN = "7d";

function signToken(user) {
  return jwt.sign(
    { id: user._id, email: user.email, role: user.role },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN },
  );
}

export const register = async ({ fullName, email, password }) => {
  if (!fullName) throw new Error("Full name is required");
  if (!email) throw new Error("Email is required");
  if (!password || password.length < 6)
    throw new Error("Password must be at least 6 characters");

  const existingUser = await User.findOne({ email: email.toLowerCase() });
  if (existingUser) {
    const error = new Error("Email already in use");
    error.status = 409;
    throw error;
  }

  const user = await User.create({ fullName, email, password });
  const token = signToken(user);

  return { user, token };
};

export const login = async ({ email, password }) => {
  if (!email) throw new Error("Email is required");
  if (!password) throw new Error("Password is required");

  const user = await User.findOne({ email: email.toLowerCase() });
  if (!user) {
    const error = new Error("Invalid email or password");
    error.status = 401;
    throw error;
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    const error = new Error("Invalid email or password");
    error.status = 401;
    throw error;
  }

  const token = signToken(user);

  return { user, token };
};

export const getMe = async (userId) => {
  const user = await User.findById(userId);
  if (!user) {
    const error = new Error("User not found");
    error.status = 404;
    throw error;
  }
  return user;
};
