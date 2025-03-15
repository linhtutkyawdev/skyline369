import axios from "axios";
import { MD5, enc, HmacSHA1 } from "crypto-js";

// Generate required headers accoding to the API documentation
const headers = {
  "X-Merchant-Id": import.meta.env.VITE_MERCHANT_ID, // Your merchant_id
  "X-Timestamp": Math.floor(Date.now() / 1000), // Current Timestamp
  "X-Nonce": MD5(Math.random().toString()).toString(), // Random unique identifier
};

const slotgatorAxiosInstance = axios.create({
  baseURL: `${import.meta.env.VITE_SLOTGATOR_API_BASE_URL}`, // set default api base url
  headers, // set defaut headers
});

// Add a request interceptor
slotgatorAxiosInstance.interceptors.request.use(
  (config) => {
    const headers_and_params = {
      ...headers,
      ...config.params,
    }; // combine headers and params

    const sorted_headers_and_params = Object.keys(headers_and_params)
      .sort()
      .map((key) => {
        return `${encodeURIComponent(key)}=${encodeURIComponent(
          headers_and_params[key]
        )}`;
      }); // sort them

    const queryString = sorted_headers_and_params.join("&"); // make a queryString

    const XSign = HmacSHA1(
      queryString,
      import.meta.env.VITE_MERCHANT_KEY ?? ""
    ).toString(enc.Hex); // hash it to get the sign
    config.headers.set("X-Sign", XSign); // set the X-Sign header
    return config;
  },
  function (error) {
    // Do something with request error
    console.error(error);

    return Promise.reject(error);
  }
);

export default slotgatorAxiosInstance;
