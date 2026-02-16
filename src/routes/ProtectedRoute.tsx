import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useIsAuthLoading, useUser } from "../store/useUserStore";

export const ProtectedRoute = () => {
  const user = useUser();
  const isAuthLoading = useIsAuthLoading();

  if (!user) {
    return <Navigate to="/" replace/>;
  }

  return <Outlet/>;
};
