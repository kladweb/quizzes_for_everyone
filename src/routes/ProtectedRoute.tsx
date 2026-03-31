import React, { useEffect } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useIsAuthLoading, useUser } from "../store/useUserStore";
import { loadTokens } from "../store/useTokensStore";

export const ProtectedRoute = () => {
  const user = useUser();
  const isAuthLoading = useIsAuthLoading();

  useEffect(() => {
    if (user?.uid) {
      loadTokens(user.uid);
    }
  }, [user?.uid]);

  if (!user) {
    return <Navigate to="/" replace/>;
  }

  return <Outlet/>;
};
