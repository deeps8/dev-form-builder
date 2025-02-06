import Link from "next/link";

export default function Home() {
  return (
    <div className="max-w-screen-2xl mx-auto">
      <div className="px-4 py-4">
        <div className="max-w-2xl mx-auto text-center my-5 space-y-6">
          <h1 className="text-4xl font-semibold">From drag-n-drop to code.</h1>
          <div className="text-muted-foreground text-pretty">
            <p>No-Code platform for creating customizable dynamic forms.</p>
            <p>
              Create dynamic, fully customizable forms with an intuitive
              drag-and-drop builder. Get instant previews and automatically
              generate clean, exportable code—whether for websites,
              applications, or integrations.
            </p>
          </div>
          <div className="space-x-5 flex items-center justify-center">
            <span>Ready to build ?</span>
            <Link
              href={"/builder"}
              className="px-4 py-2 bg-primary text-background rounded-full"
            >
              Become Bob The Builder
            </Link>
          </div>
        </div>
        {/* <div className="border rounded-lg bg-secondary h-svh w-10/12 mx-auto"></div> */}
      </div>
    </div>
  );
}
