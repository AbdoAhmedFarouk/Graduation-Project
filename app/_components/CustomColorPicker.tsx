import { HexColorInput, HexColorPicker } from "react-colorful";

interface ColorPickerProps {
  label: string;
  background: string;
  ref: React.RefObject<HTMLSpanElement | null>;
  onClick: (e: React.MouseEvent<HTMLSpanElement>) => void;
  showColorPicker: boolean;
  onColorPickerChange: (color: string) => void;
  onInputChange: (color: string) => void;
  onBlur: (e: React.FocusEvent<HTMLInputElement>) => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  pickerClassname?: string;
}

export default function CustomColorPicker({
  background,
  label,
  ref,
  onClick,
  showColorPicker,
  onColorPickerChange,
  onInputChange,
  onBlur,
  onKeyDown,
  pickerClassname,
}: ColorPickerProps) {
  return (
    <div className="grid items-center mb-2 grid-cols-8 text-xs relative">
      <span className="col-span-2">{label}</span>

      <div className="col-span-6 items-center flex gap-1">
        <span
          className="size-5 rounded-sm shrink-0"
          style={{
            backgroundColor: background ? `#${background}` : "transparent",
          }}
          onClick={onClick}
          ref={ref}
        />

        {showColorPicker && (
          <HexColorPicker
            className={pickerClassname}
            color={`#${background}`}
            onChange={onColorPickerChange}
          />
        )}
        <HexColorInput
          color={background}
          maxLength={7}
          onChange={onInputChange}
          onBlur={onBlur}
          onKeyDown={onKeyDown}
          placeholder="Type a color"
          prefixed
          alpha
          className="h-6 min-w-0 w-0 flex-1 rounded-sm text-xs p-1 border-0 bg-borders focus-visible:ring-0 focus-visible:border selection:bg-hover/50"
        />
      </div>
    </div>
  );
}
