import * as THREE from "three";
import { useRef } from "react";
import { useSceneStore } from "@/app/_store/store";

type Params = {
  intersectPlane: (
    plane: THREE.Plane,
    target?: THREE.Vector3,
  ) => THREE.Vector3 | null;
};

export function useDragTransform({ intersectPlane }: Params) {
  const setGeometryTransformation = useSceneStore(
    (s) => s.setGeometryTransformation,
  );

  const dragged = useRef<{
    object: THREE.Object3D;
    offset: THREE.Vector3;
  } | null>(null);
  const plane = useRef(new THREE.Plane(new THREE.Vector3(0, 0, 1), 0));

  const onPointerDown = (hit: THREE.Object3D | null) => {
    if (!hit) return;

    if (hit.userData.isLocked) return;

    const point = intersectPlane(plane.current);
    if (!point) return;

    const worldPos = new THREE.Vector3();
    hit.getWorldPosition(worldPos);

    const offset = new THREE.Vector3().subVectors(worldPos, point);
    dragged.current = {
      object: hit,
      offset: offset,
    };
  };

  const onPointerMove = () => {
    if (!dragged.current) return;

    const point = intersectPlane(plane.current);
    if (!point) return;

    const targetPos = point.clone().add(dragged.current.offset);
    dragged.current.object.position.set(
      targetPos.x,
      targetPos.y,
      dragged.current.object.position.z,
    );

    setGeometryTransformation({
      position: {
        x: targetPos.x,
        y: targetPos.y,
        z: dragged.current.object.position.z,
      },
    });
  };

  const onPointerUp = () => {
    dragged.current = null;
  };

  return { onPointerDown, onPointerMove, onPointerUp };
}
