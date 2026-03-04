import * as THREE from "three";
import { useSceneStore } from "@/app/_store/store";

type Params = {
  domElement: HTMLElement;
  intersectObjects: (objects: THREE.Object3D[]) => THREE.Intersection[];
  sceneObjects: THREE.Object3D[];
};

type ObjectUserData = {
  isVisible?: boolean;
  isLocked?: boolean;
  type?: string;
  [key: string]: unknown;
};

export function useSelection({
  domElement,
  intersectObjects,
  sceneObjects,
}: Params) {
  const selectedGeometry = useSceneStore((s) => s.selectedGeometry);
  const setSelectedGeometry = useSceneStore((s) => s.setSelectedGeometry);
  const isTransforming = useSceneStore((s) => s.isTransformControlsActive);

  const onPointerDown = (event: PointerEvent) => {
    if (event.target !== domElement || isTransforming) return;

    const hits = intersectObjects(sceneObjects).filter((h) => {
      const obj = h.object as THREE.Object3D & { userData?: ObjectUserData };
      return obj.visible && obj.userData?.isVisible !== false;
    });

    const hit = hits[0]?.object;

    if (hit instanceof THREE.Mesh) {
      if (selectedGeometry?.uuid !== hit.uuid) {
        setSelectedGeometry(hit);
      }
      return;
    }

    setSelectedGeometry(null);
  };

  return { onPointerDown };
}
