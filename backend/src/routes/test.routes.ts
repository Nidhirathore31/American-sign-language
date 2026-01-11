import { Router } from "express";
import { saveTest, getTestHistory, getTestResult } from "../controllers/test.controller";
import { authenticate } from "../middleware/auth.middleware";

const router = Router();

router.use(authenticate);
router.post("/", saveTest);
router.get("/history", getTestHistory);
router.get("/:id", getTestResult);

export default router;
