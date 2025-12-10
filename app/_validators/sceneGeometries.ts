import * as THREE from "three";

import HelixGeometry from "../_components/BufferGeometries/HelixGeometry";
import PolygonGeometry from "../_components/BufferGeometries/PolygonGeometry";
import StarGeometry from "../_components/BufferGeometries/StarGeometry";
import TriangleGeometry from "../_components/BufferGeometries/TriangleGeometry";

import {
  Box,
  Circle,
  Cone,
  Cylinder,
  Gem,
  Hexagon,
  Pentagon,
  Pyramid,
  Shell,
  Square,
  Star,
  Tangent,
  Torus,
  Triangle,
} from "lucide-react";

const GEOMETRY_FACTORIES = {
  Rectangle: () => new THREE.PlaneGeometry(1.2, 1.2),
  Ellipse: () => new THREE.CircleGeometry(0.6, 128),
  Cube: () => new THREE.BoxGeometry(1, 1, 1),
  Sphere: () => new THREE.SphereGeometry(0.5, 32, 32),
  Cylinder: () => new THREE.CylinderGeometry(0.4, 0.4, 1, 32),
  Torus: () => new THREE.TorusGeometry(0.5, 0.2, 16, 100),
  Cone: () => new THREE.ConeGeometry(0.5, 1, 32),
  Pyramid: () => new THREE.ConeGeometry(0.6, 1, 3),
  Icosahedron: () => new THREE.IcosahedronGeometry(0.6),
  Dodecahedron: () => new THREE.DodecahedronGeometry(0.6),
  TorusKnot: () => new THREE.TorusKnotGeometry(0.4, 0.15, 100, 16),
  Helix: HelixGeometry,
  Triangle: TriangleGeometry,
  Polygon: PolygonGeometry,
  Star: StarGeometry,
} as const;

export const GEOMETRIES_TYPE: Record<string, () => THREE.BufferGeometry> =
  Object.fromEntries(
    Object.entries(GEOMETRY_FACTORIES).map(([name, factory]) => {
      return [
        name,
        () => {
          const geometry = factory();
          geometry.userData.type = name;
          return geometry;
        },
      ];
    })
  );

export const GEOMETRIES_2D = [
  { geometry: "Rectangle", icon: Square },
  { geometry: "Ellipse", icon: Circle },
  { geometry: "Triangle", icon: Triangle },
  { geometry: "Polygon", icon: Pentagon },
  { geometry: "Star", icon: Star },
];

export const GEOMETRIES_3D = [
  { geometry: "Cube", icon: Box },
  { geometry: "Sphere", icon: Circle },
  { geometry: "Cylinder", icon: Cylinder },
  { geometry: "Torus", icon: Torus },
  { geometry: "Helix", icon: Shell },
  { geometry: "Cone", icon: Cone },
  { geometry: "Pyramid", icon: Pyramid },
  { geometry: "Icosahedron", icon: Gem },
  { geometry: "Dodecahedron", icon: Hexagon },
  { geometry: "TorusKnot", icon: Tangent },
];
