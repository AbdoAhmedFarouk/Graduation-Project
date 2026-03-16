import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";

const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath(
  "https://www.gstatic.com/draco/versioned/decoders/1.5.6/",
);

const loader = new GLTFLoader();
loader.setDRACOLoader(dracoLoader);

export const loadModelFromFile = async (file: File): Promise<THREE.Group> => {
  const url = URL.createObjectURL(file);

  try {
    const gltf = await loader.loadAsync(url);
    gltf.scene.name = file.name;

    return gltf.scene;
  } catch (error) {
    console.error("Error loading model from file:", error);
    throw error;
  } finally {
    URL.revokeObjectURL(url);
  }
};
