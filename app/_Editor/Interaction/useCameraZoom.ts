import { useSceneStore } from "@/app/_store/store";
import { useThree } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import { Vector3 } from "three";
import type { OrbitControls as OrbitControlsType } from "three-stdlib";

export function useCameraZoom() {
  const { camera, controls } = useThree();
  const setUpdateSceneZoom = useSceneStore((s) => s.setUpdateSceneZoom);

  const initialPositionRef = useRef<Vector3>(new Vector3());
  const targetPositionRef = useRef<Vector3>(new Vector3(0, 0, 0));
  const zoomLevelRef = useRef(100);

  const MIN_ZOOM = 0;
  const MAX_ZOOM = 500;
  const DEFAULT_ZOOM = 100;

  const MIN_DISTANCE = 0.1;
  const DEFAULT_DISTANCE = 5;
  const MAX_DISTANCE = 50;

  useEffect(() => {
    if (!camera) return;

    initialPositionRef.current.copy(camera.position);

    const orbitControls = controls as OrbitControlsType;
    if (orbitControls && orbitControls.target) {
      targetPositionRef.current.copy(orbitControls.target);
    }

    setUpdateSceneZoom(DEFAULT_ZOOM);

    const handleWheel = (e: WheelEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest("canvas")) return;

      e.preventDefault();
      e.stopPropagation();

      const zoomDelta = e.deltaY > 0 ? -10 : 10;

      zoomLevelRef.current = Math.max(
        MIN_ZOOM,
        Math.min(MAX_ZOOM, zoomLevelRef.current + zoomDelta),
      );

      applyCameraZoom(zoomLevelRef.current);

      setUpdateSceneZoom(zoomLevelRef.current);
    };

    const applyCameraZoom = (zoomPercent: number) => {
      if (!camera) return;

      let cameraDistance: number;

      if (zoomPercent >= DEFAULT_ZOOM) {
        const zoomRange = MAX_ZOOM - DEFAULT_ZOOM;
        const currentZoomIn = zoomPercent - DEFAULT_ZOOM;
        const t = currentZoomIn / zoomRange;

        cameraDistance =
          DEFAULT_DISTANCE * Math.pow(MIN_DISTANCE / DEFAULT_DISTANCE, t);
      } else {
        const zoomRange = DEFAULT_ZOOM - MIN_ZOOM;
        const currentZoomOut = DEFAULT_ZOOM - zoomPercent;
        const t = currentZoomOut / zoomRange;

        cameraDistance =
          DEFAULT_DISTANCE * Math.pow(MAX_DISTANCE / DEFAULT_DISTANCE, t);
      }

      const cameraDirection = new Vector3()
        .copy(camera.position)
        .sub(targetPositionRef.current)
        .normalize();

      const newPosition = new Vector3()
        .copy(targetPositionRef.current)
        .add(cameraDirection.multiplyScalar(cameraDistance));
      camera.position.copy(newPosition);
      camera.lookAt(targetPositionRef.current);
      const orbitControls = controls as OrbitControlsType;
      if (orbitControls) {
        orbitControls.target?.copy(targetPositionRef.current);
        orbitControls.update?.();
      }

      if (zoomPercent === MIN_ZOOM) {
        camera.far = 0.1;
      } else if (zoomPercent <= 20) {
        const visibility = zoomPercent / 20;
        camera.far = 0.1 + (1000 - 0.1) * visibility;
      } else {
        camera.far = 1000;
      }
      camera.updateProjectionMatrix();
    };

    window.addEventListener("wheel", handleWheel, {
      passive: false,
      capture: true,
    });

    return () => {
      window.removeEventListener("wheel", handleWheel, { capture: true });
    };
  }, [camera, controls, setUpdateSceneZoom]);
}
