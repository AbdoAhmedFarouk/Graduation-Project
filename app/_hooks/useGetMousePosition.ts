import * as THREE from "three";

import { useThree } from "@react-three/fiber";
import { useRef } from "react";

export const useGetMousePosition = () => {
  const { camera, gl } = useThree();
  const mouse = useRef(new THREE.Vector2()).current;
  const raycaster = useRef(new THREE.Raycaster()).current;

  const getPointerPosition = (e: MouseEvent) => {
    const rect = gl.domElement.getBoundingClientRect();

    mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);
  };

  return { mouse, getPointerPosition, raycaster };
};
