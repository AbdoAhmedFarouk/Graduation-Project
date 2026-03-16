import * as THREE from "three";
import { useRef } from "react";
import { useSceneStore } from "@/app/_store/store";

type Params = {
  enabled: boolean;
  intersectPlane: (plane: THREE.Plane) => THREE.Vector3 | null;
};

export function useGhostPlacement({ enabled, intersectPlane }: Params) {
  const setGhostPos = useSceneStore((s) => s.setGhostPos);
  const plane = useRef(new THREE.Plane(new THREE.Vector3(0, 0, 1), 0));

  const onPointerMove = () => {
    const { desiredShape } = useSceneStore.getState();
    if (!enabled || !desiredShape) return;

    const point = intersectPlane(plane.current);
    if (point) setGhostPos(point);
  };

  return { onPointerMove };
}
