import ShapeToolButton from "./ShapeToolButton";
import ShapesButton from "./ShapesButton";
import { Button } from "./ui/button";

import { GEOMETRIES_TYPE } from "../_validators/deisgnPageGeometries";

import { AlarmClock, MousePointer2, Play, Plus } from "lucide-react";

export default function MiddleBar({
  onClick,
}: {
  onClick: (e: keyof typeof GEOMETRIES_TYPE) => void;
}) {
  const handleVirtualClick = () => {
    console.log("clicked");
  };

  return (
    <div className="absolute flex items-center text-secondary left-1/2 top-5 p-2 -translate-x-1/2 rounded-xl bg-surface">
      <ShapeToolButton
        onClick={handleVirtualClick}
        wrapperClassName="me-3 h-8"
        asChild
      >
        <Button
          size="sm"
          className="hover:bg-secondary/20"
          variant="customVariant"
        >
          <Plus />
        </Button>
      </ShapeToolButton>

      <ShapesButton onClick={onClick} />

      <ShapeToolButton
        onClick={handleVirtualClick}
        wrapperClassName="flex items-center relative after:absolute after:right-0 after:h-1/2 after:top-1/2 after:-translate-1/2 after:w-[1px] after:bg-secondary/40 px-3"
        asChild
        secondBtn={
          <Button
            className="hover:bg-secondary/20"
            size="sm"
            variant="customVariant"
          >
            <AlarmClock />
          </Button>
        }
      >
        <Button size="sm" variant="customVariant" className="bg-gold/80">
          <MousePointer2 />
        </Button>
      </ShapeToolButton>

      <ShapeToolButton
        onClick={handleVirtualClick}
        wrapperClassName="ms-3 h-8"
        asChild
      >
        <Button
          size="sm"
          className="hover:bg-secondary/20"
          variant="customVariant"
        >
          <Play />
        </Button>
      </ShapeToolButton>
    </div>
  );
}
