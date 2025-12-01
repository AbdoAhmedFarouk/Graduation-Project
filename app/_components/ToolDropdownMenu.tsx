import {
  ForwardRefExoticComponent,
  RefAttributes,
  useEffect,
  useRef,
} from "react";

import { useMiddlebarStore } from "../_store/store";

import { GEOMETRIES_TYPE } from "../_validators/deisgnPageGeometries";
import { ChevronDown, LucideProps } from "lucide-react";

type Props = {
  label: string;
  toggleMenu: (id: string) => void;
  otherShapes: {
    geometry: string;
    icon: ForwardRefExoticComponent<
      Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>
    >;
  }[];
  onClick: (e: keyof typeof GEOMETRIES_TYPE) => void;
};

export default function ToolDropdownMenu({
  label,
  toggleMenu,
  otherShapes,
  onClick,
}: Props) {
  const activeMenu = useMiddlebarStore((state) => state.activeMenu);

  const ref = useRef<HTMLDivElement>(null);
  const showDropdownMenu = activeMenu === label;

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        toggleMenu("");
      }
    };
    document.addEventListener("click", handler);

    return () => document.removeEventListener("click", handler);
  }, [toggleMenu]);

  return (
    <div ref={ref} className="relative h-full">
      <span
        onClick={() => toggleMenu(label)}
        className="h-full p-0.5 flex items-center hover:bg-borders rounded-sm"
      >
        <ChevronDown size={14} />
      </span>

      {showDropdownMenu && (
        <ul className="bg-surface absolute left-1/2 text-secondary/80 -translate-x-1/2 top-[calc(100%+15px)] p-3 rounded-md space-y-2">
          {otherShapes.map((shape) => (
            <li
              key={shape.geometry}
              onClick={() =>
                onClick?.(shape.geometry as keyof typeof GEOMETRIES_TYPE)
              }
              className="flex cursor-pointer items-center gap-2 text-sm hover:bg-borders py-1 px-4 rounded-md"
            >
              <span>
                <shape.icon size={18} />
              </span>

              {shape.geometry}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
