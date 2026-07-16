import api from "../api/axios.js";
import { API_PATHS } from "../utils/apiPaths.js";

export const loginService = (data) => api.post(API_PATHS.AUTH.LOGIN, data);
export const signupService = (data) => api.post(API_PATHS.AUTH.SIGNUP, data);