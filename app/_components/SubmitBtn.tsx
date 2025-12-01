"use client";

import { Button } from "./ui/button";
import { useFormStatus } from "react-dom";

type BtnProps = {
  loadingText: string;
  text: string;
};

export default function SubmitBtn({ loadingText, text }: BtnProps) {
  const { pending } = useFormStatus();

  return (
    <Button
      disabled={pending}
      className="w-full bg-gold text-dark font-semibold py-3 rounded-lg hover:bg-hover transition-colors duration-200"
    >
      {pending ? (
        <span className="flex items-center gap-2">
          <span className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
          {loadingText}
        </span>
      ) : (
        <span>{text}</span>
      )}
    </Button>
  );
}
