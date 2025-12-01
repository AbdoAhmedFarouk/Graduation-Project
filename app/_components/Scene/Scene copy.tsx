import * as THREE from "three";

import { useThree } from "@react-three/fiber";
import { useEffect, useRef, useState } from "react";

import GhostPlane from "./GhostPlane";
import ScreenGrid from "./ScreenGrid";

import { useSceneStore } from "@/app/_store/store";
import { useGetMousePosition } from "@/app/_hooks/useGetMousePosition";
import { GEOMETRIES_TYPE } from "@/app/_validators/deisgnPageGeometries";

type SceneProps = {
  createMode: boolean;
  onPlaced: () => void;
  desiredShape: keyof typeof GEOMETRIES_TYPE | "";
};

export default function Scene({
  createMode,
  onPlaced,
  desiredShape,
}: SceneProps) {
  const [ghostPos, setGhostPos] = useState<THREE.Vector3 | null>(null); // make it global and all states too
  const { setSelectedObject } = useSceneStore((state) => state);

  const draggedObject = useRef<THREE.Mesh | null>(null);
  const isDragging = useRef(false);

  const { scene, gl } = useThree();

  const { getPointerPosition, raycaster } = useGetMousePosition();

  const onPointerMove = (e: MouseEvent) => {
    if (!createMode || !desiredShape) return;

    getPointerPosition(e);

    const gridPlane = scene.getObjectByName("gridPlane");
    const hit = raycaster.intersectObject(gridPlane!);

    if (hit.length) {
      const p = hit[0].point.clone();
      setGhostPos(p);
    }
  };

  const onClick = () => {
    if (!createMode || !ghostPos || !desiredShape) return;

    const geometry = new THREE.Mesh(
      GEOMETRIES_TYPE[desiredShape],
      new THREE.MeshStandardMaterial({
        color: "#eeba2c",
        side: THREE.DoubleSide,
      })
    );
    geometry.position.copy(ghostPos);
    scene.add(geometry);

    onPlaced();
  };

  const onSceneClick = (e: MouseEvent) => {
    if (createMode) return;

    getPointerPosition(e);

    const objects = scene.children.filter(
      (obj) => obj.name !== "gridPlane" && obj.name !== "ground"
    );

    const hits = raycaster.intersectObjects(objects);

    if (hits.length > 0) {
      const selectedGemoetry = hits[0].object;
      if (selectedGemoetry instanceof THREE.Mesh) {
        console.log("Selected object:", selectedGemoetry);

        draggedObject.current = selectedGemoetry;
        isDragging.current = true;

        const { material, position, scale, rotation, geometry, visible } =
          selectedGemoetry;

        setSelectedObject({
          id: selectedGemoetry.uuid,
          material,
          position,
          scale,
          rotation,
          geometry,
          visible,
        });
      } else {
        console.log(
          "selectedGemoetry object (no geometry):",
          selectedGemoetry.type
        );
      }
    }
  };

  const onPointerMoveForDrag = (e: MouseEvent) => {
    if (!isDragging.current || !draggedObject.current) return;

    getPointerPosition(e);

    const gridPlane = scene.getObjectByName("gridPlane");
    const hit = raycaster.intersectObject(gridPlane!);

    if (hit.length) {
      const p = hit[0].point;

      draggedObject.current.position.x = p.x;
      draggedObject.current.position.y = p.y;
    }
  };

  const onPointerUpForDrag = () => {
    isDragging.current = false;
    draggedObject.current = null;
  };

  useEffect(() => {
    gl.domElement.addEventListener("mousemove", onPointerMove);
    gl.domElement.addEventListener("click", onClick);
    gl.domElement.addEventListener("pointerdown", onSceneClick);

    gl.domElement.addEventListener("pointermove", onPointerMoveForDrag);
    gl.domElement.addEventListener("pointerup", onPointerUpForDrag);

    return () => {
      gl.domElement.removeEventListener("mousemove", onPointerMove);
      gl.domElement.removeEventListener("click", onClick);
      gl.domElement.removeEventListener("pointerdown", onSceneClick);

      gl.domElement.removeEventListener("pointermove", onPointerMoveForDrag);
      gl.domElement.removeEventListener("pointerup", onPointerUpForDrag);
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
