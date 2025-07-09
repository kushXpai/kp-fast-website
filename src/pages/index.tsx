// src/pages/index.tsx

import { useEffect } from "react";
import { useRouter } from "next/router";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/Login");
  }, [router]);

  return <p>Redirecting to Login...</p>;
}
