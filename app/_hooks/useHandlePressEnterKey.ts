import { KeyboardEvent } from "react";
import * as THREE from "three";
import { useHandleChangeColor } from "./useHandleChangeColor";

export function useHandlePressEnterKey() {
  const handleChangeColor = useHandleChangeColor();

  const handlePressEnterKey = (
    e: KeyboardEvent<HTMLInputElement>,
    setColor: (color: string) => void,
    sceneObj?: THREE.Scene | null,
    material?: THREE.Material | THREE.Material[] | null
  ) => {
    if (e.key !== "Enter") return;

    handleChangeColor(e.currentTarget.value, setColor, sceneObj, material);

    e.currentTarget.blur();
  };

  return handlePressEnterKey;
}
