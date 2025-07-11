"use client";

import * as React from "react";
import {
  ThemeProvider as NextThemesProvider,
  type ThemeProviderProps,
} from "next-themes";

type CustomThemeProviderProps = ThemeProviderProps & {
  children: React.ReactNode;
};

export function ThemeProvider({
  children,
  ...props
}: CustomThemeProviderProps) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}
