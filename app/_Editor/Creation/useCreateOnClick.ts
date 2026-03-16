import * as THREE from "three";
import { useSceneStore } from "@/app/_store/store";
import { GEOMETRIES_TYPE } from "./sceneGeometries";

export function useCreateOnClick(scene: THREE.Scene) {
  const setCreateMode = useSceneStore((s) => s.setCreateMode);
  const setGhostPos = useSceneStore((s) => s.setGhostPos);
  const setAddObjectsToScene = useSceneStore((s) => s.setAddObjectsToScene);
  const setSelectedGeometry = useSceneStore((s) => s.setSelectedGeometry);
  const setIsTransformControlsActive = useSceneStore(
    (s) => s.setIsTransformControlsActive,
  );

  const onClick = () => {
    const { createMode, ghostPos, desiredShape, sceneObjects } =
      useSceneStore.getState();

    if (!createMode || !ghostPos || !desiredShape) return;

    const geometry = GEOMETRIES_TYPE[desiredShape]();
    geometry.center();

    const material = new THREE.MeshBasicMaterial({
      color: "#eeba2c",
      side: THREE.DoubleSide,
    });

    const mesh = new THREE.Mesh(geometry, material);

    const baseType = geometry.userData.type;
    const existingObjects = sceneObjects || [];
    let maxSuffix = -1;

    existingObjects.forEach((obj) => {
      const type = obj.userData?.type;
      if (type === baseType) {
        maxSuffix = Math.max(maxSuffix, 0);
      } else if (type && type.startsWith(baseType + " ")) {
        const numStr = type.substring(baseType.length + 1);
        const num = parseInt(numStr, 10);
        if (!isNaN(num)) {
          maxSuffix = Math.max(maxSuffix, num);
        }
      }
    });

    mesh.userData.type =
      maxSuffix === -1 ? baseType : `${baseType} ${maxSuffix + 1}`;

    mesh.position.copy(ghostPos);

    scene.add(mesh);
    setAddObjectsToScene(mesh);
    setSelectedGeometry(mesh);
    setIsTransformControlsActive(true);

    setGhostPos(null);
    setCreateMode(false);
  };

  return { onClick };
}
