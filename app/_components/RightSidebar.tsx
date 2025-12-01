import { ChevronDown, Lightbulb } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Slider } from "./ui/slider";

export default function RightSidebar() {
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
                className="h-6 rounded-sm flex-1 text-xs border-0 bg-borders p-1 focus-visible:ring-[1px] selection:bg-hover/50"
              />
              <Input
                type="text"
                className="h-6 rounded-sm w-10 text-xs border-0 bg-borders p-1 focus-visible:ring-[1px] selection:bg-hover/50"
              />
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
