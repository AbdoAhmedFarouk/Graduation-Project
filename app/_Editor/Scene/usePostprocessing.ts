import * as THREE from "three";
import { useEffect, useRef } from "react";
import { useThree } from "@react-three/fiber";

import {
  EffectComposer,
  RenderPass,
  OutlinePass,
} from "three/examples/jsm/Addons.js";

type Params = {
  scene: THREE.Scene;
  sceneObjects: THREE.Object3D[];
  hoveredObjectId: string | null;
};

export function usePostprocessing({
  scene,
  sceneObjects,
  hoveredObjectId,
}: Params) {
  const { gl, camera, size } = useThree();

  const composer = useRef<EffectComposer | null>(null);
  const outlinePass = useRef<OutlinePass | null>(null);

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

    const mesh = sceneObjects.find((o) => o.uuid === hoveredObjectId);

    outlinePass.current.selectedObjects =
      mesh instanceof THREE.Mesh ? [mesh] : [];
  }, [hoveredObjectId, sceneObjects]);
}
