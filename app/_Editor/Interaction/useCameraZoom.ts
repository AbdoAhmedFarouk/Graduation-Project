// hooks/useSplineCameraZoom.ts
import { useSceneStore } from "@/app/_store/store";
import { useThree } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import { Vector3 } from "three";
import type { OrbitControls as OrbitControlsType } from "three-stdlib";

export function useCameraZoom() {
  const { camera, controls } = useThree();
  const updateSceneZoom = useSceneStore((s) => s.updateSceneZoom);

  const initialPositionRef = useRef<Vector3>(new Vector3());
  const targetPositionRef = useRef<Vector3>(new Vector3(0, 0, 0));
  const zoomLevelRef = useRef(100);

  // Spline zoom parameters
  const MIN_ZOOM = 0; // 0% = maximum distance
  const MAX_ZOOM = 500; // 500% = maximum zoom in
  const DEFAULT_ZOOM = 100; // 100% = default view

  // Camera distance range (Spline-style)
  const MIN_DISTANCE = 0.1; // Minimum distance at max zoom (500%)
  const DEFAULT_DISTANCE = 5; // Default distance at 100%
  const MAX_DISTANCE = 50; // Maximum distance at min zoom (0%)

  useEffect(() => {
    if (!camera) return;

    // Store initial camera position
    initialPositionRef.current.copy(camera.position);

    // Store target (scene center) - Type assertion for controls
    const orbitControls = controls as OrbitControlsType;
    if (orbitControls && orbitControls.target) {
      targetPositionRef.current.copy(orbitControls.target);
    }

    // Set initial zoom to 100%
    updateSceneZoom(DEFAULT_ZOOM);

    const handleWheel = (e: WheelEvent) => {
      // Only zoom on canvas
      const target = e.target as HTMLElement;
      if (!target.closest("canvas")) return;

      e.preventDefault();
      e.stopPropagation();

      // Determine zoom direction
      const zoomDelta = e.deltaY > 0 ? -10 : 10; // Scroll down = zoom out, up = zoom in

      // Update zoom level with bounds
      zoomLevelRef.current = Math.max(
        MIN_ZOOM,
        Math.min(MAX_ZOOM, zoomLevelRef.current + zoomDelta)
      );

      // Apply Spline-style zoom to camera
      applySplineZoom(zoomLevelRef.current);

      // Update store
      updateSceneZoom(zoomLevelRef.current);
    };

    const applySplineZoom = (zoomPercent: number) => {
      if (!camera) return;

      // Convert zoom percentage to camera distance (Spline formula)
      let cameraDistance: number;

      if (zoomPercent >= DEFAULT_ZOOM) {
        // Zooming IN (100% to 500%)
        // Map 100-500% to DEFAULT_DISTANCE to MIN_DISTANCE (logarithmic)
        const zoomRange = MAX_ZOOM - DEFAULT_ZOOM;
        const currentZoomIn = zoomPercent - DEFAULT_ZOOM;
        const t = currentZoomIn / zoomRange;

        // Exponential curve for smooth zoom in
        cameraDistance =
          DEFAULT_DISTANCE * Math.pow(MIN_DISTANCE / DEFAULT_DISTANCE, t);
      } else {
        // Zooming OUT (0% to 100%)
        // Map 0-100% to MAX_DISTANCE to DEFAULT_DISTANCE (logarithmic)
        const zoomRange = DEFAULT_ZOOM - MIN_ZOOM;
        const currentZoomOut = DEFAULT_ZOOM - zoomPercent;
        const t = currentZoomOut / zoomRange;

        // Exponential curve for smooth zoom out
        cameraDistance =
          DEFAULT_DISTANCE * Math.pow(MAX_DISTANCE / DEFAULT_DISTANCE, t);
      }

      // Get direction from target to camera
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

    // Add event listener with higher priority
    window.addEventListener("wheel", handleWheel, {
      passive: false,
      capture: true,
    });

    return () => {
      window.removeEventListener("wheel", handleWheel, { capture: true });
    };
  }, [camera, controls, updateSceneZoom]);
}
