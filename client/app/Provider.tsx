"use client";

import { useEffect } from "react";
import { Provider } from "react-redux";
import { store, initializeApp } from "../redux/store";

export default function ReduxProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    initializeApp();
  }, []);

  return <Provider store={store}>{children}</Provider>;
}