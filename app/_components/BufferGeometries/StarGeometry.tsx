import * as THREE from "three";

export default function StarGeometry(
  radius = 0.9,
  innerRadius = 0.35,
  points = 5
) {
  const geometry = new THREE.BufferGeometry();
  const vertices: number[] = [];

  vertices.push(0, 0, 0);

  for (let i = 0; i < points * 2; i++) {
    const angle = (i * Math.PI) / points + Math.PI / 2;
    const isOuter = i % 2 === 0;
    const r = isOuter ? radius : innerRadius;

    const x = r * Math.cos(angle);
    const y = r * Math.sin(angle);

    vertices.push(x, y, 0);
  }

  const indices: number[] = [];
  for (let i = 1; i <= points * 2; i++) {
    indices.push(0, i, i === points * 2 ? 1 : i + 1);
  }

  geometry.setAttribute(
    "position",
    new THREE.BufferAttribute(new Float32Array(vertices), 3)
  );
  geometry.setIndex(new THREE.BufferAttribute(new Uint32Array(indices), 1));
  geometry.computeVertexNormals();
  geometry.rotateZ(0);

  return geometry;
}
