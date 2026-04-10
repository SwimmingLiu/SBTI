import type { Metadata } from "next";

import { TestHome } from "@/components/home/test-home";

export const metadata: Metadata = {
  alternates: {
    canonical: "/",
  },
};

export default function Home() {
  return <TestHome />;
}
