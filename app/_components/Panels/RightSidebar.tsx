"use client";

import * as THREE from "three";
import { useEffect, useRef, useState } from "react";

import { useShallow } from "zustand/shallow";
import { useSceneStore } from "@/app/_store/store";

import CustomColorPicker from "../CustomColorPicker";
import InputSlider from "../InputSlider";
import { Checkbox } from "../ui/checkbox";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Switch } from "../ui/switch";

import { useToggleState } from "@/app/_hooks/useToggleState";
import { useOutsideClick } from "@/app/_hooks/useClickOutside";
import { useHandleChangeColor } from "@/app/_hooks/useHandleChangeColor";
import { useHandlePressEnterKey } from "@/app/_hooks/useHandlePressEnterKey";

import { getSingleMaterial } from "@/app/_lib/utils";
import { MaterialValue } from "@/app/_types/material";
import type { LightType } from "@/app/_types/storeTypes";

import { BringToFront, ChevronDown, ChevronUp, Lightbulb } from "lucide-react";

const materials = [
  "MeshBasicMaterial",
  "MeshStandardMaterial",
  "MeshLambertMaterial",
  "MeshPhongMaterial",
  "MeshPhysicalMaterial",
] as const;

export type MaterialType = (typeof materials)[number];

export interface MaterialSnapshot {
  type: MaterialType;
  color: string;
  props: {
    opacity: number;
    wireframe?: boolean;
    roughness?: number;
    metalness?: number;
    shininess?: number;
    transmission?: number;
    ior?: number;
    clearcoat?: number;
    clearcoatRoughness?: number;
    thickness?: number;
  };
}

type MaterialParams =
  | THREE.MeshBasicMaterialParameters
  | THREE.MeshLambertMaterialParameters
  | THREE.MeshPhongMaterialParameters
  | THREE.MeshStandardMaterialParameters
  | THREE.MeshPhysicalMaterialParameters;

type MaterialConstructor = new (
  params?: THREE.MeshStandardMaterialParameters,
) => THREE.Material;

const MaterialMap: Record<MaterialType, MaterialConstructor> = {
  MeshBasicMaterial: THREE.MeshBasicMaterial,
  MeshStandardMaterial: THREE.MeshStandardMaterial,
  MeshLambertMaterial: THREE.MeshLambertMaterial,
  MeshPhongMaterial: THREE.MeshPhongMaterial,
  MeshPhysicalMaterial: THREE.MeshPhysicalMaterial,
};

const transformConfig = [
  { label: "Position", stateKey: "position", funcKey: "pos" },
  { label: "Scale", stateKey: "scale", funcKey: "scale" },
  { label: "Rotation", stateKey: "rotation", funcKey: "rot" },
] as const;

const axes = ["x", "y", "z"] as const;

const createFreshMaterialParams = (
  type: MaterialType,
  color: THREE.Color,
): MaterialParams => {
  const baseCommon = {
    color: color,
    transparent: false,
    opacity: 1,
    wireframe: false,
    side: THREE.FrontSide,
  };

  switch (type) {
    case "MeshBasicMaterial":
      return baseCommon;

    case "MeshLambertMaterial":
      return baseCommon;

    case "MeshPhongMaterial":
      return {
        ...baseCommon,
        shininess: 30,
      };

    case "MeshStandardMaterial":
      return {
        ...baseCommon,
        roughness: 1,
        metalness: 0,
      };

    case "MeshPhysicalMaterial":
      return {
        ...baseCommon,
        roughness: 1,
        metalness: 0,
        transmission: 0,
        ior: 1.5,
        clearcoat: 0,
        clearcoatRoughness: 0,
        thickness: 0,
      };

    default:
      return baseCommon;
  }
};

