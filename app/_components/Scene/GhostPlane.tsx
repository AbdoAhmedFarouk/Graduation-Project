import * as THREE from "three";
import { forwardRef } from "react";

import { GEOMETRIES_TYPE } from "@/app/_validators/sceneGeometries";

type GhostPlaneProps = { position: THREE.Vector3; desiredShape: string };

const GhostPlane = forwardRef(
  ({ position, desiredShape }: GhostPlaneProps, ref) => {
    const geometry = GEOMETRIES_TYPE[desiredShape]?.();


    if (!geometry) return null;

    return (
      <mesh ref={ref} position={position} geometry={geometry}>
        <meshStandardMaterial
          color="#ffffff"
          opacity={0.4}
          transparent
          side={THREE.DoubleSide}
        />
      </mesh>
    );
  }
);

GhostPlane.displayName = "GhostPlane";

export default GhostPlane;
