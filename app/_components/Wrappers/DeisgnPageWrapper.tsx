"use client";

import { OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";

import { useShallow } from "zustand/shallow";

import { useSceneStore } from "@/app/_store/store";
import { GEOMETRIES_TYPE } from "@/app/_Editor/Creation/sceneGeometries";
import MiddleBar from "../Panels/MiddleBar";
import SceneRoot from "@/app/_Editor/Scene/SceneRoot";

export default function DesignPageWrapper() {
  const {
    setLastSelected2D,
    setLastSelected3D,
    setCreateMode,
    setDesiredShape,
  } = useSceneStore(
    useShallow((state) => ({
      setLastSelected3D: state.setLastSelected3D,
      setLastSelected2D: state.setLastSelected2D,
      setCreateMode: state.setCreateMode,
      setDesiredShape: state.setDesiredShape,
    })),
  );

  const setIsTransformControlsActive = useSceneStore(
    (s) => s.setIsTransformControlsActive,
  );

  const handleCreateGeometry = (clickedShape: keyof typeof GEOMETRIES_TYPE) => {
    setIsTransformControlsActive(false);
    setDesiredShape(clickedShape);
    setCreateMode(true);

    const shapeIs2D = [
      "Rectangle",
      "Ellipse",
      "Triangle",
      "Polygon",
      "Star",
    ].includes(clickedShape);

    if (shapeIs2D) setLastSelected2D(clickedShape);
    else setLastSelected3D(clickedShape);
  };

  return (
    <>
      <div className="size-full">
        <Canvas shadows gl={{ antialias: true }}>
          <OrbitControls enableRotate={false} />

          <SceneRoot />
        </Canvas>
      </div>

      <MiddleBar onClick={handleCreateGeometry} />
    </>
  );
}
