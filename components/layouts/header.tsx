import { Boxes, Github } from "lucide-react";
import Link from "next/link";

export function Header() {
  return (
    <div className="max-w-screen-2xl mx-auto">
      <div className="flex items-center px-4 py-2">
        <div className="flex items-center">
          <Link href={"/"} className="mr-6 flex items-center space-x-2">
            <span className="p-2 rounded-md dark:bg-white">
              <Boxes strokeWidth={1} className="text-black" />
            </span>
          </Link>
          <nav className="flex items-center gap-4 text-sm">
            <Link href={"/about"}>Features</Link>
            <Link href={"/usage"}>Usage</Link>
            <Link href={"/templates"}>Templates</Link>
            <Link
              href={"/builder"}
              //   className="text-primary font-bold underline decoration-wavy decoration-1 underline-offset-4"
            >
              Builder
            </Link>
          </nav>
        </div>
        <div className="flex flex-1 justify-end space-x-3">
          <a href="#">
            <Github />
          </a>
        </div>
      </div>
    </div>
  );
}
