import * as THREE from "three";

import StarGeometry from "../_components/BufferGeometries/StarGeometry";
import PolygonGeometry from "../_components/BufferGeometries/PolygonGeometry";
import HelixGeometry from "../_components/BufferGeometries/HelixGeometry";

export const GEOMETRIES_TYPE: Record<string, THREE.BufferGeometry> = {
  Rectangle: (() => new THREE.PlaneGeometry(1.2, 1.2))(),
  Ellipse: (() => new THREE.CircleGeometry(0.6, 128))(),
  Triangle: (() => {
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
  })(),
  Polygon: PolygonGeometry(5, 0.7),
  Star: StarGeometry(),
  Cube: (() => new THREE.BoxGeometry(1, 1, 1))(),
  Sphere: (() => new THREE.SphereGeometry(0.5, 32, 32))(),
  Cylinder: (() => new THREE.CylinderGeometry(0.4, 0.4, 1, 32))(),
  Torus: (() => new THREE.TorusGeometry(0.5, 0.2, 16, 100))(),
  Cone: (() => new THREE.ConeGeometry(0.5, 1, 32))(),
  Helix: HelixGeometry(),
  Pyramid: (() => new THREE.ConeGeometry(0.6, 1, 3))(),
  Icosahedron: (() => new THREE.IcosahedronGeometry(0.6))(),
  Dodecahedron: (() => new THREE.DodecahedronGeometry(0.6))(),
  TorusKnot: (() => new THREE.TorusKnotGeometry(0.4, 0.15, 100, 16))(),
};
