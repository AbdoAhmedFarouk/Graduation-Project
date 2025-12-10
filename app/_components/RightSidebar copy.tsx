"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";

import { useShallow } from "zustand/shallow";
import { useSceneStore } from "../_store/store";

import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Slider } from "./ui/slider";

import { ChevronDown, Lightbulb } from "lucide-react";

export default function RightSidebar() {
  const { sceneObj, selectedGeometry, sceneObjects } = useSceneStore(
    useShallow((state) => ({
      sceneObj: state.sceneObj,
      selectedGeometry: state.selectedGeometry,
      sceneObjects: state.sceneObjects,
    }))
  );

  // ----------------------------
  // Helpers: resolve selected mesh
  // ----------------------------
  const selectedMesh = useMemo(() => {
    if (!selectedGeometry) return null;
    return sceneObjects.find((m) => m.uuid === selectedGeometry.id) || null;
  }, [selectedGeometry, sceneObjects]);

  // ----------------------------
  // Scene background controls
  // ----------------------------
  const [bgHex, setBgHex] = useState("#111111");
  const [bgBrightness, setBgBrightness] = useState(100); // 0..100

  // ----------------------------
  // Lights (ambient + directional)
  // ----------------------------
  const ambientRef = useRef<THREE.AmbientLight | null>(null);
  const dirRef = useRef<THREE.DirectionalLight | null>(null);

  const [ambientOn, setAmbientOn] = useState(true);
  const [ambientColor, setAmbientColor] = useState("#ffffff");
  const [ambientIntensity, setAmbientIntensity] = useState(1);

  const [dirOn, setDirOn] = useState(true);
  const [dirColor, setDirColor] = useState("#ffffff");
  const [dirIntensity, setDirIntensity] = useState(0.8);

  // ----------------------------
  // Selected object controls (only when selectedMesh exists)
  // ----------------------------
  const [selPos, setSelPos] = useState({ x: 0, y: 0, z: 0 });
  const [selRot, setSelRot] = useState({ x: 0, y: 0, z: 0 });
  const [selScale, setSelScale] = useState({ x: 1, y: 1, z: 1 });
  const [selColor, setSelColor] = useState("#eeba2c");
  const [selVisible, setSelVisible] = useState(true);

  // -------------------------------------------------
  // Utility: safely read/write material color (MSM)
  // -------------------------------------------------
  const getMaterialColor = (mesh: THREE.Mesh): THREE.Color | null => {
    const mat = mesh.material as any;
    if (mat && mat.color && typeof mat.color.clone === "function")
      return mat.color.clone();
    return null;
  };

  const setMaterialColor = (mesh: THREE.Mesh, hex: string) => {
    const mat = mesh.material as any;
    if (mat && mat.color && typeof mat.color.set === "function") {
      mat.color.set(hex);
      // store base color once (for brightness scaling)
      if (!mesh.userData.baseColor) {
        mesh.userData.baseColor = mat.color.clone();
      }
    }
  };

  // -------------------------------------------------
  // Apply scene background + brightness (real visible change)
  // -------------------------------------------------
  const applySceneBackground = () => {
    if (!sceneObj) return;

    try {
      sceneObj.background = new THREE.Color(bgHex);
    } catch {
      // ignore invalid hex
    }

    // brightness = scale all object colors relative to their stored base colors
    const k = Math.max(0, Math.min(100, bgBrightness)) / 100;

    sceneObjects.forEach((m) => {
      const base = m.userData.baseColor as THREE.Color | undefined;
      const mat = m.material as any;
      if (!mat || !mat.color) return;

      if (!base) {
        // first time: cache current color as base
        m.userData.baseColor = mat.color.clone();
      } else {
        mat.color.copy(base).multiplyScalar(k);
      }
    });
  };

  // -------------------------------------------------
  // Ensure lights exist (created once) and sync state
  // -------------------------------------------------
  const ensureLights = () => {
    if (!sceneObj) return;

    let amb = sceneObj.getObjectByName(
      "ambientLight"
    ) as THREE.AmbientLight | null;
    let dir = sceneObj.getObjectByName(
      "directionalLight"
    ) as THREE.DirectionalLight | null;

    if (!amb) {
      amb = new THREE.AmbientLight("#ffffff", 1);
      amb.name = "ambientLight";
      sceneObj.add(amb);
    }

    if (!dir) {
      dir = new THREE.DirectionalLight("#ffffff", 0.8);
      dir.name = "directionalLight";
      dir.position.set(3, 5, 4);
      sceneObj.add(dir);
    }

    ambientRef.current = amb;
    dirRef.current = dir;
  };

  // -------------------------------------------------
  // Sync selected object panel from current selected mesh
  // -------------------------------------------------
  useEffect(() => {
    if (!selectedMesh) return;

    setSelPos({
      x: selectedMesh.position.x,
      y: selectedMesh.position.y,
      z: selectedMesh.position.z,
    });

    setSelRot({
      x: selectedMesh.rotation.x,
      y: selectedMesh.rotation.y,
      z: selectedMesh.rotation.z,
    });

    setSelScale({
      x: selectedMesh.scale.x,
      y: selectedMesh.scale.y,
      z: selectedMesh.scale.z,
    });

    const c = getMaterialColor(selectedMesh);
    if (c) setSelColor(`#${c.getHexString()}`);
    setSelVisible(selectedMesh.visible);
  }, [selectedMesh?.uuid]); // eslint-disable-line react-hooks/exhaustive-deps

  // -------------------------------------------------
  // Initialize scene-dependent objects (lights) once
  // -------------------------------------------------
  useEffect(() => {
    if (!sceneObj) return;
    ensureLights();
  }, [sceneObj]);

  // -------------------------------------------------
  // Apply changes when UI values change (scene/lights)
  // -------------------------------------------------
  useEffect(() => {
    if (!sceneObj) return;
    applySceneBackground();
  }, [bgHex, bgBrightness, sceneObj, sceneObjects]);

  useEffect(() => {
    if (!sceneObj) return;
    ensureLights();

    const amb = ambientRef.current;
    if (amb) {
      amb.visible = ambientOn;
      amb.color.set(ambientColor);
      amb.intensity = ambientIntensity;
    }
  }, [ambientOn, ambientColor, ambientIntensity, sceneObj]);

  useEffect(() => {
    if (!sceneObj) return;
    ensureLights();

    const dir = dirRef.current;
    if (dir) {
      dir.visible = dirOn;
      dir.color.set(dirColor);
      dir.intensity = dirIntensity;
    }
  }, [dirOn, dirColor, dirIntensity, sceneObj]);

  // -------------------------------------------------
  // Apply selected object changes (immediate)
  // -------------------------------------------------
  const applySelectedObject = (
    patch: Partial<{
      pos: { x: number; y: number; z: number };
      rot: { x: number; y: number; z: number };
      scale: { x: number; y: number; z: number };
      color: string;
      visible: boolean;
    }>
  ) => {
    if (!selectedMesh) return;

    if (patch.pos) {
      selectedMesh.position.set(patch.pos.x, patch.pos.y, patch.pos.z);
      setSelPos(patch.pos);
    }
    if (patch.rot) {
      selectedMesh.rotation.set(patch.rot.x, patch.rot.y, patch.rot.z);
      setSelRot(patch.rot);
    }
    if (patch.scale) {
      selectedMesh.scale.set(patch.scale.x, patch.scale.y, patch.scale.z);
      setSelScale(patch.scale);
    }
    if (patch.color) {
      setMaterialColor(selectedMesh, patch.color);
      setSelColor(patch.color);
    }
    if (typeof patch.visible === "boolean") {
      selectedMesh.visible = patch.visible;
      setSelVisible(patch.visible);
    }
  };

  return (
    <div className="absolute flex flex-col text-secondary max-h-[666px] h-full right-5 top-5 bg-surface w-60 rounded-2xl p-3 text-sm">
      <div className="flex items-center justify-between pb-3 text-xs">
        <div>Logo</div>

        <div className="flex items-center gap-2">
          <span>100%</span>
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

      <div className="overflow-y-auto">
        <div className="pb-3 mt-4">
          <h3 className="mb-3.5">Scene</h3>
          <div className="flex items-center gap-5 text-xs">
            <span>BG Color</span>

            <div className="flex items-center gap-1.5 flex-1 justify-end">
              <span className="bg-gold size-5 rounded-sm" />
              <Input
                type="text"
                value={bgHex}
                onChange={(e) => setBgHex(e.target.value)}
                className="h-6 rounded-sm flex-1 text-xs border-0 bg-borders p-1 focus-visible:ring-[1px] selection:bg-hover/50"
              />
              <Input
                type="text"
                value={String(bgBrightness)}
                onChange={(e) => setBgBrightness(Number(e.target.value || 0))}
                className="h-6 rounded-sm w-10 text-xs border-0 bg-borders p-1 focus-visible:ring-[1px] selection:bg-hover/50"
              />
            </div>
          </div>
        </div>

        <hr className="w-full bg-secondary/40 h-[1px] border-0" />

        {/* LIGHT BLOCK 1 -> Ambient light controls */}
        <div className="mt-4 pb-3 hover:bg-cards/90">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2 flex-1">
              <span className="bg-borders size-6 rounded-sm flex items-center justify-center">
                <Lightbulb size={18} />
              </span>
              <h3>Ambient</h3>
            </div>
            <span>
              <ChevronDown size={14} />
            </span>
          </div>

          <div>
            <div className="grid items-center gap-5 mb-2 grid-cols-7">
              <span className="col-span-2">Enable</span>
              <div className="flex items-center col-span-5 gap-1">
                <Button
                  size="sm"
                  variant="customVariant"
                  className={ambientOn ? "bg-gold/80 h-6" : "h-6"}
                  onClick={() => setAmbientOn(true)}
                >
                  Yes
                </Button>
                <Button
                  size="sm"
                  variant="customVariant"
                  className={!ambientOn ? "bg-gold/80 h-6" : "h-6"}
                  onClick={() => setAmbientOn(false)}
                >
                  No
                </Button>
              </div>
            </div>

            <div className="grid items-center gap-5 mb-2 grid-cols-7">
              <span className="col-span-2">Color</span>
              <div className="col-span-5 items-center flex gap-1">
                <span className="bg-gold size-6 rounded-sm" />
                <Input
                  type="text"
                  value={ambientColor}
                  onChange={(e) => setAmbientColor(e.target.value)}
                  className="h-6 rounded-sm text-xs border-0 bg-borders p-1 focus-visible:ring-[1px] selection:bg-hover/50"
                />
              </div>
            </div>

            <div className="grid items-center gap-5 mb-2 grid-cols-7">
              <span className="col-span-2">Intensity</span>
              <div className="col-span-5 items-center flex gap-1">
                <Input
                  type="text"
                  value={String(ambientIntensity)}
                  onChange={(e) =>
                    setAmbientIntensity(Number(e.target.value || 0))
                  }
                  className="h-6 rounded-sm w-10 text-xs border-0 bg-borders p-1 focus-visible:ring-[1px] selection:bg-hover/50"
                />
                <Slider
                  value={[ambientIntensity]}
                  onValueChange={([v]) => setAmbientIntensity(v)}
                  max={2}
                  step={0.01}
                  className="bg-borders h-6 border-0 rounded-sm"
                />
              </div>
            </div>
          </div>
        </div>

        <hr className="w-full bg-secondary/40 h-[1px] border-0" />

        {/* LIGHT BLOCK 2 -> Directional light controls */}
        <div className="mt-4 pb-3 hover:bg-cards/90">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2 flex-1">
              <span className="bg-borders size-6 rounded-sm flex items-center justify-center">
                <Lightbulb size={18} />
              </span>
              <h3>Directional</h3>
            </div>
            <span>
              <ChevronDown size={14} />
            </span>
          </div>

          <div>
            <div className="grid items-center gap-5 mb-2 grid-cols-7">
              <span className="col-span-2">Enable</span>
              <div className="flex items-center col-span-5 gap-1">
                <Button
                  size="sm"
                  variant="customVariant"
                  className={dirOn ? "bg-gold/80 h-6" : "h-6"}
                  onClick={() => setDirOn(true)}
                >
                  Yes
                </Button>
                <Button
                  size="sm"
                  variant="customVariant"
                  className={!dirOn ? "bg-gold/80 h-6" : "h-6"}
                  onClick={() => setDirOn(false)}
                >
                  No
                </Button>
              </div>
            </div>

            <div className="grid items-center gap-5 mb-2 grid-cols-7">
              <span className="col-span-2">Color</span>
              <div className="col-span-5 items-center flex gap-1">
                <span className="bg-gold size-6 rounded-sm" />
                <Input
                  type="text"
                  value={dirColor}
                  onChange={(e) => setDirColor(e.target.value)}
                  className="h-6 rounded-sm text-xs border-0 bg-borders p-1 focus-visible:ring-[1px] selection:bg-hover/50"
                />
              </div>
            </div>

            <div className="grid items-center gap-5 mb-2 grid-cols-7">
              <span className="col-span-2">Intensity</span>
              <div className="col-span-5 items-center flex gap-1">
                <Input
                  type="text"
                  value={String(dirIntensity)}
                  onChange={(e) => setDirIntensity(Number(e.target.value || 0))}
                  className="h-6 rounded-sm w-10 text-xs border-0 bg-borders p-1 focus-visible:ring-[1px] selection:bg-hover/50"
                />
                <Slider
                  value={[dirIntensity]}
                  onValueChange={([v]) => setDirIntensity(v)}
                  max={2}
                  step={0.01}
                  className="bg-borders h-6 border-0 rounded-sm"
                />
              </div>
            </div>
          </div>
        </div>

        <hr className="w-full bg-secondary/40 h-[1px] border-0" />

        {/* LIGHT BLOCK 3 -> Selected object controls (position/rotation/scale/color/visibility) */}
        <div className="mt-4 pb-3 hover:bg-cards/90">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2 flex-1">
              <span className="bg-borders size-6 rounded-sm flex items-center justify-center">
                <Lightbulb size={18} />
              </span>
              <h3>Selected</h3>
            </div>
            <span>
              <ChevronDown size={14} />
            </span>
          </div>

          <div>
            {/* Visible */}
            <div className="grid items-center gap-5 mb-2 grid-cols-7">
              <span className="col-span-2">Visible</span>
              <div className="flex items-center col-span-5 gap-1">
                <Button
                  size="sm"
                  variant="customVariant"
                  className={selVisible ? "bg-gold/80 h-6" : "h-6"}
                  onClick={() => applySelectedObject({ visible: true })}
                >
                  Yes
                </Button>
                <Button
                  size="sm"
                  variant="customVariant"
                  className={!selVisible ? "bg-gold/80 h-6" : "h-6"}
                  onClick={() => applySelectedObject({ visible: false })}
                >
                  No
                </Button>
              </div>
            </div>

            {/* Color */}
            <div className="grid items-center gap-5 mb-2 grid-cols-7">
              <span className="col-span-2">Color</span>
              <div className="col-span-5 items-center flex gap-1">
                <span className="bg-gold size-6 rounded-sm" />
                <Input
                  type="text"
                  value={selColor}
                  onChange={(e) =>
                    applySelectedObject({ color: e.target.value })
                  }
                  className="h-6 rounded-sm text-xs border-0 bg-borders p-1 focus-visible:ring-[1px] selection:bg-hover/50"
                />
              </div>
            </div>

            {/* Position */}
            <div className="grid items-center gap-5 mb-2 grid-cols-7">
              <span className="col-span-2">Pos (x/y/z)</span>
              <div className="col-span-5 flex gap-1">
                <Input
                  type="text"
                  value={String(selPos.x)}
                  onChange={(e) =>
                    applySelectedObject({
                      pos: { ...selPos, x: Number(e.target.value || 0) },
                    })
                  }
                  className="h-6 rounded-sm w-10 text-xs border-0 bg-borders p-1 focus-visible:ring-[1px] selection:bg-hover/50"
                />
                <Input
                  type="text"
                  value={String(selPos.y)}
                  onChange={(e) =>
                    applySelectedObject({
                      pos: { ...selPos, y: Number(e.target.value || 0) },
                    })
                  }
                  className="h-6 rounded-sm w-10 text-xs border-0 bg-borders p-1 focus-visible:ring-[1px] selection:bg-hover/50"
                />
                <Input
                  type="text"
                  value={String(selPos.z)}
                  onChange={(e) =>
                    applySelectedObject({
                      pos: { ...selPos, z: Number(e.target.value || 0) },
                    })
                  }
                  className="h-6 rounded-sm w-10 text-xs border-0 bg-borders p-1 focus-visible:ring-[1px] selection:bg-hover/50"
                />
              </div>
            </div>

            {/* Rotation */}
            <div className="grid items-center gap-5 mb-2 grid-cols-7">
              <span className="col-span-2">Rot (x/y/z)</span>
              <div className="col-span-5 flex gap-1">
                <Input
                  type="text"
                  value={String(selRot.x)}
                  onChange={(e) =>
                    applySelectedObject({
                      rot: { ...selRot, x: Number(e.target.value || 0) },
                    })
                  }
                  className="h-6 rounded-sm w-10 text-xs border-0 bg-borders p-1 focus-visible:ring-[1px] selection:bg-hover/50"
                />
                <Input
                  type="text"
                  value={String(selRot.y)}
                  onChange={(e) =>
                    applySelectedObject({
                      rot: { ...selRot, y: Number(e.target.value || 0) },
                    })
                  }
                  className="h-6 rounded-sm w-10 text-xs border-0 bg-borders p-1 focus-visible:ring-[1px] selection:bg-hover/50"
                />
                <Input
                  type="text"
                  value={String(selRot.z)}
                  onChange={(e) =>
                    applySelectedObject({
                      rot: { ...selRot, z: Number(e.target.value || 0) },
                    })
                  }
                  className="h-6 rounded-sm w-10 text-xs border-0 bg-borders p-1 focus-visible:ring-[1px] selection:bg-hover/50"
                />
              </div>
            </div>

            {/* Scale */}
            <div className="grid items-center gap-5 mb-2 grid-cols-7">
              <span className="col-span-2">Scale (x/y/z)</span>
              <div className="col-span-5 flex gap-1">
                <Input
                  type="text"
                  value={String(selScale.x)}
                  onChange={(e) =>
                    applySelectedObject({
                      scale: { ...selScale, x: Number(e.target.value || 1) },
                    })
                  }
                  className="h-6 rounded-sm w-10 text-xs border-0 bg-borders p-1 focus-visible:ring-[1px] selection:bg-hover/50"
                />
                <Input
                  type="text"
                  value={String(selScale.y)}
                  onChange={(e) =>
                    applySelectedObject({
                      scale: { ...selScale, y: Number(e.target.value || 1) },
                    })
                  }
                  className="h-6 rounded-sm w-10 text-xs border-0 bg-borders p-1 focus-visible:ring-[1px] selection:bg-hover/50"
                />
                <Input
                  type="text"
                  value={String(selScale.z)}
                  onChange={(e) =>
                    applySelectedObject({
                      scale: { ...selScale, z: Number(e.target.value || 1) },
                    })
                  }
                  className="h-6 rounded-sm w-10 text-xs border-0 bg-borders p-1 focus-visible:ring-[1px] selection:bg-hover/50"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
