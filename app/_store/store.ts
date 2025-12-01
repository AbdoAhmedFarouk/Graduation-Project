import * as THREE from "three";

import { create } from "zustand";
import { devtools } from "zustand/middleware";

import { GEOMETRIES_TYPE } from "../_validators/deisgnPageGeometries";

const initialState = {
  object: null,
  ghostPos: null,
  createMode: false,
  desiredShape: "",
  lastSelected2D: null,
  lastSelected3D: null,
};

type SelectedGeometryInfo = {
  id: string;
  geometry: THREE.BufferGeometry;
  material: THREE.Material;
  position: THREE.Vector3;
  rotation: THREE.Euler;
  scale: THREE.Vector3;
  visible: boolean;
};

type SceneState = {
  object: SelectedGeometryInfo | null;
  ghostPos: THREE.Vector3 | null;
  createMode: boolean;
  desiredShape: keyof typeof GEOMETRIES_TYPE | "";
  lastSelected2D: string | null;
  lastSelected3D: string | null;

  setSelectedObject: (obj: SelectedGeometryInfo) => void;
  setGhostPos: (pos: THREE.Vector3 | null) => void;
  setCreateMode: (state: boolean) => void;
  setDesiredShape: (shape: keyof typeof GEOMETRIES_TYPE | "") => void;
  setLastSelected2D: (shape: string) => void;
  setLastSelected3D: (shape: string) => void;
};

type MiddlebarState = {
  activeMenu: string | null;

  setActiveMenu: (id: string | null) => void;
};

export const useSceneStore = create<SceneState>()(
  devtools((set) => ({
    ...initialState,

    setSelectedObject: (obj) =>
      set((state) => ({
        object: state.object?.id !== obj.id ? obj : state.object,
      })),
    setGhostPos: (pos) => set({ ghostPos: pos }),
    setCreateMode: (state) => set({ createMode: state }),
    setDesiredShape: (shape) => set({ desiredShape: shape }),
    setLastSelected2D: (shape) => set({ lastSelected2D: shape }),
    setLastSelected3D: (shape) => set({ lastSelected3D: shape }),
  }))
);

export const useMiddlebarStore = create<MiddlebarState>()(
  devtools((set) => ({
    activeMenu: null,

    setActiveMenu: (condition) =>
      set(() => ({
        activeMenu: condition,
      })),
  }))
);
