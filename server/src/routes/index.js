import express from "express";
import auth from "../middlewares/auth.js";
import customerRoute from "../routes/customerRoutes.js";
import transactionRoute from "../routes/transactionRoutes.js";
import authRoute from "../routes/authRoutes.js";
import orderRoute from "../routes/orderRoutes.js";
import invoiceRoute from "../routes/invoiceRoutes.js";
import printJobRoute from "../routes/printJobRoutes.js";

const routes = express.Router();

routes.use("/auth", authRoute);
routes.use("/customers", auth, customerRoute);
routes.use("/transactions", auth, transactionRoute);
routes.use("/orders", auth, orderRoute);
routes.use("/invoices", auth, invoiceRoute);
routes.use("/print-jobs", auth, printJobRoute);

export default routes;
