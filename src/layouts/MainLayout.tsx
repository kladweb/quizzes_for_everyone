import React, { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { Header } from "../components/Header/Header";
import { Footer } from "../components/Footer/Footer";
import { useIsAuthLoading, useUser } from "../store/useUserStore";
import { Loader } from "../components/Loader/Loader";
import { useErrorLoading } from "../store/useQuizzesStore";
import { ToastNotice } from "../components/ToastNotice/ToastNotice";
import { ScrollUp } from "../components/ScroppUp/ScrollUp";
import { loadTokens, useLoadingTokens } from "../store/useTokensStore";

export const MainLayout = () => {
  const isAuthLoading = useIsAuthLoading();
  const navigate = useNavigate();
  const errorLoading = useErrorLoading();
  const user = useUser();
  const loadingTokens = useLoadingTokens();

  useEffect(() => {
    if (user?.uid && loadingTokens) {
      loadTokens(user.uid);
    }
  }, [user?.uid]);

  useEffect(
    () => {
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
        <ToastNotice/>
        <ScrollUp/>
        <div className="dot_lights">
          <div className="dot_light dot_light_1"></div>
          <div className="dot_light dot_light_2"></div>
        </div>
      </main>
      <Footer/>
    </>
  );
};
