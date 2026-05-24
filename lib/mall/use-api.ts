"use client";
import { useState, useEffect, useCallback } from "react";

export function useQuery<T>(url: string) {
  const [data, setData] = useState<T | undefined>();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(async () => {
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed to fetch");
      const json = await res.json();
      setData(json);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setIsLoading(false);
    }
  }, [url]);

  useEffect(() => { refetch(); }, [refetch]);

  return { data, isLoading, error, refetch };
}

export function useMutation<TInput = any, TOutput = any>(url: string, method = "POST") {
  const [isPending, setIsPending] = useState(false);

  const mutate = useCallback(async (input?: TInput, opts?: { onSuccess?: (data: TOutput) => void; onError?: (e: Error) => void }) => {
    setIsPending(true);
    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: input ? JSON.stringify(input) : undefined,
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: "Request failed" }));
        throw new Error(err.error || "Request failed");
      }
      const data = await res.json();
      opts?.onSuccess?.(data);
      return data as TOutput;
    } catch (e: any) {
      opts?.onError?.(e);
      throw e;
    } finally {
      setIsPending(false);
    }
  }, [url, method]);

  return { mutate, isPending };
}

export function useDynamicMutation<TInput = any>(method = "DELETE") {
  const [isPending, setIsPending] = useState(false);

  const mutate = useCallback(async (url: string, input?: TInput, opts?: { onSuccess?: () => void; onError?: (e: Error) => void }) => {
    setIsPending(true);
    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: input ? JSON.stringify(input) : undefined,
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: "Request failed" }));
        throw new Error(err.error || "Request failed");
      }
      opts?.onSuccess?.();
    } catch (e: any) {
      opts?.onError?.(e);
    } finally {
      setIsPending(false);
    }
  }, [method]);

  return { mutate, isPending };
}
