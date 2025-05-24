import axios from "axios";
import ENV from "./custom-env";

export const axiosCient = axios.create({
  baseURL: ENV.AI_API_ENDPOINT,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});