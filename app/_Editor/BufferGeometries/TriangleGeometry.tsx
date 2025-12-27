import * as THREE from "three";

export default function TriangleGeometry() {
  const scale = 1.5;
  const geometry = new THREE.BufferGeometry();
  const vertices = new Float32Array([
    0,
    0.577 * scale,
    0,
    -0.5 * scale,
    -0.289 * scale,
    0,
    0.5 * scale,
    -0.289 * scale,
    0,
  ]);
  geometry.setAttribute("position", new THREE.BufferAttribute(vertices, 3));
  geometry.setIndex([0, 1, 2]);
  geometry.computeVertexNormals();
  geometry.center();

  return geometry;
}
