import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { Loader } from "../components/Loader/Loader";
import { useIsAuthLoading, useUser } from "../store/useUserStore";

export const ProtectedRoute = () => {
  const user = useUser();
  const isAuthLoading = useIsAuthLoading();

  if (isAuthLoading) {
    return <div className='loader-container'><Loader/></div>
  }

  if (!user) {
    return <Navigate to="/" replace/>;
  }

  return <Outlet/>;
};
