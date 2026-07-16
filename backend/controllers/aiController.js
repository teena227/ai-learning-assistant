import { GoogleGenerativeAI } from "@google/generative-ai";
import dns from "dns";

dns.setServers(["8.8.8.8", "8.8.4.4"]);
dns.setDefaultResultOrder("ipv4first");

const getModel = () => {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    return genAI.getGenerativeModel({ model: "gemini-3.5-flash" });
};


export const generateSummary = async (req, res) => {
    try {
         const model = getModel();
          const { content } = req.body;
       

        if (!content) {
            return res.status(400).json({ message: "Content is required" });
        }

        const prompt = `You are a study assistant. Please provide a clear and concise summary of the following document content. Focus on the key points and main ideas:

${content}

Provide the summary in a well-structured format with main points.`;

        const result = await model.generateContent(prompt);
        const summary = result.response.text();

        res.json({ summary });

    } catch (error) {
         console.log("Gemini error:", error.message); 
        res.status(500).json({ message: error.message });
    }
};


export const generateFlashcards = async (req, res) => {
    try {
          const model = getModel();
          const { content } = req.body;

        if (!content) {
            return res.status(400).json({ message: "Content is required" });
        }

        const prompt = `You are a study assistant. Generate 10 flashcards from the following document content.

Return ONLY a JSON array in this exact format, no other text:
[
  {
    "question": "question here",
    "answer": "answer here"
  }
]

Document content:
${content}`;

        const result = await model.generateContent(prompt);
        const text = result.response.text();
        const clean = text.replace(/\`\`\`json|\`\`\`/g, "").trim();
        const flashcards = JSON.parse(clean);

        res.json({ flashcards });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


export const generateQuiz = async (req, res) => {
    try {
        const model = getModel();
        const { content, count = 5 } = req.body;

        if (!content) {
            return res.status(400).json({ message: "Content is required" });
        }

        const prompt = `You are a study assistant. Generate ${count} multiple choice questions from the following document content.

Return ONLY a JSON array in this exact format, no other text:
[
  {
    "question": "question here",
    "options": ["option A", "option B", "option C", "option D"],
    "correct": "option A",
    "explanation": "why this is correct"
  }
]

Document content:
${content}`;

        const result = await model.generateContent(prompt);
        const text = result.response.text();
        const clean = text.replace(/\`\`\`json|\`\`\`/g, "").trim();
        const quiz = JSON.parse(clean);

        res.json({ quiz });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


export const chatWithDocument = async (req, res) => {
    try {
        const model = getModel();
        const { content, question } = req.body;

        if (!content || !question) {
            return res.status(400).json({ message: "Content and question are required" });
        }

        const prompt = `You are a helpful study assistant. Answer the following question based on the document content provided.

Document Content:
${content}

Question: ${question}

Provide a clear, accurate and helpful answer based on the document content.`;

        const result = await model.generateContent(prompt);
        const answer = result.response.text();

        res.json({ answer });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};