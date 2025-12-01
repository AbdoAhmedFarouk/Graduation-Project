import * as THREE from "three";

export default function PolygonGeometry(sides = 5, radius = 1) {
  const geometry = new THREE.BufferGeometry();
  const vertices: number[] = [];
  const indices: number[] = [];

  const step = (Math.PI * 2) / sides;

  vertices.push(0, 0, 0);

  for (let i = 0; i < sides; i++) {
    const angle = i * step;
    vertices.push(Math.cos(angle) * radius, Math.sin(angle) * radius, 0);
  }

  for (let i = 1; i <= sides; i++) {
    const next = i === sides ? 1 : i + 1;
    indices.push(0, i, next);
  }

  geometry.setAttribute(
    "position",
    new THREE.Float32BufferAttribute(vertices, 3)
  );
  geometry.setIndex(indices);
  geometry.computeVertexNormals();
  geometry.center();

  return geometry;
}
