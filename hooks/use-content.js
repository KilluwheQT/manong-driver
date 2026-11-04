"use client";

import { useCallback, useEffect, useState } from "react";
import { listContent } from "@/lib/firestore";

export function useContent(name, options = {}) {
  const admin = Boolean(options.admin);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [requestId, setRequestId] = useState(0);

  const refresh = useCallback(() => {
    setLoading(true);
    setError("");
    setRequestId((current) => current + 1);
  }, []);

  useEffect(() => {
    let active = true;
    listContent(name, { admin })
      .then((result) => { if (active) setItems(result); })
      .catch((reason) => { if (active) setError(reason.message || "Unable to load content."); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [name, admin, requestId]);
  return { items, loading, error, refresh };
}
