import { useEffect, useState } from "react";

interface UseFetchResult<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

export function useFetch<T>(url: string): UseFetchResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;
    let isAborted = false;

    console.log("=== INICIO DE FETCH, setLoading(true) ===");
    setLoading(true);
    setData(null);
    setError(null);

    fetch(url, { credentials: "include", signal })
      .then((response) => {
        if (!response.ok) throw new Error("Failed to fetch data");
        return response.json() as Promise<T>;
      })
      .then((result) => {
        if (!isAborted) setData(result); // Solo actualiza datos si no se ha abortado
      })
      .catch((err) => {
        if (err.name !== "AbortError") {
          console.error("Error fetching data:", err);
          if (!isAborted) setError("Error al cargar los datos. Por favor, inténtalo de nuevo más tarde.");
        } else {
          console.log("=== FETCH ABORTADO ===");
        }
      })
      .finally(() => {
        if (!isAborted) {
          console.log("=== FIN DE FETCH, setLoading(false) ===");
          setLoading(false); // Solo cambia loading si no se ha abortado
        }
      });

    return () => {
      console.log("=== ABORTANDO FETCH ===");
      isAborted = true; // Marca que el efecto se ha limpiado
      controller.abort();
    };
  }, [url]);

  return { data, loading, error };
}
