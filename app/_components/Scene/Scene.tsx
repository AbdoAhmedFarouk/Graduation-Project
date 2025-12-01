import * as THREE from "three";

import { useEffect, useRef } from "react";
import { useThree } from "@react-three/fiber";

import { useShallow } from "zustand/shallow";

import GhostPlane from "./GhostPlane";
import ScreenGrid from "./ScreenGrid";

import { useSceneStore } from "@/app/_store/store";
import { useGetMousePosition } from "@/app/_hooks/useGetMousePosition";

import { GEOMETRIES_TYPE } from "@/app/_validators/deisgnPageGeometries";

export default function Scene() {
  const {
    createMode,
    ghostPos,
    setSelectedObject,
    setGhostPos,
    setCreateMode,
    desiredShape,
  } = useSceneStore(
    useShallow((state) => ({
      createMode: state.createMode,
      ghostPos: state.ghostPos,
      desiredShape: state.desiredShape,
      setSelectedObject: state.setSelectedObject,
      setGhostPos: state.setGhostPos,
      setCreateMode: state.setCreateMode,
    }))
  );

  const draggedObject = useRef<THREE.Mesh | null>(null);
  const isDragging = useRef(false);

  const { scene, gl } = useThree();
  const { getPointerPosition, raycaster } = useGetMousePosition();

  const getGridIntersection = (e: MouseEvent) => {
    getPointerPosition(e);
    const gridPlane = scene.getObjectByName("gridPlane");
    if (!gridPlane) return null;

    const hits = raycaster.intersectObject(gridPlane);
    return hits.length ? hits[0].point : null;
  };

  const getSceneIntersection = (e: MouseEvent) => {
    getPointerPosition(e);

    const objects = scene.children.filter(
      (obj) => obj.name !== "gridPlane" && obj.name !== "ground"
    );

    const hits = raycaster.intersectObjects(objects, true);
    return hits.length ? hits[0].object : null;
  };

  const onPointerMove = (e: MouseEvent) => {
    if (!createMode || !desiredShape) return;

    const point = getGridIntersection(e);
    if (point) setGhostPos(point.clone());
  };

  const onClick = () => {
    if (!createMode || !ghostPos || !desiredShape) return;

    const mesh = new THREE.Mesh(
      GEOMETRIES_TYPE[desiredShape],
      new THREE.MeshStandardMaterial({
        color: "#eeba2c",
        side: THREE.DoubleSide,
      })
    );

    mesh.position.copy(ghostPos);
    scene.add(mesh);

    setGhostPos(null);
    setCreateMode(false);
  };

  const onPointerDown = (e: MouseEvent) => {
    if (createMode) return;

    const hit = getSceneIntersection(e);
    if (!(hit instanceof THREE.Mesh)) return;

    draggedObject.current = hit;
    isDragging.current = true;

    const { material, position, scale, rotation, geometry, visible } = hit;

    setSelectedObject({
      id: hit.uuid,
      material,
      position,
      scale,
      rotation,
      geometry,
      visible,
    });
  };

  const onPointerMoveForDrag = (e: MouseEvent) => {
    if (!isDragging.current || !draggedObject.current) return;

    const point = getGridIntersection(e);
    if (!point) return;

    draggedObject.current.position.x = point.x;
    draggedObject.current.position.y = point.y;
  };

  const onPointerUpForDrag = () => {
    isDragging.current = false;
    draggedObject.current = null;
  };

  useEffect(() => {
    const dom = gl.domElement;

    dom.addEventListener("mousemove", onPointerMove);
    dom.addEventListener("click", onClick);
    dom.addEventListener("pointerdown", onPointerDown);
    dom.addEventListener("pointermove", onPointerMoveForDrag);
    dom.addEventListener("pointerup", onPointerUpForDrag);

    return () => {
      dom.removeEventListener("mousemove", onPointerMove);
      dom.removeEventListener("click", onClick);
      dom.removeEventListener("pointerdown", onPointerDown);
      dom.removeEventListener("pointermove", onPointerMoveForDrag);
      dom.removeEventListener("pointerup", onPointerUpForDrag);
    };
  });

  return (
    <>
      <mesh name="ground" visible={false}>
        <planeGeometry args={[200, 200]} />
        <ScreenGrid />
        <meshBasicMaterial />
      </mesh>

      {createMode && ghostPos && (
        <GhostPlane desiredShape={desiredShape} position={ghostPos} />
      )}
    </>
  );
}
