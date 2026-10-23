import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useIsAuthLoaded, useIsAuthLoading, useUser } from "../store/useUserStore";
import { Loader } from "../components/Loader/Loader";

export const ProtectedRoute = () => {
  const user = useUser();
  const isAuthLoading = useIsAuthLoading();
  const isAuthLoaded = useIsAuthLoaded();

  if (isAuthLoading || !isAuthLoaded) {
    return <div className='loader-container'><Loader/></div>;
  }

  if (!user) {
    return <Navigate to="/" replace/>;
  }

  return <Outlet/>;
};
