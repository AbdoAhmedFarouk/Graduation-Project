"use client";

import * as THREE from "three";

import { useShallow } from "zustand/shallow";
import { useSceneStore } from "../_store/store";

import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Slider } from "./ui/slider";

import { ChevronDown, Lightbulb } from "lucide-react";
import { useEffect } from "react";

export default function RightSidebar() {
  const { sceneObj, sceneBg, selectedGeometry, sceneObjects, setSceneBg } =
    useSceneStore(
      useShallow((state) => ({
        sceneObj: state.sceneObj,
        sceneBg: state.sceneBg,
        selectedGeometry: state.selectedGeometry,
        sceneObjects: state.sceneObjects,
        setSceneBg: state.setSceneBg,
      }))
    );

  // console.log(sceneObj);
  // console.log(sceneObj?.background);

  const handleInput = (colorString: string) => {
    // Remove any "#" just in case
    const clean = colorString.replace("#", "").toLowerCase();

    // If no input → restore scene background
    if (clean.length === 0) {
      if (sceneObj?.background instanceof THREE.Color) {
        setSceneBg(sceneObj.background.getHexString());
      }
      return;
    }

    // If input is exactly 6 → valid full hex
    if (clean.length === 6) {
      sceneObj!.background = new THREE.Color(`#${clean}`);
      setSceneBg(clean);
      return;
    }

    // If input is exactly 3 → expand (abc → aabbcc)
    if (clean.length === 3) {
      const expanded =
        clean[0] + clean[0] + clean[1] + clean[1] + clean[2] + clean[2];

      sceneObj!.background = new THREE.Color(`#${expanded}`);
      setSceneBg(expanded);
      return;
    }

    // If input length is invalid (<3 or between 4-5)
    // → restore original scene bg, do NOT update scene
    if (sceneObj?.background instanceof THREE.Color) {
      setSceneBg(sceneObj.background.getHexString());
    }
  };

  //   // if (!/^#?([0-9A-F]{6})$/i.test(colorString)) {
  //   //   console.log("wrong one");
  //   // }
  // };

  useEffect(() => {
    if (!sceneObj) return;
    setSceneBg(sceneBg);
  }, [sceneObj, sceneBg, setSceneBg]);

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
              <input
                type="color"
                value={`#${sceneBg}`}
                onChange={(e) => setSceneBg(e.target.value.slice(1))}
                className="size-5 rounded-sm"
              />
              <Input
                type="text"
                value={sceneBg}
                onChange={(e) => setSceneBg(e.target.value)}
                onBlur={(e) => handleInput(e.target.value)}
                className="h-6 rounded-sm flex-1 text-xs border-0 bg-borders p-1 focus-visible:ring-[1px] selection:bg-hover/50"
              />

              {/* <Input
                type="text"
                className="h-6 rounded-sm w-10 text-xs border-0 bg-borders p-1 focus-visible:ring-[1px] selection:bg-hover/50"
              /> */}
            </div>
          </div>
        </div>

        <hr className="w-full bg-secondary/40 h-[1px] border-0" />

        <div className="mt-4 pb-3 hover:bg-cards/90">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2 flex-1">
              <span className="bg-borders size-6 rounded-sm flex items-center justify-center">
                <Lightbulb size={18} />
              </span>
              <h3>Light</h3>
            </div>

            <span>
              <ChevronDown size={14} />
            </span>
          </div>

          <div>
            <div className="grid items-center gap-5 mb-2 grid-cols-7">
              <span className="col-span-2">Ambient</span>
              <div className="flex items-center col-span-5 gap-1">
                <Button
                  size="sm"
                  variant="customVariant"
                  className="bg-gold/80 h-6"
                >
                  Yes
                </Button>
                <Button size="sm" variant="customVariant" className="h-6">
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
                  className="h-6 rounded-sm text-xs border-0 bg-borders p-1 focus-visible:ring-[1px] selection:bg-hover/50"
                />
              </div>
            </div>

            <div className="grid items-center gap-5 mb-2 grid-cols-7">
              <span className="col-span-2">Intensity</span>
              <div className="col-span-5 items-center flex gap-1">
                <Input
                  type="text"
                  className="h-6 rounded-sm w-10 text-xs border-0 bg-borders p-1 focus-visible:ring-[1px] selection:bg-hover/50"
                />
                <Slider
                  defaultValue={[50]}
                  max={100}
                  step={1}
                  className="bg-borders h-6 border-0 rounded-sm"
                />
              </div>
            </div>
          </div>
        </div>

        <hr className="w-full bg-secondary/40 h-[1px] border-0" />

        <div className="mt-4 pb-3 hover:bg-cards/90">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2 flex-1">
              <span className="bg-borders size-6 rounded-sm flex items-center justify-center">
                <Lightbulb size={18} />
              </span>
              <h3>Light</h3>
            </div>

            <span>
              <ChevronDown size={14} />
            </span>
          </div>

          <div>
            <div className="grid items-center gap-5 mb-2 grid-cols-7">
              <span className="col-span-2">Ambient</span>
              <div className="flex items-center col-span-5 gap-1">
                <Button
                  size="sm"
                  variant="customVariant"
                  className="bg-gold/80 h-6"
                >
                  Yes
                </Button>
                <Button size="sm" variant="customVariant" className="h-6">
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
                  className="h-6 rounded-sm text-xs border-0 bg-borders p-1 focus-visible:ring-[1px] selection:bg-hover/50"
                />
              </div>
            </div>

            <div className="grid items-center gap-5 mb-2 grid-cols-7">
              <span className="col-span-2">Intensity</span>
              <div className="col-span-5 items-center flex gap-1">
                <Input
                  type="text"
                  className="h-6 rounded-sm w-10 text-xs border-0 bg-borders p-1 focus-visible:ring-[1px] selection:bg-hover/50"
                />
                <Slider
                  defaultValue={[50]}
                  max={100}
                  step={1}
                  className="bg-borders h-6 border-0 rounded-sm"
                />
              </div>
            </div>
          </div>
        </div>

        <hr className="w-full bg-secondary/40 h-[1px] border-0" />

        <div className="mt-4 pb-3 hover:bg-cards/90">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2 flex-1">
              <span className="bg-borders size-6 rounded-sm flex items-center justify-center">
                <Lightbulb size={18} />
              </span>
              <h3>Light</h3>
            </div>

            <span>
              <ChevronDown size={14} />
            </span>
          </div>

          <div>
            <div className="grid items-center gap-5 mb-2 grid-cols-7">
              <span className="col-span-2">Ambient</span>
              <div className="flex items-center col-span-5 gap-1">
                <Button
                  size="sm"
                  variant="customVariant"
                  className="bg-gold/80 h-6"
                >
                  Yes
                </Button>
                <Button size="sm" variant="customVariant" className="h-6">
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
                  className="h-6 rounded-sm text-xs border-0 bg-borders p-1 focus-visible:ring-[1px] selection:bg-hover/50"
                />
              </div>
            </div>

            <div className="grid items-center gap-5 mb-2 grid-cols-7">
              <span className="col-span-2">Intensity</span>
              <div className="col-span-5 items-center flex gap-1">
                <Input
                  type="text"
                  className="h-6 rounded-sm w-10 text-xs border-0 bg-borders p-1 focus-visible:ring-[1px] selection:bg-hover/50"
                />
                <Slider
                  defaultValue={[50]}
                  max={100}
                  step={1}
                  className="bg-borders h-6 border-0 rounded-sm"
                />
              </div>
            </div>
          </div>
        </div>

        <hr className="w-full bg-secondary/40 h-[1px] border-0" />

        <div className="mt-4 pb-3 hover:bg-cards/90">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2 flex-1">
              <span className="bg-borders size-6 rounded-sm flex items-center justify-center">
                <Lightbulb size={18} />
              </span>
              <h3>Light</h3>
            </div>

            <span>
              <ChevronDown size={14} />
            </span>
          </div>

          <div>
            <div className="grid items-center gap-5 mb-2 grid-cols-7">
              <span className="col-span-2">Ambient</span>
              <div className="flex items-center col-span-5 gap-1">
                <Button
                  size="sm"
                  variant="customVariant"
                  className="bg-gold/80 h-6"
                >
                  Yes
                </Button>
                <Button size="sm" variant="customVariant" className="h-6">
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
                  className="h-6 rounded-sm text-xs border-0 bg-borders p-1 focus-visible:ring-[1px] selection:bg-hover/50"
                />
              </div>
            </div>

            <div className="grid items-center gap-5 mb-2 grid-cols-7">
              <span className="col-span-2">Intensity</span>
              <div className="col-span-5 items-center flex gap-1">
                <Input
                  type="text"
                  className="h-6 rounded-sm w-10 text-xs border-0 bg-borders p-1 focus-visible:ring-[1px] selection:bg-hover/50"
                />
                <Slider
                  defaultValue={[50]}
                  max={100}
                  step={1}
                  className="bg-borders h-6 border-0 rounded-sm"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
