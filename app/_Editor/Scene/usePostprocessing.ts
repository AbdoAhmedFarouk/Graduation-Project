// usePostprocessing.ts
import * as THREE from "three";
import { useEffect, useRef } from "react";
import { useThree, useFrame } from "@react-three/fiber";
import {
  EffectComposer,
  RenderPass,
  OutlinePass,
} from "three/examples/jsm/Addons.js";

type Params = {
  scene: THREE.Scene;
  hoveredObject: THREE.Object3D | null;
  selectedObject: THREE.Object3D | null;
};

export function usePostprocessing({
  scene,
  hoveredObject,
  selectedObject,
}: Params) {
  const { gl, camera, size } = useThree();

  const composer = useRef<EffectComposer | null>(null);
  const hoverPass = useRef<OutlinePass | null>(null);
  const selectionPass = useRef<OutlinePass | null>(null);

  useEffect(() => {
    const comp = new EffectComposer(gl);
    comp.addPass(new RenderPass(scene, camera));

    const hoverOutline = new OutlinePass(
      new THREE.Vector2(size.width, size.height),
      scene,
      camera,
    );
    hoverOutline.edgeStrength = 5;
    hoverOutline.visibleEdgeColor.set("#fff");

    const selectionOutline = new OutlinePass(
      new THREE.Vector2(size.width, size.height),
      scene,
      camera,
    );
    selectionOutline.edgeStrength = 100;
    selectionOutline.visibleEdgeColor.set("#fff");

    comp.addPass(hoverOutline);
    comp.addPass(selectionOutline);

    composer.current = comp;
    hoverPass.current = hoverOutline;
    selectionPass.current = selectionOutline;

    return () => {
      comp.dispose();
    };
  }, [scene, camera, gl, size]);

  useFrame(() => {
    composer.current?.render();
  }, 1);

  useEffect(() => {
    if (!hoverPass.current) return;

    hoverPass.current.selectedObjects =
      hoveredObject && hoveredObject !== selectedObject ? [hoveredObject] : [];
  }, [hoveredObject, selectedObject]);

  useEffect(() => {
    if (!selectionPass.current) return;

    selectionPass.current.selectedObjects = selectedObject
      ? [selectedObject]
      : [];
  }, [selectedObject]);
}
