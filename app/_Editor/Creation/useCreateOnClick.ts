import * as THREE from "three";
import { useSceneStore } from "@/app/_store/store";
import { GEOMETRIES_TYPE } from "./sceneGeometries";
import { useShallow } from "zustand/shallow";

export function useCreateOnClick(scene: THREE.Scene) {
  const {
    createMode,
    ghostPos,
    desiredShape,
    setCreateMode,
    setGhostPos,
    setSceneObjects,
  } = useSceneStore(
    useShallow((s) => ({
      createMode: s.createMode,
      ghostPos: s.ghostPos,
      desiredShape: s.desiredShape,
      setCreateMode: s.setCreateMode,
      setGhostPos: s.setGhostPos,
      setSceneObjects: s.setSceneObjects,
    })),
  );

  const onClick = () => {
    if (!createMode || !ghostPos || !desiredShape) return;

    const geometry = GEOMETRIES_TYPE[desiredShape]();

    const material = new THREE.MeshBasicMaterial({
      color: "#eeba2c",
      side: THREE.DoubleSide,
    });

    const mesh = new THREE.Mesh(geometry, material);
    mesh.userData.type = geometry.userData.type;
    mesh.position.copy(ghostPos);
    // mesh.add(light);

    scene.add(mesh);
    setSceneObjects(mesh);

    setGhostPos(null);
    setCreateMode(false);
  };

  return { onClick };
}
