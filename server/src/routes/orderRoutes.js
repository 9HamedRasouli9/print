import { Router } from "express";
import {
  createOrder,
  getAll,
  getById,
  updateOrder,
  deleteOrder,
} from "../controllers/orderController.js";

const router = Router();

router.post("", createOrder);
router.get("", getAll);
router.get("/:id", getById);
router.put("/:id", updateOrder);
router.delete("/:id", deleteOrder);

export default router;
