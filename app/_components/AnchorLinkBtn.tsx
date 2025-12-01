import Link from "next/link";
import { ReactNode } from "react";
import { cn } from "../_lib/utils";

type LinkProps = {
  href: string;
  styles: string;
  children: ReactNode;
};

export default function AnchorLinkBtn({ href, styles, children }: LinkProps) {
  return (
    <Link
      href={href}
      className={cn("text-dark duration-200 transition-colors", styles)}
    >
      {children}
    </Link>
  );
}
