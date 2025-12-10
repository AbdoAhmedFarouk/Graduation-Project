import ShapeToolButton from "./ShapeToolButton";

import { useMiddlebarStore, useSceneStore } from "../_store/store";

import {
  Box,
  MessageCircleMore,
  PenTool,
  Sparkles,
  Square,
  Type,
} from "lucide-react";

import {
  GEOMETRIES_2D,
  GEOMETRIES_3D,
  GEOMETRIES_TYPE,
} from "../_validators/sceneGeometries";

export default function ShapesButton({
  onClick,
}: {
  onClick: (e: keyof typeof GEOMETRIES_TYPE) => void;
}) {
  const desiredShape = useSceneStore((s) => s.desiredShape);
  const last2D = useSceneStore((s) => s.lastSelected2D);
  const last3D = useSceneStore((s) => s.lastSelected3D);

  const activeMenu = useMiddlebarStore((state) => state.activeMenu);
  const setActiveMenu = useMiddlebarStore((state) => state.setActiveMenu);

  const toggleMenu = (id: string) => {
    setActiveMenu(id === activeMenu ? "" : id);
  };

  const toolButtons = [
    { id: "sparkles", icon: Sparkles },
    {
      id: "rectangle",
      label: "Rectangle",
      icon: Square,
      dropdown: true,
      otherShapes: GEOMETRIES_2D,
      kind: "2d" as const,
    },
    {
      id: "cube",
      label: "Cube",
      icon: Box,
      dropdown: true,
      otherShapes: GEOMETRIES_3D,
      kind: "3d" as const,
    },
    { id: "text", label: "Text", icon: Type, dropdown: false },
    { id: "pen", label: "Pen", icon: PenTool, dropdown: false },
    {
      id: "comment",
      label: "Comment",
      icon: MessageCircleMore,
      dropdown: false,
    },
  ];

  return (
    <div className="flex-1 flex items-center relative before:absolute before:left-0 before:h-1/2 before:top-1/2 before:-translate-1/2 before:w-[1px] before:bg-secondary/40 gap-1 after:absolute after:right-0 after:h-1/2 after:top-1/2 after:-translate-1/2 after:w-[1px] after:bg-secondary/40 px-3">
      {toolButtons.map((btn) => {
        const hasDropdown = btn.otherShapes?.length ?? 0 > 0;
        const kind = btn.kind as "2d" | "3d";

        let foundShape = hasDropdown
          ? btn.otherShapes?.find((shape) => shape.geometry === desiredShape)
          : null;

        if (!foundShape && hasDropdown && kind) {
          const fallbackKey = kind === "2d" ? last2D : last3D;
          if (fallbackKey) {
            foundShape = btn.otherShapes?.find(
              (s) => s.geometry === fallbackKey
            );
          }
        }

        const IconComp = foundShape ? foundShape.icon : btn.icon;
        const labelText = foundShape ? foundShape.geometry : btn.label;

        return (
          <ShapeToolButton
            toggleMenu={toggleMenu}
            key={btn.id}
            label={labelText}
            showDownArrow={!!btn.dropdown}
            icon={IconComp ? <IconComp size={20} /> : <btn.icon size={20} />}
            otherShapes={btn.otherShapes}
            onClick={onClick}
          />
        );
      })}
    </div>
  );
}
