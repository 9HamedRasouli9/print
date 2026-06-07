import { Router } from "express";

import {
  createCustomer,
  getAll,
  updateCustomer,
  deleteCustomer,
} from "../controllers/customerController.js";

const router = Router();

router.post("", createCustomer);
router.get("", getAll);
router.put("/:id", updateCustomer);
router.delete("/:id", deleteCustomer);
export default router;
