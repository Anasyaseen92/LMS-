"use client";
import { redirect } from "next/navigation";
import { ReactNode } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";

interface ProtectedProps {
  children: ReactNode;
}

export default function AdminProtected({ children }: ProtectedProps) {
  const { user } = useSelector((state: RootState) => state.auth);
  if (user) {
    const isAdmin = user?.role === "admin";
    return isAdmin ? children : redirect("/");
  }
}
