import { useState, useEffect, useRef } from "react";
import axios from "axios";

const useLongPolling = (url, config = {}) => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  // A ref to store whether the component is still mounted
  const isMounted = useRef(true);

  useEffect(() => {
    // Set mounted flag
    isMounted.current = true;

    // Function to perform the long polling request
    const poll = async () => {
      try {
        const response = await axios.get(url, config);
        if (isMounted.current) {
          setData(response.data);
        }
      } catch (err) {
        if (isMounted.current) {
          setError(err);
        }
      } finally {
        // Start a new request immediately or after a slight delay
        if (isMounted.current) {
          setTimeout(poll, 1000); // 1 second delay between requests
        }
      }
    };

    // Start polling
    poll();

    // Cleanup: stop polling when component unmounts
    return () => {
      isMounted.current = false;
    };
  }, [url, config]);

  return { data, error };
};

export default useLongPolling;
