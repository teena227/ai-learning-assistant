import express from "express";
import {
    generateSummary,
    generateFlashcards,
    generateQuiz,
    chatWithDocument,
} from "../controllers/aiController.js";
import authMiddleware from "../middleware/auth.js";

const router = express.Router();

router.post("/summary", authMiddleware, generateSummary);
router.post("/flashcards", authMiddleware, generateFlashcards);
router.post("/quiz", authMiddleware, generateQuiz);
router.post("/chat", authMiddleware, chatWithDocument);

export default router;