import * as THREE from "three";
import { useRef } from "react";
import { useThree } from "@react-three/fiber";
import { useSceneStore } from "@/app/_store/store";

export function useDragTransform({
  intersectPlane,
}: {
  intersectPlane: (p: THREE.Plane) => THREE.Vector3 | null;
}) {
  const { camera } = useThree();
  const setTransform = useSceneStore((s) => s.setGeometryTransformation);
  const resizeData = useRef<{
    anchor: THREE.Vector3;
    dir: string;
    startScale: THREE.Vector3;
    startSize: THREE.Vector3;
    startObjPos: THREE.Vector3;
  } | null>(null);
  const dragData = useRef<{
    object: THREE.Object3D;
    offset: THREE.Vector3;
  } | null>(null);
  const plane = useRef(new THREE.Plane(new THREE.Vector3(0, 0, 1), 0));

  const onPointerDown = (hit: THREE.Object3D | null) => {
    const { isResizing, resizeHandle, selectedGeometry } =
      useSceneStore.getState();

    if (isResizing && resizeHandle && selectedGeometry) {
      const box = new THREE.Box3().setFromObject(selectedGeometry);
      const dir = resizeHandle.userData.direction as string;
      const anchor = new THREE.Vector3();

      const cameraDir = new THREE.Vector3();
      camera.getWorldDirection(cameraDir);

      const planeNormal = cameraDir.negate();

      if (dir === "front" || dir === "back") {
        planeNormal.set(cameraDir.x, cameraDir.y, 0);
        if (planeNormal.lengthSq() < 0.001) {
          planeNormal.set(1, 0, 0);
        } else {
          planeNormal.normalize();
        }
      }

      plane.current.setFromNormalAndCoplanarPoint(
        planeNormal,
        resizeHandle.position,
      );

      anchor.x = dir.includes("left")
        ? box.max.x
        : dir.includes("right")
          ? box.min.x
          : selectedGeometry.position.x;
      anchor.y = dir.includes("bottom")
        ? box.max.y
        : dir.includes("top")
          ? box.min.y
          : selectedGeometry.position.y;
      anchor.z = dir.includes("front")
        ? box.min.z
        : dir.includes("back")
          ? box.max.z
          : selectedGeometry.position.z;

      const startSize = new THREE.Vector3();
      box.getSize(startSize);
      if (startSize.x === 0) startSize.x = 0.001;
      if (startSize.y === 0) startSize.y = 0.001;
      if (startSize.z === 0) startSize.z = 0.001;

      resizeData.current = {
        anchor,
        dir,
        startScale: selectedGeometry.scale.clone(),
        startSize,
        startObjPos: selectedGeometry.position.clone(),
      };
    } else if (hit) {
      const state = useSceneStore.getState();
      if (state.isTransformControlsActive) return;

      let objectToDrag = hit;
      if (state.selectedGeometry) {
        let curr: THREE.Object3D | null = hit;
        while (curr) {
          if (curr.uuid === state.selectedGeometry.uuid) {
            objectToDrag = state.selectedGeometry;
            break;
          }
          curr = curr.parent;
        }
      }

      let isAnyLocked = false;
      let currSearch: THREE.Object3D | null = objectToDrag;
      while (currSearch) {
        if (currSearch.userData.isLocked) {
          isAnyLocked = true;
          break;
        }
        currSearch = currSearch.parent;
      }
      if (isAnyLocked) return;

      const worldPos = new THREE.Vector3();
      objectToDrag.getWorldPosition(worldPos);

      plane.current.setFromNormalAndCoplanarPoint(
        new THREE.Vector3(0, 0, 1),
        worldPos,
      );

      const point = intersectPlane(plane.current);
      if (!point) return;

      const offset = new THREE.Vector3().subVectors(worldPos, point);
      dragData.current = {
        object: objectToDrag,
        offset: offset,
      };
    }
  };

  const onPointerMove = () => {
    const { isResizing, selectedGeometry } = useSceneStore.getState();

    if (isResizing && resizeData.current && selectedGeometry) {
      const point = intersectPlane(plane.current);
      if (!point) return;

      const { anchor, dir, startScale, startSize, startObjPos } =
        resizeData.current;
      const newScale = selectedGeometry.scale.clone();
      const newPos = selectedGeometry.position.clone();

      if (dir.includes("left") || dir.includes("right")) {
        const dist = dir.includes("right")
          ? point.x - anchor.x
          : anchor.x - point.x;
        let ratio = dist / startSize.x;
        if (Math.abs(ratio) < 0.01) ratio = ratio < 0 ? -0.01 : 0.01;
        newScale.x = startScale.x * ratio;
        newPos.x = anchor.x - (anchor.x - startObjPos.x) * ratio;
      }
      if (dir.includes("top") || dir.includes("bottom")) {
        const dist = dir.includes("top")
          ? point.y - anchor.y
          : anchor.y - point.y;
        let ratio = dist / startSize.y;
        if (Math.abs(ratio) < 0.01) ratio = ratio < 0 ? -0.01 : 0.01;
        newScale.y = startScale.y * ratio;
        newPos.y = anchor.y - (anchor.y - startObjPos.y) * ratio;
      }
      if (dir.includes("front") || dir.includes("back")) {
        const dist = dir.includes("front")
          ? point.z - anchor.z
          : anchor.z - point.z;
        let ratio = dist / startSize.z;
        if (Math.abs(ratio) < 0.01) ratio = ratio < 0 ? -0.01 : 0.01;
        newScale.z = startScale.z * ratio;
        newPos.z = anchor.z - (anchor.z - startObjPos.z) * ratio;
      }

      selectedGeometry.scale.copy(newScale);
      selectedGeometry.position.copy(newPos);
      setTransform({ scale: newScale, position: newPos });
    } else if (dragData.current) {
      const point = intersectPlane(plane.current);
      if (!point) return;

      const targetPos = point.clone().add(dragData.current.offset);
      dragData.current.object.position.set(
        targetPos.x,
        targetPos.y,
        dragData.current.object.position.z,
      );

      setTransform({
        position: {
          x: targetPos.x,
          y: targetPos.y,
          z: dragData.current.object.position.z,
        },
      });
    }
  };

  return {
    onPointerDown,
    onPointerMove,
    onPointerUp: () => {
      resizeData.current = null;
      dragData.current = null;
    },
  };
}
