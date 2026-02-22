import * as THREE from "three";
import { useThree } from "@react-three/fiber";
import { useMemo } from "react";

export function useRaycaster() {
  const { camera, gl } = useThree();

  const raycaster = useMemo(() => new THREE.Raycaster(), []);
  const mouse = useMemo(() => new THREE.Vector2(), []);

  function updateFromEvent(e: PointerEvent) {
    const rect = gl.domElement.getBoundingClientRect();

    mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);
  }

  function intersectObjects(objects: THREE.Object3D[]) {
    return raycaster.intersectObjects(objects, true);
  }

  function intersectPlane(plane: THREE.Plane) {
    const point = new THREE.Vector3();
    raycaster.ray.intersectPlane(plane, point);
    return point;
  }

  return {
    updateFromEvent,
    intersectObjects,
    intersectPlane,
  };
}
