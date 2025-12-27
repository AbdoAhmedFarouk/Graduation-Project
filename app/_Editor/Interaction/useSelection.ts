import * as THREE from "three";
import { useSceneStore } from "@/app/_store/store";

type Params = {
  intersectObjects: (objects: THREE.Object3D[]) => THREE.Intersection[];
  sceneObjects: THREE.Object3D[];
};

export function useSelection({ intersectObjects, sceneObjects }: Params) {
  const setSelectedGeometry = useSceneStore((s) => s.setSelectedGeometry);

  const onPointerDown = () => {
    const hits = intersectObjects(sceneObjects);
    const hit = hits[0]?.object;

    if (hit instanceof THREE.Mesh) {
      setSelectedGeometry(hit);
    }
  };

  return { onPointerDown };
}
