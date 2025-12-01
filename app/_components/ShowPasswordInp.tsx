"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Input } from "./ui/input";

export default function ShowPasswordInp() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <>
      <Input
        type={showPassword ? "text" : "password"}
        name="password"
        id="password"
        placeholder="Enter at least 8+ characters"
        className="bg-surface border border-borders text-secondary placeholder:text-secondary/50 focus:border-gold focus:ring-gold"
        required
      />
      <button
        type="button"
        onClick={() => setShowPassword(!showPassword)}
        className="absolute right-2 top-1/2 -translate-y-1/2 hover:text-secondary transition-colors"
      >
        {showPassword ? (
          <EyeOff className="w-5 h-5" />
        ) : (
          <Eye className="w-5 h-5" />
        )}
      </button>
    </>
  );
}
