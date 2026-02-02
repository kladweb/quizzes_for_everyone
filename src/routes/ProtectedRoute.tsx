import {Navigate, Outlet} from "react-router-dom";
import {useUser} from "../store/useUserStore";

export const ProtectedRoute = () => {
  const user = useUser();

  if (!user) {
    return <Navigate to="/" replace/>;
  }

  return <Outlet/>;
};