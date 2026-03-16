import * as THREE from "three";
import { useEffect, useRef } from "react";
import { useThree, useFrame } from "@react-three/fiber";
import { useSceneStore } from "@/app/_store/store";
import { GEOMETRIES_2D } from "../Creation/sceneGeometries";

export function useResizeHandles() {
  const { scene, camera } = useThree();
  const selectedGeometry = useSceneStore((s) => s.selectedGeometry);
  const handlesRef = useRef<THREE.Mesh[]>([]);
  const borderRef = useRef<THREE.LineSegments | null>(null);

  useEffect(() => {
    if (!selectedGeometry) return;

    const is2D = GEOMETRIES_2D.some((g) =>
      selectedGeometry.userData.type?.startsWith(g.geometry),
    );
    const handleCount = is2D ? 4 : 13;

    const vertexGeo = new THREE.SphereGeometry(0.04, 16, 16);
    const boxGeo = new THREE.BoxGeometry(0.06, 0.06, 0.06);

    for (let i = 0; i < handleCount; i++) {
      const isVertex = is2D ? i < 4 : i < 8;
      const mat = new THREE.MeshBasicMaterial({
        color: isVertex ? "#aaaaaa" : "#666666",
        depthTest: false,
        transparent: true,
        opacity: 0.8,
      });
      const handle = new THREE.Mesh(isVertex ? vertexGeo : boxGeo, mat);
      handle.userData.isResizeHandle = true;
      handle.renderOrder = 1000;
      scene.add(handle);
      handlesRef.current.push(handle);
    }

    const borderGeo = new THREE.EdgesGeometry(new THREE.BoxGeometry(1, 1, 1));
    const borderMat = new THREE.LineBasicMaterial({
      color: 0x666666,
      depthTest: false,
      transparent: true,
      opacity: 1,
    });
    const border = new THREE.LineSegments(borderGeo, borderMat);
    border.renderOrder = 999;
    border.raycast = () => {};
    scene.add(border);
    borderRef.current = border;

    return () => {
      handlesRef.current.forEach((h) => scene.remove(h));
      handlesRef.current = [];
      if (borderRef.current) {
        scene.remove(borderRef.current);
        borderRef.current = null;
      }
    };
  }, [selectedGeometry, scene]);

  useFrame(() => {
    if (!selectedGeometry || handlesRef.current.length === 0) return;

    const box = new THREE.Box3().setFromObject(selectedGeometry);
    const center = new THREE.Vector3();
    box.getCenter(center);
    const size = new THREE.Vector3();
    box.getSize(size);

    if (borderRef.current) {
      borderRef.current.position.copy(center);
      borderRef.current.scale.set(
        Math.max(size.x, 0.001),
        Math.max(size.y, 0.001),
        Math.max(size.z, 0.001),
      );
    }

    const is2D = handlesRef.current.length === 4;

    let configs;
    if (is2D) {
      configs = [
        { pos: [box.min.x, box.max.y, center.z], dir: "top-left" },
        { pos: [box.max.x, box.max.y, center.z], dir: "top-right" },
        { pos: [box.min.x, box.min.y, center.z], dir: "bottom-left" },
        { pos: [box.max.x, box.min.y, center.z], dir: "bottom-right" },
      ];
    } else {
      configs = [
        { pos: [box.min.x, box.max.y, box.max.z], dir: "top-left-front" },
        { pos: [box.max.x, box.max.y, box.max.z], dir: "top-right-front" },
        { pos: [box.min.x, box.min.y, box.max.z], dir: "bottom-left-front" },
        { pos: [box.max.x, box.min.y, box.max.z], dir: "bottom-right-front" },
        { pos: [box.min.x, box.max.y, box.min.z], dir: "top-left-back" },
        { pos: [box.max.x, box.max.y, box.min.z], dir: "top-right-back" },
        { pos: [box.min.x, box.min.y, box.min.z], dir: "bottom-left-back" },
        { pos: [box.max.x, box.min.y, box.min.z], dir: "bottom-right-back" },
        { pos: [center.x, center.y, box.max.z], dir: "front" },
        { pos: [box.max.x, center.y, center.z], dir: "right" },
        { pos: [box.min.x, center.y, center.z], dir: "left" },
        { pos: [center.x, box.max.y, center.z], dir: "top" },
        { pos: [center.x, box.min.y, center.z], dir: "bottom" },
      ];
    }

    handlesRef.current.forEach((h, i) => {
      const config = configs[i];
      if (config) {
        h.position.set(config.pos[0], config.pos[1], config.pos[2]);
        h.userData.direction = config.dir;
        const dist = camera.position.distanceTo(h.position);
        h.scale.setScalar(dist * 0.2);
        h.visible = true;
      } else {
        h.visible = false;
      }
    });
  });
}