const createMaterialSnapshot = (mat: THREE.Material): MaterialSnapshot => {
  const snapshot: MaterialSnapshot = {
    type: mat.type as MaterialType,
    color:
      "color" in mat
        ? (mat as THREE.MeshBasicMaterial).color.getHexString()
        : "ffffff",
    props: { opacity: mat.opacity },
  };

  if (
    mat instanceof THREE.MeshStandardMaterial ||
    mat instanceof THREE.MeshPhysicalMaterial
  ) {
    snapshot.props.roughness = mat.roughness;
    snapshot.props.metalness = mat.metalness;
    snapshot.props.wireframe = mat.wireframe;
  }

  if (mat instanceof THREE.MeshPhongMaterial) {
    snapshot.props.shininess = mat.shininess;
    snapshot.props.wireframe = mat.wireframe;
  }

  if (mat instanceof THREE.MeshPhysicalMaterial) {
    snapshot.props.transmission = mat.transmission;
    snapshot.props.ior = mat.ior;
    snapshot.props.clearcoat = mat.clearcoat;
    snapshot.props.clearcoatRoughness = mat.clearcoatRoughness;
    snapshot.props.thickness = mat.thickness;
  }

  if (
    mat instanceof THREE.MeshBasicMaterial ||
    mat instanceof THREE.MeshLambertMaterial
  ) {
    snapshot.props.wireframe = mat.wireframe;
  }

  return snapshot;
};

const materialSliderConfig = [
  {
    label: "Opacity",
    prop: "opacity",
    max: 1,
    step: 0.01,
    types: [
      "MeshBasicMaterial",
      "MeshStandardMaterial",
      "MeshLambertMaterial",
      "MeshPhongMaterial",
      "MeshPhysicalMaterial",
    ],
  },
  {
    label: "Rough",
    prop: "roughness",
    max: 1,
    step: 0.01,
    types: ["MeshStandardMaterial", "MeshPhysicalMaterial"],
  },
  {
    label: "Metal",
    prop: "metalness",
    max: 1,
    step: 0.01,
    types: ["MeshStandardMaterial", "MeshPhysicalMaterial"],
  },
  {
    label: "Shine",
    prop: "shininess",
    max: 100,
    step: 1,
    types: ["MeshPhongMaterial"],
  },
  {
    label: "Transmission",
    prop: "transmission",
    min: 0,
    max: 1,
    step: 0.01,
    types: ["MeshPhysicalMaterial"],
  },
  {
    label: "Clearcoat",
    prop: "clearcoat",
    max: 1,
    step: 0.01,
    types: ["MeshPhysicalMaterial"],
  },
  {
    label: "C-Rough",
    prop: "clearcoatRoughness",
    max: 1,
    step: 0.01,
    types: ["MeshPhysicalMaterial"],
  },
  {
    label: "Thickness",
    prop: "thickness",
    max: 10,
    step: 0.1,
    types: ["MeshPhysicalMaterial"],
  },
];

