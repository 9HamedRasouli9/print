import express from "express";

const routes = express.Router();

routes.post("/", (req, res) => {
  console.log("welcome");
});

export default routes;
