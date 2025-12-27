import * as THREE from "three";
import { useThree } from "@react-three/fiber";
import { useRef } from "react";

export function useRaycaster() {
  const { camera, gl } = useThree();

  const mouse = useRef(new THREE.Vector2()).current;
  const raycaster = useRef(new THREE.Raycaster()).current;

  const updateFromEvent = (e: MouseEvent) => {
    const rect = gl.domElement.getBoundingClientRect();

    mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);
  };

  const intersectObjects = (objects: THREE.Object3D[]) => {
    return raycaster.intersectObjects(objects, true);
  };

  const intersectPlane = (plane: THREE.Plane, target = new THREE.Vector3()) => {
    const hit = raycaster.ray.intersectPlane(plane, target);
    return hit ? target.clone() : null;
  };

  return {
    raycaster,
    updateFromEvent,
    intersectObjects,
    intersectPlane,
  };
}
