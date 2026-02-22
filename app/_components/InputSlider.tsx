import { Input } from "./ui/input";
import { Slider } from "./ui/slider";

import { MaterialProps, MaterialValue } from "../_types/material";

export default function InputSlider({
  label,
  prop,
  min = 0,
  max = 1,
  step = 0.01,
  geometryMaterial,
  applyMaterialProperty,
  isSpecialProperty = false,
  specialPropertyValue,
  onChange,
}: {
  label: string;
  prop?: string;
  min?: number;
  max?: number;
  step?: number;
  geometryMaterial?: MaterialProps;
  applyMaterialProperty?: (patch: Record<string, MaterialValue>) => void;

  isSpecialProperty?: boolean;
  specialPropertyValue?: number;
  onChange?: (value: number) => void;
}) {
  const currentValue = isSpecialProperty
    ? (specialPropertyValue ?? 0)
    : ((geometryMaterial?.props[prop as string] as number) ?? 0);

  const handleUpdate = (val: number) => {
    const safeValue = isNaN(val) ? 0 : Math.min(Math.max(val, min), max);

    if (isSpecialProperty) {
      if (onChange) {
        onChange(safeValue);
      }
    } else {
      if (applyMaterialProperty) {
        const patch: Record<string, MaterialValue> = {
          [prop as string]: safeValue,
        };

        if (prop === "transmission" || prop === "opacity") {
          patch.transparent =
            safeValue < 1 || (prop === "transmission" && safeValue > 0);
        }

        applyMaterialProperty(patch);
      }
    }
  };

  return (
    <div className="grid items-center mb-2 grid-cols-8">
      <span className="col-span-2 text-xs truncate">{label}</span>

      <div className="col-span-6 items-center flex gap-1">
        <Input
          type="number"
          className="h-6 rounded-sm w-10 text-xs border-0 bg-borders p-1 focus-visible:ring-[1px] selection:bg-hover/50 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
          value={currentValue}
          step={step}
          onChange={(e) => handleUpdate(parseFloat(e.target.value))}
        />
        <Slider
          value={[currentValue]}
          min={min}
          max={max}
          step={step}
          onValueChange={([val]) => handleUpdate(val)}
          className="bg-borders h-6 border-0 rounded-sm"
        />
      </div>
    </div>
  );
}
