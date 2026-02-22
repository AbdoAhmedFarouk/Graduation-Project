"use client";

import * as THREE from "three";

import { useState } from "react";
import { useShallow } from "zustand/shallow";

import { Button } from "@/app/_components/ui/button";
import { Input } from "@/app/_components/ui/input";

import {
  GEOMETRIES_2D,
  GEOMETRIES_3D,
} from "@/app/_Editor/Creation/sceneGeometries";
import { cn } from "@/app/_lib/utils";
import { useSceneStore } from "@/app/_store/store";
import {
  ArrowLeft,
  Menu,
  Search,
  Square,
  Eye,
  EyeOff,
  Lock,
  LockOpen,
} from "lucide-react";

// import { postImage } from "@/app/_lib/actions";
// const initialState = {
//   image: "",
//   success: true,
// };

export default function LeftSidebar() {
  const [search, setSearch] = useState("");
  // const [formState, formAction] = useActionState(postImage, initialState);
  // console.log(formState);

  const {
    sceneObjects,
    hoveredObjectId,
    selectedGeometry,
    setHoveredObjectId,
    setSelectedGeometry,
    setUpdateObjectName,
    setGeometryVisibility,
    setGeometryLocked,
  } = useSceneStore(
    useShallow((state) => ({
      sceneObjects: state.sceneObjects,
      hoveredObjectId: state.hoveredObjectId,
      selectedGeometry: state.selectedGeometry,
      setHoveredObjectId: state.setHoveredObjectId,
      setSelectedGeometry: state.setSelectedGeometry,
      setUpdateObjectName: state.setUpdateObjectName,
      setGeometryVisibility: state.setGeometryVisibility,
      setGeometryLocked: state.setGeometryLocked,
    })),
  );

  const handleGeometryHover = (id: string) => {
    setHoveredObjectId(id);
  };

  const handleGeometryLeave = () => {
    setHoveredObjectId(null);
  };

  const handleToggleVisibility = (
    e: React.MouseEvent<HTMLSpanElement>,
    objId: string,
  ) => {
    e.stopPropagation();
    const obj = sceneObjects.find((o) => o.uuid === objId);
    if (obj) {
      const newVisibility = obj.userData.isVisible !== false ? false : true;
      setGeometryVisibility(objId, newVisibility);
    }
  };

  const handleToggleLock = (
    e: React.MouseEvent<HTMLSpanElement>,
    objId: string,
  ) => {
    e.stopPropagation();
    const obj = sceneObjects.find((o) => o.uuid === objId);
    if (obj) {
      const newLockState = !obj.userData.isLocked;
      setGeometryLocked(objId, newLockState);
    }
  };

  const handleSearch = (value: string) => {
    setSearch(value);
  };

  const handleChangeGeometryName = (
    e: React.MouseEvent<HTMLLIElement>,
    objId: string,
  ) => {
    const li = e.currentTarget;
    const span = li.querySelector(
      "div:first-of-type span:last-child",
    ) as HTMLSpanElement;

    const parent = span?.parentElement;
    if (!parent) return;

    const currentName = span.textContent || "";
    const input = document.createElement("input");
    input.type = "text";
    input.value = currentName;
    input.className =
      "px-1 rounded-xs bg-transparent text-secondary outline-none w-full";

    input.onblur = () => {
      const newName = input.value;
      if (input.parentNode === parent) {
        parent.replaceChild(span, input);
        span.textContent = newName;
        setUpdateObjectName(objId, newName);
      }
    };

    input.onkeydown = (event) => {
      if (event.key === "Enter") input.blur();
    };

    parent.replaceChild(input, span);
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

      {/* <form
        className="flex flex-col items-center gap-4 w-full mt-4 pb-3"
        action={formAction}
      >
        <div className="flex gap-4">
          <Button variant="customVariant">Objects</Button>
          <Button variant="customVariant">Assets</Button>
        </div>

        <input
          type="file"
          name="images"
          id="image"
          multiple={true}
          onChange={(e) => e.target.form?.requestSubmit()}
        />

        {formState.image && (
          <div className="mt-2 w-full aspect-video rounded-lg overflow-hidden border border-borders">
            <img
              src={formState.image}
              alt="Uploaded"
              className="w-full h-full object-cover"
            />
          </div>
        )}
      </form> */}

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
              const geometryType = (obj as THREE.Mesh).geometry?.userData?.type;
              const displayName = obj.userData?.type || geometryType;

              const Icon =
                GEOMETRIES_2D.find((g) => g.geometry === geometryType) ||
                GEOMETRIES_3D.find((g) => g.geometry === geometryType);
              const IconComp = Icon ? Icon.icon : Square;

              return (
                <li
                  className={cn(
                    "relative before:absolute before:left-0 before:top-0 before:bg-secondary/50 before:h-3/5 before:w-[1px] ps-4 after:absolute after:left-[1px] after:bg-secondary/50 after:w-2 after:h-[1px] after:top-3/5 flex items-center justify-between hover:bg-borders focus:bg-borders focus:outline-none",
                    {
                      "bg-borders":
                        hoveredObjectId === obj.uuid ||
                        selectedGeometry?.uuid === obj.uuid,
                    },
                  )}
                  key={obj.uuid}
                  onMouseEnter={() => handleGeometryHover(obj.uuid)}
                  onMouseLeave={handleGeometryLeave}
                  onClick={(e) => {
                    e.currentTarget.focus();
                    setSelectedGeometry(obj);
                  }}
                  onDoubleClick={(e) => handleChangeGeometryName(e, obj.uuid)}
                >
                  <div className="flex items-center gap-3">
                    <span>
                      <IconComp size={20} className="mt-0.5" />
                    </span>
                    <span>{displayName}</span>
                  </div>
                  <div className="flex items-center gap-2 pe-2">
                    <span
                      onClick={(e) => handleToggleVisibility(e, obj.uuid)}
                      className="cursor-pointer hover:text-secondary transition-colors"
                    >
                      {obj.userData.isVisible !== false ? (
                        <Eye size={14} />
                      ) : (
                        <EyeOff size={14} />
                      )}
                    </span>
                    <span
                      onClick={(e) => handleToggleLock(e, obj.uuid)}
                      className="cursor-pointer hover:text-secondary transition-colors"
                    >
                      {obj.userData.isLocked ? (
                        <Lock size={14} />
                      ) : (
                        <LockOpen size={14} />
                      )}
                    </span>
                  </div>
                </li>
              );
            })}
        </ul>
      </div>
    </div>
  );
}
