import { useEffect, RefObject } from "react";

export const useOutsideClick = (
  isOpen: boolean,
  setIsOpen: (open: boolean) => void,
  swatchRef: RefObject<HTMLElement | null>,
  pickerSelector: string = ".react-colorful"
) => {
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;

      const isSwatch = swatchRef.current?.contains(target);
      const isInsidePicker = target.closest(pickerSelector);

      if (isOpen && !isSwatch && !isInsidePicker) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, setIsOpen, swatchRef, pickerSelector]);
};
