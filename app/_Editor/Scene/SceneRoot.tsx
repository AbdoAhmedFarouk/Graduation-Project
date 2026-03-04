"use client";

import * as THREE from "three";
import { useEffect } from "react";
import { useThree } from "@react-three/fiber";
import { TransformControls } from "@react-three/drei";

import { useShallow } from "zustand/shallow";
import { useSceneStore } from "@/app/_store/store";

import { useCreateOnClick } from "../Creation/useCreateOnClick";
import { useGhostPlacement } from "../Creation/useGhostPlacement";
import { useDragTransform } from "../Interaction/useDragTransform";
import { useHoverDetection } from "../Interaction/useHoverDetection";
import { useSelection } from "../Interaction/useSelection";
import { useRaycaster } from "../Raycasting/useRaycaster";
import { usePostprocessing } from "./usePostprocessing";
import { useSceneEvents } from "./useSceneEvents";
import { useCameraZoom } from "../Interaction/useCameraZoom";

import GhostPlane from "@/app/_Editor/Creation/GhostPlane";

export default function SceneRoot() {
  const { scene, gl } = useThree();

  const {
    sceneObj,
    sceneObjects,
    createMode,
    ghostPos,
    desiredShape,
    hoveredObjectId,
    selectedGeometry,
    isTransformControlsActive,
    setIsTransformControlsActive,
    setScene,
    setGeometryTransformation,
  } = useSceneStore(
    useShallow((s) => ({
      sceneObj: s.sceneObj,
      sceneObjects: s.sceneObjects,
      createMode: s.createMode,
      ghostPos: s.ghostPos,
      desiredShape: s.desiredShape,
      hoveredObjectId: s.hoveredObjectId,
      selectedGeometry: s.selectedGeometry,
      isTransformControlsActive: s.isTransformControlsActive,
      setIsTransformControlsActive: s.setIsTransformControlsActive,
      setScene: s.setScene,
      setGeometryTransformation: s.setGeometryTransformation,
    })),
  );

  const create = useCreateOnClick(scene);

  useCameraZoom();

  useEffect(() => {
    setScene(scene);
  }, [scene, setScene]);

  const raycaster = useRaycaster();

  const hover = useHoverDetection({
    intersectObjects: raycaster.intersectObjects,
    sceneObjects: sceneObjects!,
  });

  const selection = useSelection({
    domElement: gl.domElement,
    intersectObjects: raycaster.intersectObjects,
    sceneObjects: sceneObj?.children ?? [],
  });

  const drag = useDragTransform({
    intersectPlane: raycaster.intersectPlane,
  });

  const ghost = useGhostPlacement({
    enabled: createMode,
    intersectPlane: raycaster.intersectPlane,
  });

  useSceneEvents({
    onPointerMove: (e) => {
      raycaster.updateFromEvent(e);
      drag.onPointerMove();
      ghost.onPointerMove();
      hover.onPointerMove();
    },
    onPointerDown: (e) => {
      raycaster.updateFromEvent(e);

      if (createMode) return;

      const children = (sceneObj?.children ?? []) as THREE.Object3D[];
      const hits = raycaster.intersectObjects(children);
      selection.onPointerDown(e as PointerEvent);
      drag.onPointerDown(hits[0]?.object ?? null);
    },
    onPointerUp: drag.onPointerUp,
    onClick: create.onClick,
  });

  const hoveredObject =
    sceneObjects.find((o) => o!.uuid === hoveredObjectId) ?? null;

  usePostprocessing({
    scene,
    hoveredObject,
    selectedObject: selectedGeometry,
  });

  const handleTransformChange = () => {
    if (!selectedGeometry) return;

    const { position, rotation, scale } = selectedGeometry;

    setGeometryTransformation({
      position: { x: position.x, y: position.y, z: position.z },
      rotation: { x: rotation.x, y: rotation.y, z: rotation.z },
      scale: { x: scale.x, y: scale.y, z: scale.z },
    });
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === "c" && selectedGeometry) {
        setIsTransformControlsActive(!isTransformControlsActive);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedGeometry, isTransformControlsActive]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      {createMode && ghostPos && desiredShape && (
        <GhostPlane desiredShape={desiredShape} position={ghostPos} />
      )}

      {selectedGeometry && isTransformControlsActive && (
        <TransformControls
          object={selectedGeometry}
          onChange={handleTransformChange}
        />
      )}
    </>
  );
}
