import * as THREE from "three";
import { useSceneStore } from "@/app/_store/store";
import { useEffect } from "react";

export function useSceneBootstrap(scene: THREE.Scene) {
  const setScene = useSceneStore((s) => s.setScene);

  useEffect(() => {
    setScene(scene);
  }, [scene, setScene]);
}
