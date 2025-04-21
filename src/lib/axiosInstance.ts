import axios from "axios";
const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

import CryptoJS from "crypto-js";

export function decrypt(edata: string): any {
  try {
    const key = CryptoJS.enc.Utf8.parse(import.meta.env.VITE_AES_KEY);
    const iv = CryptoJS.enc.Utf8.parse(import.meta.env.VITE_AES_IV);

    const decrypted = CryptoJS.AES.decrypt(edata, key, {
      iv: iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    });

    return JSON.parse(decrypted.toString(CryptoJS.enc.Utf8));
  } catch (error) {
    console.error("Decryption failed:", error);
    throw new Error("Failed to decrypt data");
  }
}

// Add a request interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    try {
      // Ensure response.data is valid JSON
      if (response.data.data) {
        response.data.data = decrypt(response.data.data);
      }

      return response;
    } catch (error) {
      console.error("JSON Parsing Error:", error);
      return Promise.reject(new Error("Invalid JSON format in response"));
    }
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;
