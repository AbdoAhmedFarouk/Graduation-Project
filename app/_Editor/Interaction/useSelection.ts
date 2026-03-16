"use client";

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
}: Omit<Params, "sceneObjects">) {
  const setSelectedGeometry = useSceneStore((s) => s.setSelectedGeometry);

  const onPointerDown = (event: PointerEvent) => {
    const {
      isTransformControlsActive,
      selectedGeometry,
      sceneObj,
      sceneObjects,
    } = useSceneStore.getState();

    if (event.target !== domElement || isTransformControlsActive) return;

    const objectsToIntersect = sceneObj
      ? (sceneObj.children as THREE.Object3D[])
      : [];

    const hits = intersectObjects(objectsToIntersect).filter((h) => {
      const obj = h.object as THREE.Object3D & { userData?: ObjectUserData };
      let current: THREE.Object3D | null = obj;
      while (current && current !== sceneObj) {
        if (current.visible === false || current.userData?.isVisible === false)
          return false;
        current = current.parent;
      }
      return true;
    });

    const hit = hits[0]?.object;

    if (hit) {
      let current: THREE.Object3D | null = hit;
      let found = false;

      while (current && current !== sceneObj) {
        if (sceneObjects.some((o) => o.uuid === current!.uuid)) {
          found = true;
          break;
        }
        current = current.parent;
      }

      const finalSelection = found ? current : null;

      if (finalSelection && selectedGeometry?.uuid !== finalSelection.uuid) {
        setSelectedGeometry(finalSelection as THREE.Mesh);
      } else if (!finalSelection && selectedGeometry) {
        setSelectedGeometry(null);
      }
      return;
    }

    setSelectedGeometry(null);
  };

  return { onPointerDown };
}
