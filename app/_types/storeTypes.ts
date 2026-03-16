import * as THREE from "three";
import { GEOMETRIES_TYPE } from "../_Editor/Creation/sceneGeometries";

export type SceneGeometry = THREE.Mesh | THREE.Object3D | THREE.Group;

export type TransformMode = "translate" | "rotate" | "scale"; 

export type LightType =
  | "PointLight"
  | "DirectionalLight"
  | "SpotLight"
  | "AmbientLight";

export interface SceneLight {
  id: string;
  type: LightType;
  color: string;
  intensity: number;
  position: { x: number; y: number; z: number };
  distance?: number;
  angle?: number;
}

export type SceneState = {
  sceneObj: THREE.Scene | null;
  sceneObjects: SceneGeometry[];
  selectedGeometry: SceneGeometry | null;
  ghostPos: THREE.Vector3 | null;
  createMode: boolean;
  desiredShape: keyof typeof GEOMETRIES_TYPE | "";
  lastSelected2D: string | null;
  lastSelected3D: string | null;
  hoveredObjectId: string | null;
  sceneBg: string;
  geometryTransformation: {
    position: { x: number; y: number; z: number };
    scale: { x: number; y: number; z: number };
    rotation: { x: number; y: number; z: number };
  };
  geometryMaterial: {
    type: string | undefined;
    color: string;
    props: Record<string, string | number | boolean | undefined>;
  };
  sceneFog: {
    type: string;
    color: string;
    density: number;
    near: number;
    far: number;
  };
  sceneZoom: number;
  sceneLights: SceneLight[];
  isTransformControlsActive: boolean;
  transformMode: "translate" | "rotate" | "scale";
  isResizing: boolean;
  resizeHandle: THREE.Object3D | null;

  setIsResizing: (v: boolean) => void;
  setResizeHandle: (h: THREE.Object3D | null) => void;
  setUpdateSceneZoom: (zoom: number) => void;
  setScene: (scene: THREE.Scene) => void;
  setAddObjectsToScene: (obj: SceneGeometry) => void;
  setSelectedGeometry: (obj: SceneGeometry | null) => void;
  setGhostPos: (pos: THREE.Vector3 | null) => void;
  setCreateMode: (state: boolean) => void;
  setDesiredShape: (shape: keyof typeof GEOMETRIES_TYPE | "") => void;
  setLastSelected2D: (shape: string | null) => void;
  setLastSelected3D: (shape: string | null) => void;
  setHoveredObjectId: (id: string | null) => void;
  setUpdateObjectName: (id: string, name: string) => void;
  setSceneBg: (color: string) => void;
  setGeometryTransformation: (transformation: {
    position?: { x: number; y: number; z: number };
    scale?: { x: number; y: number; z: number };
    rotation?: { x: number; y: number; z: number };
  }) => void;
  setGeometryMaterial: (
    material: Partial<{
      type: string | undefined;
      color: string;
      props: Record<string, string | number | boolean | undefined>;
    }>,
  ) => void;
  setObjectVisibility: (objId: string, isVisible: boolean) => void;
  setObjectLocked: (objId: string, isLocked: boolean) => void;
  setSceneFog: (patch: {
    type?: "" | "Fog" | "FogExp2";
    color?: string;
    density?: number;
    near?: number;
    far?: number;
  }) => void;
  setAddLightToScene: (type?: LightType) => void;
  setUpdateLight: (id: string, patch: Partial<SceneLight>) => void;
  setRemoveLightFromScene: (id: string) => void;
  setIsTransformControlsActive: (isActive: boolean) => void;
  setTransformMode: (mode: "translate" | "rotate" | "scale") => void;
  setDeleteSelectedObject: () => void;
};

export type MiddlebarState = {
  activeMenu: string | null;
  setActiveMenu: (id: string | null) => void;
};
