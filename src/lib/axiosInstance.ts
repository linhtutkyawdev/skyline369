import axios from "axios";
// import { createDecipheriv } from "crypto";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// export function decrypt(edata: string) {
//   const key = Buffer.from(import.meta.env.VITE_AES_KEY, "utf8");
//   const iv = Buffer.from(import.meta.env.VITE_AES_IV, "utf8");

//   try {
//     // Verify key/IV length for AES-128-CBC
//     if (key.length !== 16)
//       throw new Error("Invalid key length (requires 16 bytes)");
//     if (iv.length !== 16)
//       throw new Error("Invalid IV length (requires 16 bytes)");

//     const encrypted = Buffer.from(edata, "base64");

//     const decipher = createDecipheriv("aes-128-cbc", key, iv);
//     decipher.setAutoPadding(true); // Explicitly enable PKCS7 padding

//     let decrypted = decipher.update(encrypted);
//     decrypted = Buffer.concat([decrypted, decipher.final()]);

//     const result = JSON.parse(decrypted.toString("utf8"));

//     return result;
//   } catch (error) {
//     console.error("Decryption failed:");
//     console.error("Input data:", edata);
//     console.error("Error:", error);
//     throw new Error("Failed to decrypt data");
//   }
// }

export async function decrypt(edata) {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(import.meta.env.VITE_AES_KEY),
    { name: "AES-CBC" },
    false,
    ["decrypt"]
  );

  const iv = new TextEncoder().encode(import.meta.env.VITE_AES_IV);
  const encryptedData = Uint8Array.from(atob(edata), (c) => c.charCodeAt(0));

  try {
    const decryptedBuffer = await crypto.subtle.decrypt(
      { name: "AES-CBC", iv },
      key,
      encryptedData
    );

    const decryptedText = new TextDecoder().decode(decryptedBuffer);
    return JSON.parse(decryptedText);
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
