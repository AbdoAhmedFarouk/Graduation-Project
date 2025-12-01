import * as THREE from "three";
import { useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";

export default function ScreenGrid() {
  const ref = useRef<THREE.Mesh>(null!);
  const { camera } = useThree();

  useFrame(() => {
    if (!ref.current) return;

    const dir = new THREE.Vector3();
    camera.getWorldDirection(dir);
    ref.current.position.copy(camera.position).add(dir.multiplyScalar(5));

    ref.current.quaternion.copy(camera.quaternion);
  });

  return (
    <mesh ref={ref} name="gridPlane">
      <planeGeometry args={[50, 50]} />
      <meshBasicMaterial color="#999" wireframe opacity={0.4} transparent />
    </mesh>
  );
}
