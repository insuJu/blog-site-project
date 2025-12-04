import { useEffect, useState } from "react";
import { getStats } from "../api/statsApi";

export const useStats = () => {
  const [stats, setStats] = useState({
    postCount: 0,
    commentCount: 0,
    viewCount: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getStats();
        setStats(data || { postCount: 0, commentCount: 0, viewCount: 0 });
      } catch (err) {
        console.error("Failed to load stats:", err);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  return { stats, loading, error };
};
