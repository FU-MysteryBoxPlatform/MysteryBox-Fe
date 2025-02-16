import Footer from "@/components/layout/footer";
import Header from "@/components/layout/header";
import { Suspense } from "react";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Suspense>
        <Header />
        {children}
        <Footer />
      </Suspense>
    </>
  );
}
