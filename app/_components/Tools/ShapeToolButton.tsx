import {
  ForwardRefExoticComponent,
  ReactNode,
  RefAttributes,
  RefObject,
} from "react";
import { Slot } from "@radix-ui/react-slot";

import { LucideProps } from "lucide-react";
import { GEOMETRIES_TYPE } from "@/app/_Editor/Creation/sceneGeometries";
import ToolDropdownMenu from "./ToolDropdownMenu";
import { cn } from "@/app/_lib/utils";

type ShapeToolButtonProps = {
  label?: string;
  wrapperClassName?: string;
  icon?: ReactNode;
  showDownArrow?: boolean;
  asChild?: boolean;
  children?: ReactNode;
  secondBtn?: ReactNode;
  onClick: (e: keyof typeof GEOMETRIES_TYPE) => void;
  ref?: RefObject<HTMLButtonElement | null>;
  toggleMenu?: (id: string) => void;
  otherShapes?: {
    geometry: string;
    icon: ForwardRefExoticComponent<
      Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>
    >;
  }[];
};

export default function ShapeToolButton({
  showDownArrow,
  icon,
  label,
  wrapperClassName,
  asChild = false,
  children,
  secondBtn,
  onClick,
  ref,
  toggleMenu,
  otherShapes,
}: ShapeToolButtonProps) {
  const Comp = asChild ? Slot : "button";
  const tooltipClasses =
    label &&
    "hover:bg-borders px-2 h-full rounded-md relative before:absolute before:-bottom-10 before:text-xs before:w-max before:max-w-[200px] before:inline-block before:left-1/2 before:pointer-events-none before:bg-surface before:px-2 before:py-1 before:rounded-sm hover:before:opacity-100 before:opacity-0 before:invisible before:duration-200 hover:before:visible before:-translate-x-1/2 before:content-[attr(data-tooltip)]";

  const baseClasses =
    !label && !secondBtn && "hover:bg-borders px-2 h-full rounded-md";

  return (
    <div className={wrapperClassName || "flex items-center h-8"}>
      <Comp
        onClick={() => onClick?.(label as keyof typeof GEOMETRIES_TYPE)}
        ref={ref}
        data-tooltip={label}
        className={cn(tooltipClasses, baseClasses)}
      >
        {asChild ? children : icon}
      </Comp>

      {showDownArrow && (
        <ToolDropdownMenu
          label={label ?? ""}
          onClick={onClick}
          otherShapes={otherShapes ?? []}
          toggleMenu={toggleMenu!}
        />
      )}

      {secondBtn && secondBtn}
    </div>
  );
}
