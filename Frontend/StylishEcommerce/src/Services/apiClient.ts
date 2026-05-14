import axios from "axios";
import { Platform } from "react-native";

const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;

const isAndroid = Platform.OS === "android" ? true : false;
console.log("isAndroid : ", isAndroid);

const apiClient = axios.create({
  baseURL: isAndroid ? "http://192.168.29.30:5000/api" : API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

export default apiClient;
