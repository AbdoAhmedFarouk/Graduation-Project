import * as THREE from "three";
import { useRef } from "react";
import { useSceneStore } from "@/app/_store/store";

type Params = {
  intersectObjects: (objects: THREE.Object3D[]) => THREE.Intersection[];
  sceneObjects: THREE.Object3D[];
};

export function useHoverDetection({ intersectObjects, sceneObjects }: Params) {
  const lastHovered = useRef<string | null>(null);
  const setHoveredObjectId = useSceneStore((s) => s.setHoveredObjectId);

  const onPointerMove = () => {
    const hits = intersectObjects(sceneObjects);
    const hit = hits[0]?.object;

    if (hit instanceof THREE.Mesh) {
      if (lastHovered.current !== hit.uuid) {
        lastHovered.current = hit.uuid;
        setHoveredObjectId(hit.uuid);
      }
    } else if (lastHovered.current) {
      lastHovered.current = null;
      setHoveredObjectId(null);
    }
  };

  return { onPointerMove };
}
