import * as THREE from "three";
import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { MiddlebarState, SceneState } from "../_types/storeTypes";

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
  geometryTransformation: {
    position: { x: 0, y: 0, z: 0 },
    scale: { x: 1, y: 1, z: 1 },
    rotation: { x: 0, y: 0, z: 0 },
  },
  geometryMaterial: {
    type: "MeshBasicMaterial",
    color: "eeba2c",
    props: {},
  },
  geometryVisibility: true,
  sceneFog: {
    type: "",
    color: "ffffff",
    density: 0.1,
    near: 0.1,
    far: 20,
  },
  sceneZoom: 100,
};

export const useSceneStore = create<SceneState>()(
  devtools((set) => ({
    ...initialState,

    updateSceneZoom: (zoom: number) => set({ sceneZoom: zoom }),
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
    setGeometryTransformation: (transformation) =>
      set((state) => ({
        geometryTransformation: {
          ...state.geometryTransformation,
          ...transformation,
          position: transformation.position
            ? {
                ...state.geometryTransformation.position,
                ...transformation.position,
              }
            : state.geometryTransformation.position,
          scale: transformation.scale
            ? { ...state.geometryTransformation.scale, ...transformation.scale }
            : state.geometryTransformation.scale,
          rotation: transformation.rotation
            ? {
                ...state.geometryTransformation.rotation,
                ...transformation.rotation,
              }
            : state.geometryTransformation.rotation,
        },
      })),
    setGeometryMaterial: (
      material: Partial<
        Omit<SceneState["geometryMaterial"], "props"> & {
          props?: SceneState["geometryMaterial"]["props"];
        }
      >
    ) =>
      set((state) => ({
        geometryMaterial: {
          ...state.geometryMaterial,
          ...(material.type && { type: material.type }),
          ...(material.color && { color: material.color }),
          props: material.props
            ? { ...state.geometryMaterial.props, ...material.props }
            : state.geometryMaterial.props,
        },
      })),
    setGeometryVisibility: (visible: boolean) =>
      set((state) => {
        if (state.selectedGeometry) {
          state.selectedGeometry.visible = visible;
        }
        return { geometryVisibility: visible };
      }),
    setSceneFog: (patch) =>
      set((state) => {
        if (!state.sceneObj) return state;

        const updatedSceneFog = { ...state.sceneFog };
        if (patch.color) {
          updatedSceneFog.color = patch.color;
        }
        const fogColor = `#${updatedSceneFog.color}`;
        if (patch.type !== undefined) {
          if (patch.type === "") {
            updatedSceneFog.type = "";
            state.sceneObj.fog = null;
          } else if (patch.type === "Fog") {
            updatedSceneFog.type = "Fog";
            state.sceneObj.fog = new THREE.Fog(fogColor, 0.1, 20);
          } else if (patch.type === "FogExp2") {
            updatedSceneFog.type = "FogExp2";
            state.sceneObj.fog = new THREE.FogExp2(fogColor, 0.1);
          }
        }

        const fog = state.sceneObj.fog;
        if (fog) {
          if (patch.color) {
            fog.color.set(fogColor);
            updatedSceneFog.color = patch.color;
          }
          if (patch.density !== undefined && "density" in fog) {
            fog.density = patch.density;
            updatedSceneFog.density = patch.density;
          }
          if (patch.near !== undefined && "near" in fog) {
            fog.near = patch.near;
            updatedSceneFog.near = patch.near;
          }
          if (patch.far !== undefined && "far" in fog) {
            fog.far = patch.far;
            updatedSceneFog.far = patch.far;
          }
        }

        return { ...state, sceneFog: updatedSceneFog };
      }),
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
