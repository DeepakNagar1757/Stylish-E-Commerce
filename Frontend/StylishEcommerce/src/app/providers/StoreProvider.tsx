import { useEffect } from "react";
import { useAuthStore } from "@/src/Store/authStore";

export default function StoreProvider({ children }: any) {
  const loadAuth = useAuthStore((state) => state.loadAuth);

  useEffect(() => {
    loadAuth();
  }, []);

  return children;
}
