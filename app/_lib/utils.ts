import * as THREE from "three";

import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getSingleMaterial = (
  mat: THREE.Material | THREE.Material[] | null | undefined
): THREE.Material | null => {
  return Array.isArray(mat) ? null : mat || null;
};

export const getMaterialFromObject = (
  obj: THREE.Object3D | null | undefined
): THREE.Material | null => {
  if (!obj) return null;
  let material: THREE.Material | null = null;
  obj.traverse((child) => {
    if (material) return;
    if (child instanceof THREE.Mesh && child.material) {
      material = getSingleMaterial(child.material);
    }
  });
  return material;
};
