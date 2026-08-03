import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { Page404 } from "../pages/Page404/Page404";
import { useIsAuthLoading, useRole, useUser } from "../store/useUserStore";
import { Loader } from "../components/Loader/Loader";

export const ProtectedRouteAdmin = () => {
  const user = useUser();
  const role = useRole();
  const isAuthLoading = useIsAuthLoading();

  if (isAuthLoading || !role) {
    return <div className='loader-container'><Loader/></div>;
  }

  if (role !== "admin") {
    return <Page404/>;
  }

  if (!user) {
    return <Navigate to="/" replace/>;
  }

  return <Outlet/>;
};
