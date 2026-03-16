"use client";

import * as THREE from "three";
import { useRef, useEffect } from "react";
import { useSceneStore } from "@/app/_store/store";
import { useThree, useFrame } from "@react-three/fiber";

type Params = {
  intersectObjects: (objects: THREE.Object3D[]) => THREE.Intersection[];
  sceneObjects: THREE.Object3D[];
};

type ObjectUserData = {
  isVisible?: boolean;
  isLocked?: boolean;
  type?: string;
  [key: string]: unknown;
};

const _box = new THREE.Box3();
const _center = new THREE.Vector3();
const _size = new THREE.Vector3();

export function useHoverDetection({ intersectObjects, sceneObjects }: Params) {
  const { scene } = useThree();
  const borderRef = useRef<THREE.LineSegments | null>(null);

  useEffect(() => {
    const borderGeo = new THREE.EdgesGeometry(new THREE.BoxGeometry(1, 1, 1));
    const borderMat = new THREE.LineBasicMaterial({
      color: "#005bb5",
      depthTest: false,
      transparent: true,
      opacity: 0.8,
      linewidth: 2,
    });
    const border = new THREE.LineSegments(borderGeo, borderMat);
    border.renderOrder = 998;
    border.raycast = () => {};
    border.visible = false;
    scene.add(border);
    borderRef.current = border;

    return () => {
      scene.remove(border);
      borderGeo.dispose();
      borderMat.dispose();
    };
  }, [scene]);

  const onPointerMove = () => {
    const state = useSceneStore.getState();
    const hits = intersectObjects(sceneObjects).filter((h) => {
      const obj = h.object as THREE.Object3D & { userData?: ObjectUserData };
      if (obj.visible === false) return false;
      if (obj.userData && obj.userData.isVisible === false) return false;
      return true;
    });

    const hit = hits[0]?.object;

    if (hit) {
      let current: THREE.Object3D | null = hit;
      let found = false;

      while (current && current !== scene) {
        if (state.sceneObjects.some((o) => o.uuid === current!.uuid)) {
          found = true;
          break;
        }
        current = current.parent;
      }

      const targetId = found ? current?.uuid || null : null;
      if (state.hoveredObjectId !== targetId) {
        state.setHoveredObjectId(targetId);
      }
    } else {
      if (state.hoveredObjectId) {
        state.setHoveredObjectId(null);
      }
    }
  };

  useFrame(() => {
    const state = useSceneStore.getState();
    const hoveredObjectId = state.hoveredObjectId;
    const selectedGeometry = state.selectedGeometry;

    if (!borderRef.current || !hoveredObjectId) {
      if (borderRef.current) borderRef.current.visible = false;
      return;
    }

    const hoveredObject = sceneObjects?.find(
      (o) => o?.uuid === hoveredObjectId,
    );

    if (!hoveredObject || hoveredObject.uuid === selectedGeometry?.uuid) {
      borderRef.current.visible = false;
      return;
    }

    _box.setFromObject(hoveredObject);
    _box.getCenter(_center);
    _box.getSize(_size);

    borderRef.current.position.copy(_center);
    borderRef.current.scale.set(
      Math.max(_size.x, 0.001),
      Math.max(_size.y, 0.001),
      Math.max(_size.z, 0.001),
    );
    borderRef.current.visible = true;
  });

  return { onPointerMove };
}
