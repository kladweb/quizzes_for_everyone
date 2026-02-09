import { Outlet } from "react-router-dom";
import { Header } from "../components/Header/Header";
import { Footer } from "../components/Footer/Footer";
import { useIsAuthLoading } from "../store/useUserStore";
import { Loader } from "../components/Loader/Loader";
import React from "react";
import { ModalConfirm } from "../components/ModalConfirm/ModalConfirm";

export const MainLayout = () => {
  const isAuthLoading = useIsAuthLoading();

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
