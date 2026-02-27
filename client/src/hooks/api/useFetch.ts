import { useState } from "react";

export function useFetch<T>() {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchData = async (url: string, options?: RequestInit) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(url, options);
      const jsonData = await response.json(); // parse response even if is not ok

      if (!response.ok) {
        // Server returned an error with a message
        setError(jsonData?.message || "Unknown error");
      }

    const result = { ok: response.ok, status: response.status, ...jsonData };
    setData(result);
    return result;
    } catch (err) {
      setError(err as Error);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { data, error, loading, fetchData };
}
