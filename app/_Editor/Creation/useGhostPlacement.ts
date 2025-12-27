import * as THREE from "three";
import { useRef } from "react";
import { useSceneStore } from "@/app/_store/store";
import { useShallow } from "zustand/shallow";

type Params = {
  enabled: boolean;
  intersectPlane: (plane: THREE.Plane) => THREE.Vector3 | null;
};

export function useGhostPlacement({ enabled, intersectPlane }: Params) {
  const plane = useRef(new THREE.Plane(new THREE.Vector3(0, 0, 1), 0));

  const { desiredShape, setGhostPos } = useSceneStore(
    useShallow((s) => ({
      desiredShape: s.desiredShape,
      setGhostPos: s.setGhostPos,
    }))
  );

  const onPointerMove = () => {
    if (!enabled || !desiredShape) return;

    const point = intersectPlane(plane.current);
    if (point) setGhostPos(point);
  };

  return { onPointerMove };
}
