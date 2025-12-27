import * as THREE from "three";
import { getSingleMaterial } from "../_lib/utils";

type MaterialWithColor =
  | THREE.MeshBasicMaterial
  | THREE.MeshLambertMaterial
  | THREE.MeshPhongMaterial
  | THREE.MeshStandardMaterial
  | THREE.MeshPhysicalMaterial;

export function useHandleChangeColor() {
  const handleChangeColor = (
    colorString: string,
    setColor: (color: string) => void,
    sceneObj?: THREE.Scene | null,
    material?: THREE.Material | THREE.Material[] | null
  ) => {
    const clean = colorString.replace("#", "").toLowerCase();

    const singleMaterial = getSingleMaterial(material);

    if (clean.length === 0) {
      if (sceneObj?.background instanceof THREE.Color) {
        setColor(sceneObj.background.getHexString());
      } else if (
        singleMaterial &&
        "color" in singleMaterial &&
        singleMaterial.color instanceof THREE.Color
      ) {
        setColor(singleMaterial.color.getHexString());
      }
      return;
    }

    if (clean.length === 6) {
      if (sceneObj) {
        sceneObj.background = new THREE.Color(`#${clean}`);
      } else if (singleMaterial && "color" in singleMaterial) {
        (singleMaterial as MaterialWithColor).color.set(`#${clean}`);
      }
      setColor(clean);
      return;
    }

    if (clean.length === 3) {
      const expanded =
        clean[0] + clean[0] + clean[1] + clean[1] + clean[2] + clean[2];
      if (sceneObj) {
        sceneObj.background = new THREE.Color(`#${expanded}`);
      } else if (singleMaterial && "color" in singleMaterial) {
        (singleMaterial as MaterialWithColor).color.set(`#${expanded}`);
      }
      setColor(expanded);
      return;
    }

    if (sceneObj?.background instanceof THREE.Color) {
      setColor(sceneObj.background.getHexString());
    } else if (
      singleMaterial &&
      "color" in singleMaterial &&
      singleMaterial.color instanceof THREE.Color
    ) {
      setColor(singleMaterial.color.getHexString());
    }
  };

  return handleChangeColor;
}
