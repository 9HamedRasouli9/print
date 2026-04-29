import app from "./server.js";
import connectDB from "./config/db.js";

const Port = process.env.PORT || 5000;

const start = async () => {
  try {
    await connectDB();
    app.listen(Port, () => console.log("Server is runnin on Port: ", Port));
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};
start();
