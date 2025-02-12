import { Boxes } from "lucide-react";
import Link from "next/link";

function Footer() {
  return (
    <div className="max-w-screen-2xl mx-auto">
      <div className="flex items-center px-4 py-2">
        <div className="flex item-ceter">
          <Link href={"/"} className="mr-6 flex items-center space-x-2">
            <span className="p-2 rounded-md  [&>svg:hover]:fill-primary">
              <Boxes strokeWidth={1} className="dark:text-primary" />
            </span>
          </Link>
        </div>
        <div className="ml-auto">
          <p className="text-muted-foreground text-sm">
            Made with ❤️ by{" "}
            <a
              href="#"
              className="text-primary font-bold underline decoration-wavy decoration-1 underline-offset-2"
            >
              deeps8
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Footer;
