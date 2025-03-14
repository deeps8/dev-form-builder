import BuilderHeader from "@/components/layouts/builder-header";
import React from "react";

export default function BuilderLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="builder-wrapper">
      <header className="sticky top-0 z-50 w-full border-b bg-muted">
        <BuilderHeader />
      </header>
      <main className="overflow-auto">{children}</main>
    </div>
  );
}
