import * as THREE from "three";

export default function HelixGeometry(turns = 2, height = 0.8, radius = 0.5) {
  const points: THREE.Vector3[] = [];
  const segments = 500;

  for (let i = 0; i <= segments; i++) {
    const t = (i / segments) * Math.PI * 2 * turns;
    const x = Math.cos(t) * radius;
    const y = (i / segments) * height;
    const z = Math.sin(t) * radius;
    points.push(new THREE.Vector3(x, y, z));
  }

  return new THREE.TubeGeometry(
    new THREE.CatmullRomCurve3(points),
    200,
    0.12,
    8
  );
}
