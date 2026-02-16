import React, { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { Header } from "../components/Header/Header";
import { Footer } from "../components/Footer/Footer";
import { useIsAuthLoading } from "../store/useUserStore";
import { Loader } from "../components/Loader/Loader";
import { useErrorLoading } from "../store/useQuizzesStore";

export const MainLayout = () => {
  const isAuthLoading = useIsAuthLoading();
  const navigate = useNavigate();
  const errorLoading = useErrorLoading();

  useEffect(
    () => {
      console.log(errorLoading);
      if (errorLoading !== "") {
        navigate("/service");
      } else {
        if (location.pathname === "/service") {
          navigate("/");
        }
      }
    }, [errorLoading]);

  return (
    <>
      <Header/>
      <main className="main">
        {isAuthLoading ?
          <div className='loader-container'><Loader/></div> :
          <Outlet/>
        }
      </main>
      <Footer/>
    </>
  );
};
