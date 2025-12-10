import { useThree } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import * as THREE from "three";
import { useShallow } from "zustand/shallow";

import { useGetMousePosition } from "@/app/_hooks/useGetMousePosition";
import { useSceneStore } from "@/app/_store/store";
import { GEOMETRIES_TYPE } from "@/app/_validators/sceneGeometries";
import GhostPlane from "./GhostPlane";

import {
  EffectComposer,
  OutlinePass,
  RenderPass,
} from "three/examples/jsm/Addons.js";

export default function Scene() {
  const {
    createMode,
    ghostPos,
    desiredShape,
    sceneObjects,
    hoveredObjectId,

    setScene,
    setHoveredObjectId,
    setSelectedGeometry,
    setGhostPos,
    setCreateMode,
    sceneObj,
    setSceneObjects,
  } = useSceneStore(
    useShallow((state) => ({
      sceneObjects: state.sceneObjects,
      hoveredObjectId: state.hoveredObjectId,
      createMode: state.createMode,
      ghostPos: state.ghostPos,
      desiredShape: state.desiredShape,

      sceneObj: state.sceneObj,
      setScene: state.setScene,
      setHoveredObjectId: state.setHoveredObjectId,
      setSelectedGeometry: state.setSelectedGeometry,
      setGhostPos: state.setGhostPos,
      setCreateMode: state.setCreateMode,
      setSceneObjects: state.setSceneObjects,
    }))
  );

  // add scene state in global to get it in the rightside bar

  const draggedObject = useRef<THREE.Mesh | null>(null);
  const isDragging = useRef(false);

  const { scene, gl, camera, size } = useThree();
  const { getPointerPosition, raycaster } = useGetMousePosition();

  const groundPlane = useRef(new THREE.Plane(new THREE.Vector3(0, 0, 1), 0));

  const composer = useRef<EffectComposer | null>(null);
  const outlinePass = useRef<OutlinePass | null>(null);

  useEffect(() => {
    setScene(scene);
  }, [scene, setScene]);

  useEffect(() => {
    gl.outputColorSpace = THREE.SRGBColorSpace;
    gl.toneMapping = THREE.ACESFilmicToneMapping;
    gl.toneMappingExposure = 1;
  }, [gl]);

  useEffect(() => {
    const comp = new EffectComposer(gl);
    comp.addPass(new RenderPass(scene, camera));

    const outline = new OutlinePass(
      new THREE.Vector2(size.width, size.height),
      scene,
      camera
    );

    outline.edgeStrength = 5;
    outline.edgeThickness = 2;
    outline.edgeGlow = 0.3;
    outline.visibleEdgeColor.set("#ffffff");
    outline.hiddenEdgeColor.set("#000000");

    comp.addPass(outline);

    composer.current = comp;
    outlinePass.current = outline;

    return () => comp.dispose();
  }, [scene, camera, gl, size]);

  useEffect(() => {
    gl.setAnimationLoop(() => composer.current?.render());
    return () => gl.setAnimationLoop(null);
  }, [gl]);

  useEffect(() => {
    if (!outlinePass.current) return;

    const mesh = sceneObjects.find((obj) => obj.uuid === hoveredObjectId);
    outlinePass.current.selectedObjects =
      mesh instanceof THREE.Mesh ? [mesh] : [];
  }, [hoveredObjectId, sceneObjects]);

  const getPlaneIntersection = (e: MouseEvent) => {
    getPointerPosition(e);
    const point = new THREE.Vector3();
    const hit = raycaster.ray.intersectPlane(groundPlane.current, point);
    return hit ? point.clone() : null;
  };

  const getSceneIntersection = (e: MouseEvent) => {
    getPointerPosition(e);
    const objects = scene.children;
    const hits = raycaster.intersectObjects(objects, true);
    return hits.length ? hits[0].object : null;
  };

  const onHover = (e: MouseEvent) => {
    if (!outlinePass.current || isDragging.current) return;

    const hit = getSceneIntersection(e);
    const currentHoveredId = hoveredObjectId;

    if (hit instanceof THREE.Mesh) {
      const hitId = hit.uuid;

      if (currentHoveredId !== hitId) {
        outlinePass.current.selectedObjects = [hit];
        setHoveredObjectId(hitId);
      }
    } else {
      if (currentHoveredId !== null) {
        outlinePass.current.selectedObjects = [];
        setHoveredObjectId(null);
      }
    }
  };

  const onPointerMove = (e: MouseEvent) => {
    if (!createMode || !desiredShape) return;

    const point = getPlaneIntersection(e);
    if (point) setGhostPos(point);
  };

  const onClick = () => {
    if (!createMode || !ghostPos || !desiredShape) return;

    const geometry = GEOMETRIES_TYPE[desiredShape]();
    const material = new THREE.MeshStandardMaterial({
      color: "#eeba2c",
      side: THREE.DoubleSide,
    });

    const mesh = new THREE.Mesh(geometry, material);
    mesh.userData.type = geometry.userData.type;
    mesh.position.copy(ghostPos);

    setSceneObjects(mesh);
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

    const {
      uuid,
      userData,
      material,
      position,
      scale,
      rotation,
      geometry,
      visible,
    } = hit;

    setSelectedGeometry({
      id: uuid,
      userData,
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

    const point = getPlaneIntersection(e);
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
    dom.addEventListener("mousemove", onHover);
    dom.addEventListener("click", onClick);
    dom.addEventListener("pointerdown", onPointerDown);
    dom.addEventListener("pointermove", onPointerMoveForDrag);
    dom.addEventListener("pointerup", onPointerUpForDrag);

    return () => {
      dom.removeEventListener("mousemove", onPointerMove);
      dom.removeEventListener("mousemove", onHover);
      dom.removeEventListener("click", onClick);
      dom.removeEventListener("pointerdown", onPointerDown);
      dom.removeEventListener("pointermove", onPointerMoveForDrag);
      dom.removeEventListener("pointerup", onPointerUpForDrag);
    };
  });

  return (
    <>
      {createMode && ghostPos && (
        <GhostPlane desiredShape={desiredShape} position={ghostPos} />
      )}
    </>
  );
}
