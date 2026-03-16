import * as THREE from "three";
import { forwardRef, useMemo } from "react";
import { GEOMETRIES_TYPE } from "@/app/_Editor/Creation/sceneGeometries";
import { useSceneStore } from "@/app/_store/store";

type GhostPlaneProps = { desiredShape: string };

const GhostPlane = forwardRef<THREE.Mesh, GhostPlaneProps>(
  ({ desiredShape }, ref) => {
    const ghostPos = useSceneStore((s) => s.ghostPos);

    const geometry = useMemo(() => {
      const geo = GEOMETRIES_TYPE[desiredShape]?.();
      if (geo) geo.center();
      return geo;
    }, [desiredShape]);

    if (!geometry || !ghostPos) return null;

    return (
      <mesh ref={ref} position={ghostPos} geometry={geometry}>
        <meshStandardMaterial
          color="#ffffff"
          opacity={0.4}
          transparent
          side={THREE.DoubleSide}
        />
      </mesh>
    );
  },
);

GhostPlane.displayName = "GhostPlane";

export default GhostPlane;
