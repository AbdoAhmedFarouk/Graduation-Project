"use client";

import * as THREE from "three";
import { useRef, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Float, OrbitControls } from "@react-three/drei";

type GeometryType =
  | "box"
  | "sphere"
  | "cone"
  | "cylinder"
  | "torus"
  | "tetrahedron"
  | "octahedron"
  | "dodecahedron"
  | "icosahedron"
  | "torusKnot";

interface FloatingShapeProps {
  geometry: GeometryType;
  color: string;
  position: [number, number, number];
  size?: number;
  floatSpeed?: number;
}

function getGeometry(type: GeometryType, size = 1) {
  switch (type) {
    case "box":
      return new THREE.BoxGeometry(size, size, size);
    case "sphere":
      return new THREE.SphereGeometry(size * 0.8, 32, 32);
    case "cone":
      return new THREE.ConeGeometry(size * 0.7, size * 1.4, 32);
    case "cylinder":
      return new THREE.CylinderGeometry(size * 0.6, size * 0.6, size * 1.4, 32);
    case "torus":
      return new THREE.TorusGeometry(size * 0.7, size * 0.25, 16, 100);
    case "tetrahedron":
      return new THREE.TetrahedronGeometry(size * 0.9);
    case "octahedron":
      return new THREE.OctahedronGeometry(size * 0.9);
    case "dodecahedron":
      return new THREE.DodecahedronGeometry(size * 0.9);
    case "icosahedron":
      return new THREE.IcosahedronGeometry(size * 0.9);
    case "torusKnot":
      return new THREE.TorusKnotGeometry(size * 0.6, size * 0.2, 128, 32);
    default:
      return new THREE.BoxGeometry(size, size, size);
  }
}

function FloatingShape({
  geometry,
  color,
  position,
  size = 1,
  floatSpeed = 2,
}: FloatingShapeProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const mouse = useRef(new THREE.Vector2());

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      mouse.current.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.current.y = -(event.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  useFrame(() => {
    if (!meshRef.current) return;
    const targetRotX = mouse.current.y * 1;
    const targetRotY = mouse.current.x * 1;
    meshRef.current.rotation.x +=
      (targetRotX - meshRef.current.rotation.x) * 0.05;
    meshRef.current.rotation.y +=
      (targetRotY - meshRef.current.rotation.y) * 0.05;
  });

  return (
    <Float speed={floatSpeed} rotationIntensity={1.2} floatIntensity={1.5}>
      <mesh
        ref={meshRef}
        position={position}
        geometry={getGeometry(geometry, size)}
      >
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.9}
          metalness={0.7}
          roughness={0.2}
        />
      </mesh>
    </Float>
  );
}

const SceneBackground = () => {
  const { scene } = useThree();
  scene.background = new THREE.Color("black");

  return null;
};

export default function HomePageScene() {
  const geometries: GeometryType[] = [
    "box",
    "sphere",
    "cone",
    "cylinder",
    "torus",
    "tetrahedron",
    "octahedron",
    "dodecahedron",
    "icosahedron",
    "torusKnot",
  ];

  const colors = [
    "#00ffff",
    "#ff00ff",
    "#ffaa00",
    "#ffffff",
    "#00ffaa",
    "#ff8800",
    "#9d00ff",
    "#00aaff",
    "#ff5555",
    "#ff66cc",
    "#66ccff",
    "#00ffee",
    "#eeba2c",
  ];

  const shapes = Array.from({ length: 35 }, () => {
    const radius = 5 + Math.random() * 5;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);

    const x = radius * Math.sin(phi) * Math.cos(theta);
    const y = radius * Math.sin(phi) * Math.sin(theta);
    const z = radius * Math.cos(phi);

    const geometry = geometries[Math.floor(Math.random() * geometries.length)];
    const color = colors[Math.floor(Math.random() * colors.length)];
    const size = 0.8 + Math.random() * 0.8;
    const floatSpeed = 1 + Math.random() * 2;

    return {
      geometry,
      color,
      position: [x, y, z] as [number, number, number],
      size,
      floatSpeed,
    };
  });

  return (
    <Canvas gl={{ antialias: true }} camera={{ position: [0, 0, 5], fov: 45 }}>
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 5, 5]} intensity={1.4} />
      <directionalLight position={[-5, -5, -5]} intensity={1.2} />

      {shapes.map((shape, i) => (
        <FloatingShape key={i} {...shape} />
      ))}

      <OrbitControls enableZoom={false} />
      <SceneBackground />
    </Canvas>
  );
}
