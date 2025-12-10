import * as THREE from "three";

import { useEffect, useRef } from "react";
import { useThree } from "@react-three/fiber";

import { useShallow } from "zustand/shallow";

import GhostPlane from "./GhostPlane";
import ScreenGrid from "./ScreenGrid";

import { useSceneStore } from "@/app/_store/store";
import { useGetMousePosition } from "@/app/_hooks/useGetMousePosition";

import { GEOMETRIES_TYPE } from "@/app/_validators/sceneGeometries";

import { Grid } from "@react-three/drei";
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

    setHoveredObjectId,
    setSelectedGeometry,
    setGhostPos,
    setCreateMode,
    setSceneObjects,
  } = useSceneStore(
    useShallow((state) => ({
      sceneObjects: state.sceneObjects,
      hoveredObjectId: state.hoveredObjectId,
      createMode: state.createMode,
      ghostPos: state.ghostPos,
      desiredShape: state.desiredShape,

      setHoveredObjectId: state.setHoveredObjectId,
      setSelectedGeometry: state.setSelectedGeometry,
      setGhostPos: state.setGhostPos,
      setCreateMode: state.setCreateMode,
      setSceneObjects: state.setSceneObjects,
    }))
  );

  const draggedObject = useRef<THREE.Mesh | null>(null);
  const isDragging = useRef(false);

  const { scene, gl, camera, size } = useThree();
  const { getPointerPosition, raycaster } = useGetMousePosition();

  console.log(scene);

  const composer = useRef<EffectComposer | null>(null);
  const outlinePass = useRef<OutlinePass | null>(null);

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

    return () => {
      comp.dispose();
    };
  }, [scene, camera, gl, size]);

  useEffect(() => {
    const render = () => {
      composer.current?.render();
    };
    gl.setAnimationLoop(render);

    return () => {
      gl.setAnimationLoop(null);
    };
  }, [gl]);

  useEffect(() => {
    if (!outlinePass.current) return;

    const mesh = sceneObjects.find((obj) => obj.uuid === hoveredObjectId);

    if (mesh instanceof THREE.Mesh) {
      outlinePass.current.selectedObjects = [mesh];
    } else {
      outlinePass.current.selectedObjects = [];
    }
  }, [hoveredObjectId, sceneObjects]);

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

  const onHover = (e: MouseEvent) => {
    if (!outlinePass.current || isDragging.current) return;

    const hit = getSceneIntersection(e);

    if (hit instanceof THREE.Mesh) {
      outlinePass.current.selectedObjects = [hit];
      setHoveredObjectId(hit.uuid);
    } else {
      outlinePass.current.selectedObjects = [];
      setHoveredObjectId(null);
    }
  };

  const onPointerMove = (e: MouseEvent) => {
    if (!createMode || !desiredShape) return;

    const point = getGridIntersection(e);
    if (point) setGhostPos(point.clone());
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
      <mesh name="ground" visible={false}>
        <planeGeometry args={[200, 200]} />
        <ScreenGrid />
        <meshBasicMaterial />
        <Grid cellColor={0xffffff} cellThickness={1} cellSize={1} />
      </mesh>

      {createMode && ghostPos && (
        <GhostPlane desiredShape={desiredShape} position={ghostPos} />
      )}
    </>
  );
}
