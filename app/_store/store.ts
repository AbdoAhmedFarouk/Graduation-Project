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
  //LIGHTS
  sceneLights: [],
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
          obj && state.selectedGeometry?.id !== obj.id ? obj : null,
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
      set((state) => {
        const selectedObj = state.sceneObjects.find(
          (obj) => obj.uuid === state.selectedGeometry?.uuid,
        );
        if (selectedObj?.userData.isLocked) return state;

        return {
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
              ? {
                  ...state.geometryTransformation.scale,
                  ...transformation.scale,
                }
              : state.geometryTransformation.scale,
            rotation: transformation.rotation
              ? {
                  ...state.geometryTransformation.rotation,
                  ...transformation.rotation,
                }
              : state.geometryTransformation.rotation,
          },
        };
      }),
    setGeometryMaterial: (material) =>
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
    setGeometryVisibility: (objId: string, isVisible: boolean) =>
      set((state) => {
        const obj = state.sceneObjects.find((o) => o.uuid === objId);
        if (obj) {
          obj.userData.isVisible = isVisible;
          obj.visible = isVisible;
        }
        return { sceneObjects: [...state.sceneObjects] };
      }),
    setGeometryLocked: (objId: string, isLocked: boolean) =>
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
    addLightToScene: (type = "AmbientLight") =>
      set((state) => {
        if (!state.sceneObj) return state;

        // Check if a light of this type already exists
        const existingLight = state.sceneLights.find((l) => l.type === type);
        if (existingLight) return state; // Don't add duplicate light types

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
            position = { x: 5, y: 5, z: 5 };
            intensity = 1;
            break;
          case "PointLight":
            light = new THREE.PointLight(0xffffff, 1);
            position = { x: 3, y: 3, z: 3 };
            intensity = 1;
            distance = 100;
            break;
          case "SpotLight":
            light = new THREE.SpotLight(0xffffff, 1);
            position = { x: 5, y: 5, z: 5 };
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
    updateLight: (id, patch) =>
      set((state) => {
        const lightData = state.sceneLights.find((l) => l.id === id);
        if (!lightData) return state;

        if (!state.sceneObj) return state;

        const light = state.sceneObj.children.find((c) => c.name === id) as
          | THREE.Light
          | undefined;

        if (!light) return state;

        // Handle type change - reset all properties to defaults for new type
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
              newPosition = { x: 5, y: 5, z: 5 };
              break;
            case "PointLight":
              newLight = new THREE.PointLight(0xffffff, 1);
              newPosition = { x: 3, y: 3, z: 3 };
              newDistance = 100;
              (newLight as THREE.PointLight).distance = newDistance;
              break;
            case "SpotLight":
              newLight = new THREE.SpotLight(0xffffff, 1);
              newPosition = { x: 5, y: 5, z: 5 };
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

        // Handle regular updates (non-type changes)
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
    removeLight: (id) =>
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
  })),
);

export const useMiddlebarStore = create<MiddlebarState>()(
  devtools((set) => ({
    activeMenu: null,

    setActiveMenu: (condition) =>
      set(() => ({
        activeMenu: condition,
      })),
  })),
);
