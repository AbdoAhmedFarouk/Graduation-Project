import { SetStateAction } from "react";

export const useToggleState = () => {
  const handleToggle = (
    state: boolean,
    setState: (value: SetStateAction<boolean>) => void,
    e?: React.MouseEvent<HTMLSpanElement>
  ) => {
    e?.stopPropagation();
    setState(!state);
  };

  return handleToggle;
};
