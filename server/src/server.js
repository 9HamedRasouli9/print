import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import routes from "./routes/index.js";
import errorHandler from "./middlewares/errorHandler.js";

const app = express();

app.use(
  cors({
    origin: [process.env.FRONTEND_API_URL || "http://localhost:5173/"],
    credentials: true,
  }),
);

app.use(express.json());

app.use(cookieParser());

// routes
app.use("/api", routes);

// error handler
app.use(errorHandler);

export default app;