export default function RightSidebar() {
  const [showSceneColorPicker, setShowSceneColorPicker] =
    useState<boolean>(false);
  const [showGeometryColorPicker, setShowGeometryColorPicker] =
    useState<boolean>(false);
  const [showFogColorPicker, setShowFogColorPicker] = useState<boolean>(false);
  const [isFogSettingActive, setIsFogSettingActive] = useState<boolean>(false);
  const [isFogActive, setIsFogActive] = useState<boolean>(false);
  const [showLightColorPicker, setShowLightColorPicker] =
    useState<boolean>(false);
  const [isLightSettingActive, setIsLightSettingActive] =
    useState<boolean>(true);
  const [isLightActive, setIsLightActive] = useState<boolean>(true);

  const {
    sceneObj,
    sceneBg,
    selectedGeometry,
    geometryTransformation,
    sceneObjects,
    geometryMaterial,
    sceneZoom,
    sceneFog,
    sceneLights,
    setSceneBg,
    setGeometryTransformation,
    setGeometryMaterial,
    setGeometryVisibility,
    setSceneFog,
    addLightToScene,
    updateLight,
    removeLight,
    setIsTransformControlsActive,
  } = useSceneStore(
    useShallow((state) => ({
      sceneObj: state.sceneObj,
      sceneBg: state.sceneBg,
      selectedGeometry: state.selectedGeometry,
      sceneObjects: state.sceneObjects,
      geometryTransformation: state.geometryTransformation,
      geometryMaterial: state.geometryMaterial,
      sceneFog: state.sceneFog,
      sceneZoom: state.sceneZoom,
      sceneLights: state.sceneLights,
      setSceneBg: state.setSceneBg,
      setGeometryTransformation: state.setGeometryTransformation,
      setGeometryMaterial: state.setGeometryMaterial,
      setGeometryVisibility: state.setGeometryVisibility,
      setSceneFog: state.setSceneFog,
      addLightToScene: state.addLightToScene,
      updateLight: state.updateLight,
      removeLight: state.removeLight,
      setIsTransformControlsActive: state.setIsTransformControlsActive,
    })),
  );

  const sceneColorRef = useRef<HTMLSpanElement>(null);
  const geometryColorRef = useRef<HTMLSpanElement>(null);
  const fogColorRef = useRef<HTMLSpanElement>(null);
  const lightColorPickerRef = useRef<HTMLSpanElement | null>(null);

  const handleChangeColor = useHandleChangeColor();
  const handlePressEnterKey = useHandlePressEnterKey();
  const handleToggle = useToggleState();

  const applyGeometryTransformation = (
    patch: Partial<{
      pos: { x: number; y: number; z: number };
      rot: { x: number; y: number; z: number };
      scale: { x: number; y: number; z: number };
    }>,
  ) => {
    if (!selectedGeometry) return;

    if (patch.pos) {
      selectedGeometry.position.set(patch.pos.x, patch.pos.y, patch.pos.z);
      setGeometryTransformation({ position: patch.pos });
    }
    if (patch.rot) {
      selectedGeometry.rotation.set(patch.rot.x, patch.rot.y, patch.rot.z);
      setGeometryTransformation({ rotation: patch.rot });
    }
    if (patch.scale) {
      selectedGeometry.scale.set(patch.scale.x, patch.scale.y, patch.scale.z);
      setGeometryTransformation({ scale: patch.scale });
    }
  };

  const handleChangeMaterial = (type: MaterialType) => {
    if (!selectedGeometry) return;

    const mesh = sceneObjects.find(
      (obj) => obj.uuid === selectedGeometry.uuid,
    ) as THREE.Mesh;
    if (!mesh) return;

    const oldMaterial = getSingleMaterial(mesh.material);
    if (!oldMaterial) return;

    let oldColor = new THREE.Color(0xeeba2c);
    if (
      oldMaterial instanceof THREE.MeshBasicMaterial ||
      oldMaterial instanceof THREE.MeshLambertMaterial ||
      oldMaterial instanceof THREE.MeshPhongMaterial ||
      oldMaterial instanceof THREE.MeshStandardMaterial ||
      oldMaterial instanceof THREE.MeshPhysicalMaterial
    ) {
      oldColor = oldMaterial.color.clone();
    }

    const params = createFreshMaterialParams(type, oldColor);
    const MaterialCtor = MaterialMap[type];
    const newMaterial = new MaterialCtor(params);

    oldMaterial.dispose();
    mesh.material = newMaterial;
    newMaterial.needsUpdate = true;

    updateStoreWithMaterial(newMaterial);
    if (selectedGeometry) setGeometryVisibility(selectedGeometry.uuid, true);
  };

  const updateStoreWithMaterial = (material: THREE.Material) => {
    const props: Record<string, number | boolean> = {
      opacity: material.opacity,
      transparent: material.transparent,
    };
    if ("wireframe" in material) {
      props.wireframe = (material as THREE.MeshBasicMaterial).wireframe;
    }
    if (
      material instanceof THREE.MeshStandardMaterial ||
      material instanceof THREE.MeshPhysicalMaterial
    ) {
      props.roughness = material.roughness;
      props.metalness = material.metalness;
    }
    if (material instanceof THREE.MeshPhongMaterial) {
      props.shininess = material.shininess;
    }
    if (material instanceof THREE.MeshPhysicalMaterial) {
      props.transmission = material.transmission;
      props.clearcoat = material.clearcoat;
      props.clearcoatRoughness = material.clearcoatRoughness;
      props.thickness = material.thickness;
      props.ior = material.ior;
    }
    let colorHex = "eeba2c";
    if ("color" in material) {
      const colorObj = (material as THREE.MeshBasicMaterial).color;
      if (colorObj instanceof THREE.Color) {
        colorHex = colorObj.getHexString();
      }
    }

    setGeometryMaterial({
      type: material.type as MaterialType,
      color: colorHex,
      props,
    });
  };

  const applyMaterialProperty = (patch: Record<string, MaterialValue>) => {
    if (!selectedGeometry) return;

    const mat = getSingleMaterial((selectedGeometry as THREE.Mesh).material);
    if (!mat) return;

    const materialAsRecord = mat as unknown as Record<string, MaterialValue>;

    Object.keys(patch).forEach((key) => {
      if (key in mat) {
        materialAsRecord[key] = patch[key];
      }
    });

    mat.needsUpdate = true;

    setGeometryMaterial({
      props: {
        ...geometryMaterial.props,
        ...patch,
      },
    });
  };

  const handleFogPropertyChange = (
    property: "density" | "near" | "far",
    value: number,
  ) => {
    setSceneFog({ [property]: value });
  };

  useEffect(() => {
    if (!selectedGeometry) return;

    setGeometryTransformation({
      position: {
        x: selectedGeometry.position.x,
        y: selectedGeometry.position.y,
        z: selectedGeometry.position.z,
      },
      scale: {
        x: selectedGeometry.scale.x,
        y: selectedGeometry.scale.y,
        z: selectedGeometry.scale.z,
      },
      rotation: {
        x: selectedGeometry.rotation.x,
        y: selectedGeometry.rotation.y,
        z: selectedGeometry.rotation.z,
      },
    });

    const mat = getSingleMaterial((selectedGeometry as THREE.Mesh).material);
    if (mat) {
      const snapshot = createMaterialSnapshot(mat);
      setGeometryMaterial(snapshot);
    }
  }, [selectedGeometry]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    setSceneFog(
      isFogActive
        ? {
            type: sceneFog.type === "FogExp2" ? "FogExp2" : "Fog",
            color: sceneFog.color,
            density: sceneFog.density || 0.1,
            near: sceneFog.near || 0.1,
            far: sceneFog.far || 20,
          }
        : { type: "" },
    );
  }, [isFogActive]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (sceneObj && isLightActive && sceneLights.length === 0) {
      addLightToScene("AmbientLight");
    }
  }, [sceneObj, isLightActive]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (isLightActive) {
      if (sceneLights.length === 0) {
        addLightToScene("AmbientLight");
      }
      setIsLightSettingActive(true);
    } else {
      sceneLights.forEach((light) => removeLight(light.id));
      setIsLightSettingActive(false);
    }
  }, [isLightActive]); // eslint-disable-line react-hooks/exhaustive-deps

  useOutsideClick(showSceneColorPicker, setShowSceneColorPicker, sceneColorRef);
  useOutsideClick(
    showGeometryColorPicker,
    setShowGeometryColorPicker,
    geometryColorRef,
  );
  useOutsideClick(showFogColorPicker, setShowFogColorPicker, fogColorRef);
  useOutsideClick(
    showLightColorPicker,
    setShowLightColorPicker,
    lightColorPickerRef,
  );

  return (
    <div className="absolute flex flex-col text-secondary max-h-[666px] h-full right-5 top-5 bg-surface w-60 rounded-2xl p-3 text-sm cursor-default select-none">
      <div className="flex items-center justify-between pb-3 text-xs">
        <div>Logo</div>

        <div className="flex items-center gap-2">
          <span>{sceneZoom}%</span>

          <div className="flex items-center gap-1.5">
            <Button
              variant="customVariant"
              size="sm"
              className="hover:bg-secondary/20 text-xs"
            >
              Share
            </Button>
            <Button
              size="sm"
              variant="customVariant"
              className="hover:bg-secondary/20 text-xs"
            >
              Export
            </Button>
          </div>
        </div>
      </div>

      <hr className="w-full bg-secondary/40 h-[1px] border-0" />

      <div className="overflow-y-auto h-full ">
        <div className="pb-3 mt-4">
          <h3 className="mb-3 font-bold">Scene</h3>

          <CustomColorPicker
            label="BG Color"
            background={sceneBg}
            onClick={(e: React.MouseEvent<HTMLSpanElement>) =>
              handleToggle(showSceneColorPicker, setShowSceneColorPicker, e)
            }
            onKeyDown={(e) => handlePressEnterKey(e, setSceneBg, sceneObj)}
            onBlur={(e) =>
              handleChangeColor(e.target.value, setSceneBg, sceneObj)
            }
            onInputChange={(value) => setSceneBg(value.slice(1))}
            onColorPickerChange={(color) =>
              handleChangeColor(color, setSceneBg, sceneObj)
            }
            ref={sceneColorRef}
            pickerClassname="scene-color-picker"
            showColorPicker={showSceneColorPicker}
          />
        </div>

        <hr className="w-full bg-secondary/40 h-[1px] border-0" />

        <div className="mt-4 pb-3 hover:bg-cards/90 text-xs">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2 flex-1">
              <span className="bg-borders size-6 rounded-sm flex items-center justify-center">
                <BringToFront size={18} />
              </span>

              <div
                className="flex items-center gap-2"
                onClick={() =>
                  handleToggle(isFogSettingActive, setIsFogSettingActive)
                }
              >
                <h3>Fog</h3>
                {isFogSettingActive ? (
                  <ChevronUp size={14} />
                ) : (
                  <ChevronDown size={14} />
                )}
              </div>
            </div>

            <Switch
              id="toggle-fog"
              className="data-[state=checked]:bg-hover"
              onClick={() => handleToggle(isFogActive, setIsFogActive)}
            />
          </div>

          {isFogSettingActive && (
            <>
              <div className="grid items-center mb-2 grid-cols-8">
                <span className="col-span-2">Density</span>
                <div className="flex items-center col-span-6 gap-1">
                  <Button
                    size="sm"
                    variant="customVariant"
                    className={`h-6 text-xs ${
                      sceneFog.type === "FogExp2" ? "bg-gold/80" : ""
                    }`}
                    onClick={() =>
                      setSceneFog({ type: "FogExp2", density: 0.1 })
                    }
                  >
                    Yes
                  </Button>
                  <Button
                    size="sm"
                    variant="customVariant"
                    className={`h-6 text-xs ${
                      sceneFog.type === "Fog" || sceneFog.type === ""
                        ? "bg-gold/80"
                        : ""
                    }`}
                    onClick={() => setSceneFog({ type: "Fog" })}
                  >
                    No
                  </Button>
                </div>
              </div>

              {sceneFog.type === "FogExp2" ? (
                <InputSlider
                  label="Intensity"
                  step={0.01}
                  min={0}
                  max={1}
                  isSpecialProperty={true}
                  specialPropertyValue={sceneFog.density}
                  onChange={(value) =>
                    handleFogPropertyChange("density", value)
                  }
                />
              ) : (
                <>
                  <InputSlider
                    label="Near"
                    step={0.01}
                    min={0}
                    max={1000}
                    isSpecialProperty={true}
                    specialPropertyValue={sceneFog.near}
                    onChange={(value) => handleFogPropertyChange("near", value)}
                  />

                  <InputSlider
                    label="Far"
                    step={0.01}
                    min={0}
                    max={1000}
                    isSpecialProperty={true}
                    specialPropertyValue={sceneFog.far}
                    onChange={(value) => handleFogPropertyChange("far", value)}
                  />
                </>
              )}

              <CustomColorPicker
                label="Color"
                pickerClassname="fog"
                ref={fogColorRef}
                background={sceneFog.color}
                onInputChange={(value) =>
                  setSceneFog({ color: value.slice(1) })
                }
                showColorPicker={showFogColorPicker}
                onColorPickerChange={(color) =>
                  handleChangeColor(
                    color,
                    (color) => setSceneFog({ color }),
                    undefined,
                    undefined,
                  )
                }
                onBlur={(e) =>
                  handleChangeColor(
                    e.target.value,
                    (color) => setSceneFog({ color }),
                    undefined,
                    undefined,
                  )
                }
                onKeyDown={(e) =>
                  handlePressEnterKey(
                    e,
                    (color) => setSceneFog({ color }),
                    undefined,
                    undefined,
                  )
                }
                onClick={(e: React.MouseEvent<HTMLSpanElement>) =>
                  handleToggle(showFogColorPicker, setShowFogColorPicker, e)
                }
              />
            </>
          )}
        </div>

        <hr className="w-full bg-secondary/40 h-[1px] border-0" />

        <div className="mt-4 pb-3 hover:bg-cards/90 text-xs">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2 flex-1">
              <span className="bg-borders size-6 rounded-sm flex items-center justify-center">
                <Lightbulb size={18} />
              </span>

              <div
                className="flex items-center gap-2"
                onClick={() =>
                  sceneLights.length > 0 &&
                  handleToggle(isLightSettingActive, setIsLightSettingActive)
                }
              >
                <h3>Lights</h3>
                {isLightSettingActive ? (
                  <ChevronUp size={14} />
                ) : (
                  <ChevronDown size={14} />
                )}
              </div>
            </div>

            <Switch
              id="toggle-light"
              className="data-[state=checked]:bg-hover"
              checked={isLightActive}
              onClick={() => handleToggle(isLightActive, setIsLightActive)}
            />
          </div>

          {isLightActive && (
            <div className="mb-3 flex gap-1 flex-wrap">
              {sceneLights.length === 0 && (
                <Button
                  onClick={() => addLightToScene("AmbientLight")}
                  variant="customVariant"
                  size="sm"
                  className="text-xs hover:bg-secondary/20"
                >
                  + Ambient
                </Button>
              )}
              <Button
                onClick={() => addLightToScene("DirectionalLight")}
                variant="customVariant"
                size="sm"
                className="text-xs hover:bg-secondary/20"
              >
                + Directional
              </Button>
              <Button
                onClick={() => addLightToScene("PointLight")}
                variant="customVariant"
                size="sm"
                className="text-xs hover:bg-secondary/20"
              >
                + Point
              </Button>
              <Button
                onClick={() => addLightToScene("SpotLight")}
                variant="customVariant"
                size="sm"
                className="text-xs hover:bg-secondary/20"
              >
                + Spot
              </Button>
            </div>
          )}

          {isLightSettingActive && (
            <>
              {sceneLights.map((light) => (
                <div key={light.id} className="mb-4">
                  <div className="grid items-center mb-2 grid-cols-8">
                    <span className="col-span-2">Type</span>
                    <div className="flex items-center col-span-6 gap-1">
                      <Select
                        value={light.type}
                        onValueChange={(newType) =>
                          updateLight(light.id, { type: newType as LightType })
                        }
                      >
                        <SelectTrigger size="sm" className="w-full text-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectItem value="AmbientLight">
                              Ambient Light
                            </SelectItem>
                            <SelectItem value="DirectionalLight">
                              Directional Light
                            </SelectItem>
                            <SelectItem value="PointLight">
                              Point Light
                            </SelectItem>
                            <SelectItem value="SpotLight">
                              Spot Light
                            </SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <CustomColorPicker
                    label="Color"
                    pickerClassname="light"
                    background={light.color}
                    ref={lightColorPickerRef}
                    showColorPicker={showLightColorPicker}
                    onClick={(e) =>
                      handleToggle(
                        showLightColorPicker,
                        setShowLightColorPicker,
                        e,
                      )
                    }
                    onColorPickerChange={(color) =>
                      updateLight(light.id, {
                        color: color.replace("#", ""),
                      })
                    }
                    onInputChange={(value) =>
                      updateLight(light.id, {
                        color: value.replace("#", ""),
                      })
                    }
                    onBlur={(e) =>
                      updateLight(light.id, {
                        color: e.target.value.replace("#", ""),
                      })
                    }
                    onKeyDown={(e) =>
                      handlePressEnterKey(
                        e,
                        (color) => updateLight(light.id, { color }),
                        undefined,
                        undefined,
                      )
                    }
                  />

                  <InputSlider
                    label="Intensity"
                    min={0}
                    max={
                      light.type === "PointLight" || light.type === "SpotLight"
                        ? 250
                        : 10
                    }
                    step={0.1}
                    isSpecialProperty={true}
                    specialPropertyValue={light.intensity}
                    onChange={(value) =>
                      updateLight(light.id, {
                        intensity: value,
                      })
                    }
                  />

                  {light.type !== "AmbientLight" && (
                    <div className="grid items-center mb-2 grid-cols-8">
                      <span className="col-span-2">Position</span>
                      <div className="flex items-center col-span-6 gap-1">
                        {axes.map((axis) => (
                          <div key={axis} className="relative h-full">
                            <Input
                              type="number"
                              className="h-6 py-1 px-3.5 rounded-sm md:text-xs border-0 bg-borders focus-visible:ring-0 focus-visible:border selection:bg-hover/50"
                              value={(light.position?.[axis] ?? 0).toFixed(2)}
                              step={0.5}
                              onChange={(e) =>
                                updateLight(light.id, {
                                  position: {
                                    x:
                                      axis === "x"
                                        ? Number(e.target.value || 0)
                                        : (light.position?.x ?? 0),
                                    y:
                                      axis === "y"
                                        ? Number(e.target.value || 0)
                                        : (light.position?.y ?? 0),
                                    z:
                                      axis === "z"
                                        ? Number(e.target.value || 0)
                                        : (light.position?.z ?? 0),
                                  },
                                })
                              }
                            />
                            <span className="absolute left-0 top-1/2 ps-1 -translate-y-1/2 uppercase">
                              {axis}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {light.type === "PointLight" && (
                    <InputSlider
                      label="Distance"
                      min={1}
                      max={500}
                      step={1}
                      isSpecialProperty={true}
                      specialPropertyValue={light.distance ?? 100}
                      onChange={(value) =>
                        updateLight(light.id, { distance: value })
                      }
                    />
                  )}

                  {light.type === "SpotLight" && (
                    <InputSlider
                      label="Angle"
                      min={0}
                      max={Math.PI}
                      step={0.05}
                      isSpecialProperty={true}
                      specialPropertyValue={light.angle ?? Math.PI / 4}
                      onChange={(value) =>
                        updateLight(light.id, { angle: value })
                      }
                    />
                  )}

                  <Button
                    onClick={() => removeLight(light.id)}
                    variant="customVariant"
                    size="sm"
                    className="text-xs hover:bg-destructive/20 text-destructive w-full"
                  >
                    Remove Light
                  </Button>
                </div>
              ))}
            </>
          )}
        </div>

        <hr className="w-full bg-secondary/40 h-[1px] border-0" />

        {selectedGeometry && (
          <>
            <div className="mt-4 pb-3 hover:bg-cards/90">
              {transformConfig.map((transform) => (
                <div
                  key={transform.label}
                  className="grid items-center mb-2 grid-cols-8 text-xs"
                >
                  <span className="col-span-2">{transform.label}</span>

                  <div className="flex items-center col-span-6 gap-1">
                    {axes.map((axis) => (
                      <div key={axis} className="relative h-full">
                        <Input
                          type="number"
                          disabled={selectedGeometry?.userData?.isLocked}
                          className={
                            "h-6 py-1 px-3.5 rounded-sm md:text-xs border-0 bg-borders focus-visible:ring-0 focus-visible:border selection:bg-hover/50" +
                            (selectedGeometry?.userData?.isLocked
                              ? " pointer-events-none select-none opacity-60"
                              : "")
                          }
                          value={geometryTransformation[transform.stateKey][
                            axis
                          ].toFixed(2)}
                          step={0.01}
                          onChange={(e) =>
                            applyGeometryTransformation({
                              [transform.funcKey]: {
                                ...geometryTransformation[transform.stateKey],
                                [axis]: Number(e.target.value || 0),
                              },
                            })
                          }
                        />
                        <span className="absolute left-0 top-1/2 ps-1 -translate-y-1/2 uppercase">
                          {axis}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <hr className="w-full bg-secondary/40 h-[1px] border-0" />

            <div className="mt-4 pb-3 hover:bg-cards/90 text-xs">
              <h3 className="mb-3 font-bold text-sm">Material</h3>

              <div className={showGeometryColorPicker ? "min-h-[300px]" : ""}>
                <div className="grid items-center mb-2 grid-cols-8">
                  <span className="col-span-2">Type</span>
                  <div className="flex items-center col-span-6 gap-1">
                    <Select
                      value={geometryMaterial.type}
                      onValueChange={handleChangeMaterial}
                    >
                      <SelectTrigger
                        size="sm"
                        className="w-full text-xs overflow-hidden"
                      >
                        <SelectValue className="truncate" />
                      </SelectTrigger>

                      <SelectContent>
                        <SelectGroup>
                          {materials.map((mat) => (
                            <SelectItem key={mat} value={mat}>
                              {mat}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <CustomColorPicker
                  label="Color"
                  background={geometryMaterial.color}
                  onClick={(e: React.MouseEvent<HTMLSpanElement>) =>
                    handleToggle(
                      showGeometryColorPicker,
                      setShowGeometryColorPicker,
                      e,
                    )
                  }
                  onKeyDown={(e) =>
                    handlePressEnterKey(
                      e,
                      (color) => setGeometryMaterial({ color }),
                      undefined,
                      (selectedGeometry as THREE.Mesh).material,
                    )
                  }
                  onBlur={(e) =>
                    handleChangeColor(
                      e.target.value,
                      (color) => setGeometryMaterial({ color }),
                      undefined,
                      (selectedGeometry as THREE.Mesh).material,
                    )
                  }
                  onInputChange={(value) =>
                    setGeometryMaterial({ color: value.slice(1) })
                  }
                  onColorPickerChange={(color) =>
                    handleChangeColor(
                      color,
                      (color) => setGeometryMaterial({ color }),
                      undefined,
                      (selectedGeometry as THREE.Mesh).material,
                    )
                  }
                  ref={geometryColorRef}
                  pickerClassname="scene-color-picker"
                  showColorPicker={showGeometryColorPicker}
                />

                {materialSliderConfig
                  .filter((config) =>
                    config.types.includes(geometryMaterial.type as string),
                  )
                  .map((config) => (
                    <InputSlider
                      key={config.prop}
                      label={config.label}
                      prop={config.prop}
                      min={config.min || 0}
                      max={config.max}
                      step={config.step}
                      geometryMaterial={geometryMaterial}
                      applyMaterialProperty={applyMaterialProperty}
                    />
                  ))}

                {geometryMaterial.type === "MeshPhysicalMaterial" && (
                  <div className="grid items-center gap-5 mb-2 grid-cols-8">
                    <span className="col-span-2">IOR</span>
                    <div className="col-span-6">
                      <Input
                        type="number"
                        value={
                          typeof geometryMaterial.props.ior === "number"
                            ? geometryMaterial.props.ior
                            : 1.5
                        }
                        className="bg-borders h-6 border-0 rounded-sm"
                        onChange={(e) => {
                          const val = parseFloat(e.target.value);
                          const safeValue = isNaN(val)
                            ? 1.5
                            : Math.max(val, 1.0);
                          applyMaterialProperty({ ior: safeValue });
                        }}
                        step="0.01"
                      />
                    </div>
                  </div>
                )}

                {"wireframe" in (selectedGeometry as THREE.Mesh).material && (
                  <div className="flex items-center gap-2 text-xs mb-2">
                    <Checkbox
                      id="wirframe"
                      checked={!!geometryMaterial.props.wireframe}
                      onCheckedChange={(checked) =>
                        applyMaterialProperty({
                          wireframe: checked,
                        })
                      }
                    />
                    <Label htmlFor="wirframe">Wireframe</Label>
                  </div>
                )}

                <div className="flex items-center gap-2 text-xs">
                  <Checkbox
                    id="visible"
                    checked={!!selectedGeometry?.visible}
                    onCheckedChange={(checked) => {
                      if (!selectedGeometry) return;
                      setGeometryVisibility(selectedGeometry.uuid, !!checked);
                    }}
                  />
                  <Label htmlFor="visible">Visible</Label>
                </div>
              </div>
            </div>

            <hr className="w-full bg-secondary/40 h-[1px] border-0" />
          </>
        )}
      </div>
    </div>
  );
}
