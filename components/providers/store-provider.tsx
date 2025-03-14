"use client";

import { store } from "@/store/store";
import React from "react";
import { Provider } from "react-redux";

export function StoreProvider({ children }: { children: React.ReactNode }) {
  return <Provider store={store}>{children}</Provider>;
}
