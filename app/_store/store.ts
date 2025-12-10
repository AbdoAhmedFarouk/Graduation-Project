import * as THREE from "three";

import { create } from "zustand";
import { devtools } from "zustand/middleware";

import { GEOMETRIES_TYPE } from "../_validators/sceneGeometries";

const initialState = {
  selectedGeometry: null,
  ghostPos: null,
  createMode: false,
  desiredShape: "",
  lastSelected2D: null,
  lastSelected3D: null,
  sceneObjects: [],
  hoveredObjectId: null,
  sceneObj: null,
  sceneBg: "262626",
};

type SelectedGeometryInfo = {
  id: string;
  geometry: THREE.BufferGeometry;
  material: THREE.Material;
  position: THREE.Vector3;
  rotation: THREE.Euler;
  scale: THREE.Vector3;
  visible: boolean;
  userData: Record<string, string>;
};

type SceneObjects = THREE.Mesh<
  THREE.BufferGeometry<
    THREE.NormalBufferAttributes,
    THREE.BufferGeometryEventMap
  >,
  THREE.Material,
  THREE.Object3DEventMap
>;

type SceneState = {
  sceneObj: THREE.Scene | null;
  sceneObjects: SceneObjects[];
  selectedGeometry: SelectedGeometryInfo | null;
  ghostPos: THREE.Vector3 | null;
  createMode: boolean;
  desiredShape: keyof typeof GEOMETRIES_TYPE | "";
  lastSelected2D: string | null;
  lastSelected3D: string | null;
  hoveredObjectId: string | null;
  sceneBg: string;

  setScene: (scene: THREE.Scene) => void;
  setSceneObjects: (obj: SceneObjects) => void;
  setSelectedGeometry: (obj: SelectedGeometryInfo) => void;
  setGhostPos: (pos: THREE.Vector3 | null) => void;
  setCreateMode: (state: boolean) => void;
  setDesiredShape: (shape: keyof typeof GEOMETRIES_TYPE | "") => void;
  setLastSelected2D: (shape: string) => void;
  setLastSelected3D: (shape: string) => void;
  setHoveredObjectId: (id: string | null) => void;
  setUpdateObjectName: (id: string, name: string) => void;

  // setGeometryColor: ({ r, g, b }: { r: number; g: number; b: number }) => void;
  setSceneBg: (color: string) => void;
};

type MiddlebarState = {
  activeMenu: string | null;

  setActiveMenu: (id: string | null) => void;
};

export const useSceneStore = create<SceneState>()(
  devtools((set) => ({
    ...initialState,

    setScene: (sceneObj) => set({ sceneObj }),

    setSceneBg: (color) => set({ sceneBg: color }),

    setSceneObjects: (obj) =>
      set((state) => ({
        sceneObjects: [obj, ...state.sceneObjects],
      })),

    setSelectedGeometry: (obj) =>
      set((state) => ({
        selectedGeometry:
          state.selectedGeometry?.id !== obj.id ? obj : state.selectedGeometry,
      })),
    setGhostPos: (pos) => set({ ghostPos: pos }),
    setCreateMode: (state) => set({ createMode: state }),
    setDesiredShape: (shape) => set({ desiredShape: shape }),
    setLastSelected2D: (shape) => set({ lastSelected2D: shape }),
    setLastSelected3D: (shape) => set({ lastSelected3D: shape }),
    setHoveredObjectId: (id: string | null) => set({ hoveredObjectId: id }),

    setUpdateObjectName: (id: string, name: string) => {
      set((state) => {
        const obj = state.sceneObjects.find((o) => o.uuid === id);
        if (obj) {
          obj.userData.type = name;
        }
        return { sceneObjects: [...state.sceneObjects] };
      });
    },
    // setGeometryColor: (color) =>
    //   set((state) => {
    //     const sel = state.selectedGeometry;
    //     if (!sel) return {};
    //     // material may be a specific THREE material with a color property; narrow its type to access color API
    //     const material = sel.material as THREE.Material & {
    //       color?: THREE.Color;
    //     };
    //     if (material?.color?.setRGB) {
    //       material.color.setRGB(color.r, color.g, color.b);
    //     } else if (material?.color) {
    //       // fallback: assign color components if present
    //       material.color.r = color.r;
    //       material.color.g = color.g;
    //       material.color.b = color.b;
    //     }
    //     return { selectedGeometry: sel };
    //   }),
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
