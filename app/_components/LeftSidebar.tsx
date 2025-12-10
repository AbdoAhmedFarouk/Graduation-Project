"use client";

import { useState } from "react";
import { useShallow } from "zustand/shallow";
import { useSceneStore } from "../_store/store";

import { Button } from "@/app/_components/ui/button";
import { Input } from "@/app/_components/ui/input";

import { ArrowLeft, Menu, Search, Square } from "lucide-react";
import { cn } from "../_lib/utils";
import { GEOMETRIES_2D, GEOMETRIES_3D } from "../_validators/sceneGeometries";

export default function LeftSidebar() {
  const [search, setSearch] = useState("");
  const {
    sceneObj,
    sceneObjects,
    hoveredObjectId,
    setHoveredObjectId,
    setUpdateObjectName,
  } = useSceneStore(
    useShallow((state) => ({
      sceneObj: state.sceneObj,
      sceneObjects: state.sceneObjects,
      hoveredObjectId: state.hoveredObjectId,
      setHoveredObjectId: state.setHoveredObjectId,
      setUpdateObjectName: state.setUpdateObjectName,
    }))
  );

  // console.log(sceneObj);

  const handleGeometryHover = (id: string) => {
    setHoveredObjectId(id);
  };

  const handleGeometryLeave = () => {
    setHoveredObjectId(null);
  };

  const handleSearch = (value: string) => {
    setSearch(value);
  };

  const handleChangeGeometryName = (
    e: React.MouseEvent<HTMLLIElement>,
    objId: string
  ) => {
    const li = e.currentTarget;
    const span = li.querySelector("span:last-child") as HTMLSpanElement;
    const currentName = span.textContent || "";

    const input = document.createElement("input");
    input.type = "text";
    input.value = currentName;
    input.className = "px-1 rounded-xs";

    input.onfocus = () => {
      input.className =
        "px-1 focus-visible:outline focus-visible:outline-gold rounded-xs";
    };

    input.onblur = () => {
      const newName = input.value;
      span.textContent = newName;
      li.replaceChild(span, input);
      setUpdateObjectName(objId, newName);
    };

    li.replaceChild(input, span);
    input.focus();
  };

  return (
    <div className="absolute flex flex-col text-secondary max-h-[666px] h-full left-5 top-5 bg-surface w-60 rounded-2xl p-3">
      <div className="flex items-center justify-between text-sm pb-3">
        <div className="flex items-center gap-2">
          <span className="hover:text-secondary text-secondary/50">
            <ArrowLeft size={16} />
          </span>
          <p>Untitled</p>
        </div>

        <span className="hover:text-secondary text-secondary/50">
          <Menu size={18} />
        </span>
      </div>

      <hr className="w-full bg-secondary/40 h-[1px] border-0" />

      <div className="flex items-center justify-center gap-4 w-full mt-4 pb-3">
        <Button variant="customVariant">Objects</Button>
        <Button variant="customVariant">Assets</Button>
      </div>

      <hr className="w-full bg-secondary/40 h-[1px] border-0" />

      <div className="mt-4 text-secondary flex flex-col flex-1 overflow-hidden">
        <div className="relative">
          <Input
            className="border-0 bg-borders ps-10 focus-visible:ring-0 selection:bg-hover/50"
            placeholder="Search"
            onChange={(e) => handleSearch(e.target.value)}
          />
          <span className="absolute left-2 top-1/2 -translate-y-1/2">
            <Search size={16} />
          </span>
        </div>

        <ul className="mt-4 text-secondary/80 text-sm *:not-last:before:h-full *:p-1 flex-1 overflow-y-auto">
          {sceneObjects
            .filter((obj) => {
              const name = obj.userData?.type || "";
              return (
                search.length === 0 ||
                name.toLowerCase().includes(search.toLowerCase())
              );
            })
            .map((obj) => {
              const geometryType = obj.geometry.userData.type;
              const displayName = obj.userData?.type || geometryType;

              const Icon =
                GEOMETRIES_2D.find((g) => g.geometry === geometryType) ||
                GEOMETRIES_3D.find((g) => g.geometry === geometryType);
              const IconComp = Icon ? Icon.icon : Square;

              // dont forget eye and lock for the geometries --later

              return (
                <li
                  className={cn(
                    "relative before:absolute before:left-0 before:top-0 before:bg-secondary/50 before:h-3/5 before:w-[1px] ps-4 after:absolute after:left-[1px] after:bg-secondary/50 after:w-2 after:h-[1px] after:top-3/5 flex items-center gap-3 hover:bg-borders",
                    { "bg-borders": hoveredObjectId === obj.uuid }
                  )}
                  key={obj.uuid}
                  onMouseEnter={() => handleGeometryHover(obj.uuid)}
                  onMouseLeave={handleGeometryLeave}
                  onDoubleClick={(e) => handleChangeGeometryName(e, obj.uuid)}
                >
                  <span>
                    <IconComp size={20} className="mt-0.5" />
                  </span>
                  <span>{displayName}</span>
                </li>
              );
            })}
        </ul>
      </div>
    </div>
  );
}
