"use client";

import { useThree } from "@react-three/fiber";
import { useEffect } from "react";
import { useShallow } from "zustand/shallow";

import { useSceneStore } from "@/app/_store/store";

import GhostPlane from "@/app/_Editor/Creation/GhostPlane";
import { useCreateOnClick } from "../Creation/useCreateOnClick";
import { useGhostPlacement } from "../Creation/useGhostPlacement";
import { useDragTransform } from "../Interaction/useDragTransform";
import { useHoverDetection } from "../Interaction/useHoverDetection";
import { useSelection } from "../Interaction/useSelection";
import { useRaycaster } from "../Raycasting/useRaycaster";
import { usePostprocessing } from "./usePostprocessing";
import { useSceneEvents } from "./useSceneEvents";
import { useCameraZoom } from "../Interaction/useCameraZoom";

export default function SceneRoot() {
  const { scene } = useThree();

  const {
    sceneObjects,
    createMode,
    ghostPos,
    desiredShape,
    hoveredObjectId,
    setScene,
  } = useSceneStore(
    useShallow((s) => ({
      sceneObjects: s.sceneObjects,
      createMode: s.createMode,
      ghostPos: s.ghostPos,
      desiredShape: s.desiredShape,
      hoveredObjectId: s.hoveredObjectId,
      setScene: s.setScene,
    }))
  );
  const create = useCreateOnClick(scene);

  useCameraZoom();

  useEffect(() => {
    setScene(scene);
  }, [scene, setScene]);

  usePostprocessing({ scene, sceneObjects, hoveredObjectId });

  const raycaster = useRaycaster();

  const hover = useHoverDetection({
    intersectObjects: raycaster.intersectObjects,
    sceneObjects,
  });

  const selection = useSelection({
    intersectObjects: raycaster.intersectObjects,
    sceneObjects,
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

      const hits = raycaster.intersectObjects(sceneObjects);
      selection.onPointerDown();
      drag.onPointerDown(hits[0]?.object ?? null);
    },

    onPointerUp: drag.onPointerUp,

    onClick: create.onClick,
  });

  return (
    <>
      {createMode && ghostPos && desiredShape && (
        <GhostPlane desiredShape={desiredShape} position={ghostPos} />
      )}
    </>
  );
}
