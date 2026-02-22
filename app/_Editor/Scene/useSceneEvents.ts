import { useEffect } from "react";

type SceneEventsParams = {
  onPointerMove?: (e: PointerEvent) => void;
  onPointerDown?: (e: PointerEvent) => void;
  onPointerUp?: () => void;
  onClick?: (e: MouseEvent) => void;
};

export function useSceneEvents({
  onPointerMove,
  onPointerDown,
  onPointerUp,
  onClick,
}: SceneEventsParams) {
  useEffect(() => {
    if (onPointerMove) window.addEventListener("pointermove", onPointerMove);
    if (onPointerDown) window.addEventListener("pointerdown", onPointerDown);
    if (onPointerUp) window.addEventListener("pointerup", onPointerUp);
    if (onClick) window.addEventListener("click", onClick);

    return () => {
      if (onPointerMove)
        window.removeEventListener("pointermove", onPointerMove);
      if (onPointerDown)
        window.removeEventListener("pointerdown", onPointerDown);
      if (onPointerUp) window.removeEventListener("pointerup", onPointerUp);
      if (onClick) window.removeEventListener("click", onClick);
    };
  }, [onPointerMove, onPointerDown, onPointerUp, onClick]);
}
