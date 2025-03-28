import { useState, useEffect, useRef } from "react";
import axiosInstance from "@/lib/axiosInstance";
import { useUserStore } from "@/store/user";

const Deposit = () => {
  const { user } = useUserStore();
  if (!user) return "nouser";

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const isMounted = useRef(true);

  useEffect(() => {
    // Mark component as mounted
    isMounted.current = true;

    const poll = async () => {
      try {
        const response = await axiosInstance.post("/player_deposit_listing", {
          token: user.token,
        });
        if (isMounted.current) {
          setData(response.data);
          setLoading(false);
        }
      } catch (error) {
        console.error("Error fetching deposit listing:", error);
        // Optionally, handle the error (set error state, etc.)
      } finally {
        // Wait for a delay before polling again (adjust delay as needed)
        if (isMounted.current) {
          setTimeout(poll, 5000); // 1 second delay between requests
        }
      }
    };

    poll();

    // Cleanup on unmount
    return () => {
      isMounted.current = false;
    };
  }, [user]);

  return (
    <div>
      {loading ? <p>Loading...</p> : <pre>{JSON.stringify(data, null, 2)}</pre>}
    </div>
  );
};

export default Deposit;
