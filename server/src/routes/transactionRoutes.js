import { Router } from "express";

import {
  createTransaction,
  getAll,
  updateTransaction,
  deleteTransaction,
} from "../controllers/transactionController.js";

const router = Router();

router.post("", createTransaction);
router.get("", getAll);
router.put("/:id", updateTransaction);
router.delete("/:id", deleteTransaction);

export default router;
