import express from "express";
import customerRoute from "../routes/customerRoutes.js";
import transactionRoute from "../routes/transactionRoutes.js";

const routes = express.Router();

routes.use("/customers", customerRoute);
routes.use("/transactions", transactionRoute);

routes.post("/", (req, res) => {
  console.log("welcome");
});

export default routes;
