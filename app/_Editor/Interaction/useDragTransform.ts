import * as THREE from "three";
import { useRef } from "react";
import { useSceneStore } from "@/app/_store/store";

type Params = {
  intersectPlane: (
    plane: THREE.Plane,
    target?: THREE.Vector3
  ) => THREE.Vector3 | null;
};

export function useDragTransform({ intersectPlane }: Params) {
  const dragged = useRef<THREE.Mesh | null>(null);
  const plane = useRef(new THREE.Plane(new THREE.Vector3(0, 0, 1), 0));

  const setGeometryTransformation = useSceneStore(
    (s) => s.setGeometryTransformation
  );

  const onPointerDown = (hit: THREE.Object3D | null) => {
    if (hit instanceof THREE.Mesh) {
      dragged.current = hit;
    }
  };

  const onPointerMove = () => {
    if (!dragged.current) return;

    const point = intersectPlane(plane.current);
    if (!point) return;

    dragged.current.position.set(point.x, point.y, dragged.current.position.z);

    setGeometryTransformation({
      position: {
        x: point.x,
        y: point.y,
        z: dragged.current.position.z,
      },
    });
  };

  const onPointerUp = () => {
    dragged.current = null;
  };

  return { onPointerDown, onPointerMove, onPointerUp };
}
