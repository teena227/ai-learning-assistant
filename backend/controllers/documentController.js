import Document from "../models/Document.js";
import fs from "fs";
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const pdfParse = require("pdf-parse");


// Upload Document
export const uploadDocument = async (req, res) => {
    try {
        const { title } = req.body;
        const userId = req.user.id;

        if (!req.file) {
            return res.status(400).json({ message: "No file uploaded" });
        }

        // Extract text from PDF
        const dataBuffer = fs.readFileSync(req.file.path);
        const pdfData = await pdfParse(dataBuffer);
        const extractedText = pdfData.text;

     
        const document = await Document.create({
            userId,
            title: title || req.file.originalname,
            filename: req.file.originalname,
            filepath: req.file.path,
            size: req.file.size,
            content: extractedText,
        });

        res.status(201).json({
            message: "Document uploaded successfully",
            document,
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get All Documents
export const getAllDocuments = async (req, res) => {
    try {
        const userId = req.user.id;
        const documents = await Document.find({ userId }).sort({ createdAt: -1 });
        res.json(documents);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get Single Document
export const getDocumentById = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;

        const document = await Document.findOne({ _id: id, userId });

        if (!document) {
            return res.status(404).json({ message: "Document not found" });
        }

        res.json(document);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete Document
export const deleteDocument = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;

        const document = await Document.findOne({ _id: id, userId });

        if (!document) {
            return res.status(404).json({ message: "Document not found" });
        }

        if (document.filepath && fs.existsSync(document.filepath)) {
            fs.unlinkSync(document.filepath);
        }

        await Document.findByIdAndDelete(id);

        res.json({ message: "Document deleted successfully" });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};