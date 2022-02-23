import React, { createContext, Dispatch, useState } from "react";

interface ColorModeContextProps {
  colorMode: string;
  setColorMode: Dispatch<string>;
}

export const colors = {
  LIGHT: "LIGHT",
  DARK: "DARK",
};

export const ColorContext = createContext<ColorModeContextProps | null>(null);

const ColorProvider = (props: any) => {
  const [colorMode, setColorMode] = useState<string>(colors.LIGHT);

  const data = { colorMode, setColorMode };

  return (
    <ColorContext.Provider value={data}>{props.children}</ColorContext.Provider>
  );
};

export default ColorProvider;
