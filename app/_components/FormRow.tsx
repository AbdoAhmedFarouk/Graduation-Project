import { ReactNode } from "react";
import { Input } from "./ui/input";

type RowProps = {
  htmlFor: string;
  type?: string;
  id?: string;
  placeholder?: string;
  required?: boolean;
  labelTxt: string;
  name?: string;
  children?: ReactNode;
};

export default function FormRow({
  type,
  id,
  name,
  placeholder,
  htmlFor,
  labelTxt,
  required,
  children,
}: RowProps) {
  return (
    <div className="space-y-2">
      <label
        htmlFor={htmlFor}
        className="text-sm font-medium text-secondary/90 inline-block"
      >
        {labelTxt}
      </label>

      {children || (
        <Input
          type={type}
          id={id}
          name={name}
          placeholder={placeholder}
          className="bg-surface border border-borders text-secondary placeholder:text-secondary/50"
          required={required}
        />
      )}
    </div>
  );
}
