import { Router } from "express";
import {
  createInvoice,
  getAll,
  getById,
  updateInvoice,
  deleteInvoice,
} from "../controllers/invoiceController.js";

const router = Router();

router.post("", createInvoice);
router.get("", getAll);
router.get("/:id", getById);
router.put("/:id", updateInvoice);
router.delete("/:id", deleteInvoice);

export default router;
