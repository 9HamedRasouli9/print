import { Router } from "express";
import {
  createPrintJob,
  getAll,
  getById,
  updatePrintJob,
  deletePrintJob,
} from "../controllers/printJobController.js";

const router = Router();

router.post("", createPrintJob);
router.get("", getAll);
router.get("/:id", getById);
router.put("/:id", updatePrintJob);
router.delete("/:id", deletePrintJob);

export default router;
