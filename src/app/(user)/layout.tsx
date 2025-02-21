'use client'
import PermissionAccept from "@/HOCs/CheckRole";
import { Suspense } from "react";


const ProtectedContent = PermissionAccept(
  ({ children }: { children: React.ReactNode }) => <>{children}</>,
  ['COLLECTOR'] 
);

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Suspense>
        <ProtectedContent>
          {children}
        </ProtectedContent>
      </Suspense>
    </>
  );
}