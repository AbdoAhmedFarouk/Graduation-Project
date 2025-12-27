import { useEffect } from "react";
import { useThree } from "@react-three/fiber";

type Params = {
  onPointerMove?: (e: MouseEvent) => void;
  onPointerDown?: (e: MouseEvent) => void;
  onPointerUp?: (e: MouseEvent) => void;
  onClick?: (e: MouseEvent) => void;
};

export function useSceneEvents({
  onPointerMove,
  onPointerDown,
  onPointerUp,
  onClick,
}: Params) {
  const { gl } = useThree();

  useEffect(() => {
    const dom = gl.domElement;

    if (onPointerMove) dom.addEventListener("pointermove", onPointerMove);
    if (onPointerDown) dom.addEventListener("pointerdown", onPointerDown);
    if (onPointerUp) dom.addEventListener("pointerup", onPointerUp);
    if (onClick) dom.addEventListener("click", onClick);

    return () => {
      if (onPointerMove) dom.removeEventListener("pointermove", onPointerMove);
      if (onPointerDown) dom.removeEventListener("pointerdown", onPointerDown);
      if (onPointerUp) dom.removeEventListener("pointerup", onPointerUp);
      if (onClick) dom.removeEventListener("click", onClick);
    };
  });
}
