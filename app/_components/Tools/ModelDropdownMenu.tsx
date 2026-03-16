"use client";

import { useState, useRef, useEffect, ReactNode } from "react";
import { Upload } from "lucide-react";
import { useSceneStore } from "@/app/_store/store";
import { loadModelFromFile } from "@/app/_Editor/Creation/ModelLoader";

interface Props {
  children: ReactNode;
}

export default function ModelDropdownMenu({ children }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    sceneObj,
    setAddObjectsToScene,
    setSelectedGeometry,
    setIsTransformControlsActive,
  } = useSceneStore();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const model = await loadModelFromFile(file);

      model.name = file.name;

      model.userData = {
        type: model.name,
        isVisible: true,
        isLocked: false,
        originalName: file.name,
      };

      if (sceneObj) {
        sceneObj.add(model);
      }

      setAddObjectsToScene(model);
      setIsTransformControlsActive(true);
      setSelectedGeometry(model);

      setIsOpen(false);

      event.target.value = "";
    } catch (error) {
      console.error("Failed to load local model:", error);
    }
  };

  return (
    <div ref={dropdownRef} className="relative h-full flex items-center">
      <div
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
        className="h-full flex items-center cursor-pointer"
      >
        {children}
      </div>

      {isOpen && (
        <div className="bg-surface absolute left-0 text-secondary/80 top-[calc(100%+15px)] p-2 rounded-md min-w-[180px] z-50 shadow-lg border border-borders/50">
          <ul>
            <li
              onClick={(e) => {
                e.stopPropagation();
                fileInputRef.current?.click();
              }}
              className="flex items-center gap-3 text-sm hover:bg-borders p-2 rounded-md cursor-pointer transition-colors"
            >
              <Upload size={18} />
              <span>Upload Model</span>
            </li>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept=".glb,.gltf"
              className="hidden"
            />
          </ul>
        </div>
      )}
    </div>
  );
}
