"use client";

import * as THREE from "three";
import { useEffect, useRef } from "react";
import { TransformControls as TransformControlsImpl } from "three-stdlib";
import { useThree } from "@react-three/fiber";
import { TransformControls } from "@react-three/drei";
import { useSceneStore } from "@/app/_store/store";
import { useShallow } from "zustand/shallow";

import { useCreateOnClick } from "../Creation/useCreateOnClick";
import { useGhostPlacement } from "../Creation/useGhostPlacement";
import { useDragTransform } from "../Interaction/useDragTransform";
import { useHoverDetection } from "../Interaction/useHoverDetection";
import { useSelection } from "../Interaction/useSelection";
import { useRaycaster } from "../Raycasting/useRaycaster";
import { useSceneEvents } from "./useSceneEvents";
import { useCameraZoom } from "../Interaction/useCameraZoom";
import GhostPlane from "@/app/_Editor/Creation/GhostPlane";
import { useResizeHandles } from "../Interaction/useResizeHandles";

export default function SceneRoot() {
  const { scene, gl } = useThree();
  const {
    createMode,
    desiredShape,
    selectedGeometry,
    isTransformControlsActive,
    transformMode,
    sceneObjects,
  } = useSceneStore(
    useShallow((s) => ({
      createMode: s.createMode,
      desiredShape: s.desiredShape,
      selectedGeometry: s.selectedGeometry,
      isTransformControlsActive: s.isTransformControlsActive,
      transformMode: s.transformMode,
      sceneObjects: s.sceneObjects,
    })),
  );

  const setScene = useSceneStore((s) => s.setScene);
  const setGeometryTransformation = useSceneStore(
    (s) => s.setGeometryTransformation,
  );
  const setIsTransformControlsActive = useSceneStore(
    (s) => s.setIsTransformControlsActive,
  );
  const setIsResizing = useSceneStore((s) => s.setIsResizing);
  const setResizeHandle = useSceneStore((s) => s.setResizeHandle);

  const transformRef = useRef<TransformControlsImpl>(null);

  const create = useCreateOnClick(scene);
  useResizeHandles();
  useCameraZoom();

  useEffect(() => {
    setScene(scene);
  }, [scene, setScene]);

  const raycaster = useRaycaster();

  const hover = useHoverDetection({
    intersectObjects: raycaster.intersectObjects,
    sceneObjects: scene.children.filter((c) => {
      if (c.userData.isResizeHandle || c.userData.isHelper) return false;
      if (c.visible === false || c.userData.isVisible === false) return false;

      return sceneObjects.some((o) => o.uuid === c.uuid);
    }),
  });

  const selection = useSelection({
    domElement: gl.domElement,
    intersectObjects: raycaster.intersectObjects,
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

      const state = useSceneStore.getState();
      if (state.createMode) return;

      const allHits = raycaster.intersectObjects(scene.children);
      const resizeHit = allHits.find((h) => h.object.userData.isResizeHandle);

      if (resizeHit) {
        setIsResizing(true);
        setResizeHandle(resizeHit.object);
        drag.onPointerDown(resizeHit.object);
      } else {
        selection.onPointerDown(e as PointerEvent);

        const children = (state.sceneObj?.children ?? []) as THREE.Object3D[];
        const hits = raycaster.intersectObjects(children);
        drag.onPointerDown(hits[0]?.object ?? null);
      }
    },
    onPointerUp: () => {
      setIsResizing(false);
      drag.onPointerUp();
    },
    onClick: create.onClick,
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
    if (!selectedGeometry && transformRef.current) {
      transformRef.current.detach();
    }
  }, [selectedGeometry]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const state = useSceneStore.getState();
      const { selectedGeometry, isTransformControlsActive } = state;

      if (e.key.toLowerCase() === "c" && selectedGeometry) {
        setIsTransformControlsActive(!isTransformControlsActive);
      }

      if (e.key === "Delete" && selectedGeometry) {
        if (transformRef.current) {
          transformRef.current.detach();
        }
        useSceneStore.getState().setDeleteSelectedObject();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [
    setIsTransformControlsActive,
    selectedGeometry,
    isTransformControlsActive,
  ]);

  return (
    <>
      {createMode && desiredShape && <GhostPlane desiredShape={desiredShape} />}

      {selectedGeometry && isTransformControlsActive && (
        <TransformControls
          ref={transformRef}
          object={selectedGeometry}
          mode={transformMode}
          onChange={handleTransformChange}
        />
      )}
    </>
  );
}
