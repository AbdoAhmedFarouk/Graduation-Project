"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";

import { useShallow } from "zustand/shallow";

import MiddleBar from "../MiddleBar";
import Scene from "../Scene/Scene";

import { useSceneStore } from "@/app/_store/store";

import { GEOMETRIES_TYPE } from "@/app/_validators/deisgnPageGeometries";

// const AstronautModel = () => {
//   const gltf = useGLTF("/models/Astronaut-transformed.glb");
//   const modelRef = useRef<THREE.Object3D>(null!);

//   useEffect(() => {
//     if (!modelRef.current) return;

//     modelRef.current.traverse((obj) => {
//       if ((obj as THREE.Mesh).isMesh) {
//         const mesh = obj as THREE.Mesh;
//         mesh.castShadow = true;
//         mesh.receiveShadow = true;

//         mesh.material = new THREE.MeshStandardMaterial({
//           map: (mesh.material as THREE.MeshStandardMaterial).map,
//           metalness: 1,
//           roughness: 1,
//         });
//       }
//     });
//   }, []);

//   return <primitive ref={modelRef} object={gltf.scene} />;
// };

export default function DesignPageWrapper() {
  const {
    setLastSelected2D,
    setLastSelected3D,
    setCreateMode,
    setDesiredShape,
  } = useSceneStore(
    useShallow((state) => ({
      setLastSelected3D: state.setLastSelected3D,
      setLastSelected2D: state.setLastSelected2D,
      setCreateMode: state.setCreateMode,
      setDesiredShape: state.setDesiredShape,
    }))
  );

  const handleCreateGeometry = (clickedShape: keyof typeof GEOMETRIES_TYPE) => {
    setDesiredShape(clickedShape);
    setCreateMode(true);

    const shapeIs2D = [
      "Rectangle",
      "Ellipse",
      "Triangle",
      "Polygon",
      "Star",
    ].includes(clickedShape);

    if (shapeIs2D) setLastSelected2D(clickedShape);
    else setLastSelected3D(clickedShape);
  };

  return (
    <>
      <div className="size-full">
        <Canvas shadows gl={{ antialias: true }}>
          <ambientLight intensity={1} />
          <directionalLight position={[3, 3, 3]} intensity={0.5} />
          <OrbitControls enableRotate={false} />

          {/* <AstronautModel /> */}

          <Scene />
        </Canvas>
      </div>

      <MiddleBar onClick={handleCreateGeometry} />
    </>
  );
}
