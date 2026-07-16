import api from "../api/axios.js";
import { API_PATHS } from "../utils/apiPaths.js";

export const getDocumentService = (id) =>
    api.get(`${API_PATHS.DOCUMENT.GET_ALL}/${id}`);

export const generateSummaryService = (content) =>
    api.post(API_PATHS.AI.SUMMARY, { content });

export const generateFlashcardsService = (content) =>
    api.post(API_PATHS.AI.FLASHCARDS, { content });

export const generateQuizService = (content, count) =>
    api.post(API_PATHS.AI.QUIZ, { content, count });

export const chatService = (content, question) =>
    api.post(API_PATHS.AI.CHAT, { content, question });