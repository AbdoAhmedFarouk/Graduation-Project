import * as THREE from "three";
import { GEOMETRIES_TYPE } from "./sceneGeometries";

type CreateGeometryParams = {
  type: keyof typeof GEOMETRIES_TYPE;
  position?: THREE.Vector3;
  color?: string;
};

export function createGeometry({
  type,
  position,
  color = "#eeba2c",
}: CreateGeometryParams): THREE.Mesh {
  const geometry = GEOMETRIES_TYPE[type]();

  const material = new THREE.MeshBasicMaterial({
    color,
    side: THREE.DoubleSide,
  });

  const mesh = new THREE.Mesh(geometry, material);

  mesh.userData.type = geometry.userData.type;

  if (position) {
    mesh.position.copy(position);
  }

  return mesh;
}
