import express from "express";
import multer from "multer";
import path from "path";
import {
    uploadDocument,
    getAllDocuments,
    getDocumentById,
    deleteDocument,
} from "../controllers/documentController.js";
import authMiddleware from "../middleware/auth.js";

// Multer setup
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/");
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    },
});

const upload = multer({
    storage,
    fileFilter: (req, file, cb) => {
        if (file.mimetype === "application/pdf") {
            cb(null, true);
        } else {
            cb(new Error("Only PDF files allowed!"), false);
        }
    },
});

const router = express.Router();

router.post("/upload", authMiddleware, upload.single("file"), uploadDocument);
router.get("/", authMiddleware, getAllDocuments);
router.get("/:id", authMiddleware, getDocumentById);
router.delete("/:id", authMiddleware, deleteDocument);

export default router;