import * as THREE from "three";
import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { MiddlebarState, SceneState } from "../_types/storeTypes";
import type { LightType } from "../_types/storeTypes";

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
  sceneFog: {
    type: "",
    color: "ffffff",
    density: 0.1,
    near: 0.1,
    far: 20,
  },
  sceneZoom: 100,
  sceneLights: [],
  isTransformControlsActive: false,
  transformMode: "translate",
  isResizing: false,
  resizeHandle: null,
};

export const useSceneStore = create<SceneState>()(
  devtools((set) => ({
    ...initialState,

    setUpdateSceneZoom: (zoom) => set({ sceneZoom: zoom }),
    setScene: (sceneObj) => set({ sceneObj }),
    setSceneBg: (color) => set({ sceneBg: color }),
    setAddObjectsToScene: (obj) =>
      set((state) => ({
        sceneObjects: [obj, ...state.sceneObjects],
      })),
    setSelectedGeometry: (obj) =>
      set((state) => ({
        selectedGeometry:
          obj && state.selectedGeometry?.uuid !== obj.uuid ? obj : null,
      })),
    setGhostPos: (pos) => set({ ghostPos: pos }),
    setCreateMode: (state) => set({ createMode: state }),
    setDesiredShape: (shape) => set({ desiredShape: shape }),
    setLastSelected2D: (shape) => set({ lastSelected2D: shape }),
    setLastSelected3D: (shape) => set({ lastSelected3D: shape }),
    setHoveredObjectId: (id) => set({ hoveredObjectId: id }),
    setUpdateObjectName: (id, name) => {
      set((state) => {
        const obj = state.sceneObjects.find((o) => o.uuid === id);
        if (obj) {
          obj.name = name;
          obj.userData.name = name;
        }
        return { sceneObjects: [...state.sceneObjects] };
      });
    },
    setGeometryTransformation: (transformation) =>
      set((state) => ({
        geometryTransformation: {
          ...state.geometryTransformation,
          ...transformation,
          position: {
            ...state.geometryTransformation.position,
            ...transformation.position,
          },
          scale: {
            ...state.geometryTransformation.scale,
            ...transformation.scale,
          },
          rotation: {
            ...state.geometryTransformation.rotation,
            ...transformation.rotation,
          },
        },
      })),
    setGeometryMaterial: (material) =>
      set((state) => ({
        geometryMaterial: {
          ...state.geometryMaterial,
          ...(material.type && { type: material.type }),
          ...(material.color && { color: material.color }),
          props: { ...state.geometryMaterial.props, ...material.props },
        },
      })),
    setObjectVisibility: (objId, isVisible) =>
      set((state) => {
        const obj = state.sceneObjects.find((o) => o.uuid === objId);
        if (obj) {
          obj.visible = isVisible;
          obj.userData.isVisible = isVisible;
        }
        return {
          sceneObjects: [...state.sceneObjects],
          selectedGeometry:
            !isVisible && state.selectedGeometry?.uuid === objId
              ? null
              : state.selectedGeometry,
        };
      }),
    setObjectLocked: (objId, isLocked) =>
      set((state) => {
        const obj = state.sceneObjects.find((o) => o.uuid === objId);
        if (obj) {
          obj.userData.isLocked = isLocked;
        }
        return { sceneObjects: [...state.sceneObjects] };
      }),
    setSceneFog: (patch) =>
      set((state) => {
        if (!state.sceneObj) return state;

        const updatedSceneFog = { ...state.sceneFog, ...patch };
        const colorStr = `#${updatedSceneFog.color}`;

        if (patch.type !== undefined) {
          if (patch.type === "") {
            state.sceneObj.fog = null;
          } else if (patch.type === "Fog") {
            state.sceneObj.fog = new THREE.Fog(
              colorStr,
              updatedSceneFog.near,
              updatedSceneFog.far,
            );
          } else if (patch.type === "FogExp2") {
            state.sceneObj.fog = new THREE.FogExp2(
              colorStr,
              updatedSceneFog.density,
            );
          }
        }

        const fog = state.sceneObj.fog;
        if (fog) {
          fog.color.set(colorStr);
          if ("density" in fog) fog.density = updatedSceneFog.density;
          if ("near" in fog) fog.near = updatedSceneFog.near;
          if ("far" in fog) fog.far = updatedSceneFog.far;
        }

        return { sceneFog: updatedSceneFog };
      }),
    setAddLightToScene: (type = "AmbientLight") =>
      set((state) => {
        if (!state.sceneObj) return state;

        const existingLight = state.sceneLights.find((l) => l.type === type);
        if (existingLight) return state;

        const id = crypto.randomUUID();
        let light: THREE.Light;
        let position = { x: 0, y: 0, z: 0 };
        let intensity = 1;
        let distance = 100;
        let angle = Math.PI / 4;

        switch (type) {
          case "AmbientLight":
            light = new THREE.AmbientLight(0xffffff, 5);
            intensity = 5;
            break;
          case "DirectionalLight":
            light = new THREE.DirectionalLight(0xffffff, 1);
            position = { x: 0, y: 0, z: 0 };
            intensity = 1;
            break;
          case "PointLight":
            light = new THREE.PointLight(0xffffff, 1);
            position = { x: 0, y: 0, z: 0 };
            intensity = 1;
            distance = 100;
            break;
          case "SpotLight":
            light = new THREE.SpotLight(0xffffff, 1);
            position = { x: 0, y: 0, z: 0 };
            intensity = 1;
            angle = Math.PI / 4;
            break;
          default:
            light = new THREE.AmbientLight(0xffffff, 5);
            intensity = 5;
        }

        light.name = id;
        light.position.set(position.x, position.y, position.z);
        state.sceneObj.add(light);

        const lightData: {
          id: string;
          type: LightType;
          color: string;
          intensity: number;
          position: { x: number; y: number; z: number };
          distance?: number;
          angle?: number;
        } = {
          id,
          type: type as LightType,
          color: "ffffff",
          intensity,
          position,
        };

        if (type === "PointLight") lightData.distance = distance;
        if (type === "SpotLight") lightData.angle = angle;

        return {
          sceneLights: [...state.sceneLights, lightData],
        };
      }),
    setUpdateLight: (id, patch) =>
      set((state) => {
        const lightData = state.sceneLights.find((l) => l.id === id);
        if (!lightData) return state;

        if (!state.sceneObj) return state;

        const light = state.sceneObj.children.find((c) => c.name === id) as
          | THREE.Light
          | undefined;

        if (!light) return state;

        if (patch.type && patch.type !== lightData.type) {
          state.sceneObj.remove(light);

          let newLight: THREE.Light;
          let newPosition = { x: 0, y: 0, z: 0 };
          let newDistance = 100;
          let newAngle = Math.PI / 4;

          switch (patch.type) {
            case "AmbientLight":
              newLight = new THREE.AmbientLight(0xffffff, 1);
              newPosition = { x: 0, y: 0, z: 0 };
              break;
            case "DirectionalLight":
              newLight = new THREE.DirectionalLight(0xffffff, 1);
              newPosition = { x: 0, y: 0, z: 0 };
              break;
            case "PointLight":
              newLight = new THREE.PointLight(0xffffff, 1);
              newPosition = { x: 0, y: 0, z: 0 };
              newDistance = 100;
              (newLight as THREE.PointLight).distance = newDistance;
              break;
            case "SpotLight":
              newLight = new THREE.SpotLight(0xffffff, 1);
              newPosition = { x: 0, y: 0, z: 0 };
              newAngle = Math.PI / 4;
              (newLight as THREE.SpotLight).angle = newAngle;
              break;
            default:
              newLight = new THREE.AmbientLight(0xffffff, 1);
          }

          newLight.name = id;
          newLight.position.set(newPosition.x, newPosition.y, newPosition.z);
          newLight.color.set(0xffffff);
          state.sceneObj.add(newLight);

          const updatedLightData = {
            id,
            type: patch.type,
            color: "ffffff",
            intensity: 1,
            position: newPosition,
            ...(patch.type === "PointLight" && { distance: newDistance }),
            ...(patch.type === "SpotLight" && { angle: newAngle }),
          };

          return {
            sceneLights: state.sceneLights.map((l) =>
              l.id === id ? updatedLightData : l,
            ),
          };
        }

        if (patch.color) light.color.set(`#${patch.color}`);
        if (patch.intensity !== undefined) light.intensity = patch.intensity;

        if (patch.position) {
          light.position.set(
            patch.position.x,
            patch.position.y,
            patch.position.z,
          );
        }

        if (light instanceof THREE.PointLight && patch.distance !== undefined)
          light.distance = patch.distance;

        if (light instanceof THREE.SpotLight && patch.angle !== undefined)
          light.angle = patch.angle;

        const updatedIntensity = patch.intensity ?? lightData.intensity;
        const newLightData = {
          ...lightData,
          ...patch,
          intensity: updatedIntensity,
        };

        if (patch.type === "PointLight" || lightData.type === "PointLight") {
          newLightData.distance = patch.distance ?? lightData.distance ?? 100;
        }
        if (patch.type === "SpotLight" || lightData.type === "SpotLight") {
          newLightData.angle = patch.angle ?? lightData.angle ?? Math.PI / 4;
        }

        return {
          sceneLights: state.sceneLights.map((l) =>
            l.id === id ? newLightData : l,
          ),
        };
      }),
    setRemoveLightFromScene: (id) =>
      set((state) => {
        const lightData = state.sceneLights.find((l) => l.id === id);
        if (!lightData) return state;

        if (state.sceneObj) {
          const light = state.sceneObj.children.find((c) => c.name === id);
          if (light) state.sceneObj.remove(light);
        }

        return {
          sceneLights: state.sceneLights.filter((l) => l.id !== id),
        };
      }),
    setIsTransformControlsActive: (isActive) =>
      set({ isTransformControlsActive: isActive }),
    setTransformMode: (mode) => set({ transformMode: mode }),
    setIsResizing: (v) => set({ isResizing: v }),
    setResizeHandle: (h) => set({ resizeHandle: h }),
    setDeleteSelectedObject: () =>
      set((state) => {
        if (!state.selectedGeometry) return state;
        const uuid = state.selectedGeometry.uuid;
        const objInScene = state.sceneObj?.getObjectByProperty("uuid", uuid);
        if (objInScene) state.sceneObj?.remove(objInScene);

        return {
          sceneObjects: state.sceneObjects.filter((o) => o.uuid !== uuid),
          selectedGeometry: null,
          isTransformControlsActive: false,
        };
      }),
  })),
);

export const useMiddlebarStore = create<MiddlebarState>()(
  devtools((set) => ({
    activeMenu: null,
    setActiveMenu: (condition) => set({ activeMenu: condition }),
  })),
);
