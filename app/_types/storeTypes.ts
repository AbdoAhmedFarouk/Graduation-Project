import * as THREE from "three";
import { GEOMETRIES_TYPE } from "../_Editor/Creation/sceneGeometries";

type SceneGeometry = THREE.Mesh | THREE.Object3D;

export type LightType =
  | "PointLight"
  | "DirectionalLight"
  | "SpotLight"
  | "AmbientLight";

interface SceneLight {
  id: string;
  type: LightType;
  color: string;
  intensity: number;
  position?: { x: number; y: number; z: number };
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

  updateSceneZoom: (zoom: number) => void;
  setScene: (scene: THREE.Scene) => void;
  setSceneObjects: (obj: SceneGeometry) => void;
  setSelectedGeometry: (obj: SceneGeometry | null) => void;
  setGhostPos: (pos: THREE.Vector3 | null) => void;
  setCreateMode: (state: boolean) => void;
  setDesiredShape: (shape: keyof typeof GEOMETRIES_TYPE | "") => void;
  setLastSelected2D: (shape: string) => void;
  setLastSelected3D: (shape: string) => void;
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
  setGeometryVisibility: (objId: string, isVisible: boolean) => void;
  setGeometryLocked: (objId: string, isLocked: boolean) => void;
  setSceneFog: (patch: {
    type?: "" | "Fog" | "FogExp2";
    color?: string;
    density?: number;
    near?: number;
    far?: number;
  }) => void;
  addLightToScene: (type?: LightType) => void;
  updateLight: (id: string, patch: Partial<SceneLight>) => void;
  removeLight: (id: string) => void;
  setIsTransformControlsActive: (isActive: boolean) => void;
};

export type MiddlebarState = {
  activeMenu: string | null;
  setActiveMenu: (id: string | null) => void;
};
