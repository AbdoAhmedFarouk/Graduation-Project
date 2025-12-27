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
