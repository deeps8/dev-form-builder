import Link from "next/link";
import React from "react";

export default function BuilderHeader() {
  return (
    <div className="max-w-screen-2xl mx-auto">
      <div className="flex items-center px-4 py-2 text-sm">
        <div className="flex items-center">
          <nav className="flex items-center gap-4 text-sm text-muted-foreground [&>a:hover]:text-primary [&>button:hover]:text-primary">
            <Link href={"/builder/preview"}>Preview</Link>
            <button type="button">Theme</button>
          </nav>
        </div>
        <div className="flex justify-end items-center ml-auto"></div>
      </div>
    </div>
  );
}
