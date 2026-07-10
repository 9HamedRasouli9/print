import app from "./server.js";
import connectDB from "./config/db.js";
import User from "./models/user.js";

const Port = process.env.PORT || 5000;

const DEFAULT_ADMIN = {
  fullName: "مدیر سیستم",
  email: "admin@print.local",
  password: "admin123",
  role: "owner",
};

const start = async () => {
  try {
    await connectDB();

    // Seed default admin if no users exist
    const userCount = await User.countDocuments();
    if (userCount === 0) {
      await User.create(DEFAULT_ADMIN);
      console.log("Default admin created:");
      console.log(`  Email: ${DEFAULT_ADMIN.email}`);
      console.log(`  Password: ${DEFAULT_ADMIN.password}`);
      console.log("  ** Change these credentials after first login! **");
    }

    app.listen(Port, () => console.log("Server is running on Port: ", Port));
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

start();
