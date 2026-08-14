import React, { Suspense, useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { Header } from "../components/Header/Header";
import { Footer } from "../components/Footer/Footer";
import { Loader } from "../components/Loader/Loader";
import { ToastNotice } from "../components/ToastNotice/ToastNotice";
import { ScrollUp } from "../components/ScrollUp/ScrollUp";
import { useErrorLoading } from "../store/useQuizzesStore";
import { useUser } from "../store/useUserStore";
import { loadTokens, useLoadingTokens } from "../store/useTokensStore";
import { ModalInfo } from "../components/Modals/ModalInfo";

export const MainLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const errorLoading = useErrorLoading();
  const user = useUser();
  const loadingTokens = useLoadingTokens();
  const [isModalInfoOpen, setIsModalInfoOpen] = React.useState(false);

  const handlerClose = () => {
    setIsModalInfoOpen(prev => !prev);
  }

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
      <Header handlerClose={handlerClose}/>
      <main className="main">
        <Suspense fallback={<div className="loader-container"><Loader/></div>}>
          <Outlet/>
        </Suspense>
        <ToastNotice/>
        <ScrollUp/>
        <div className="dot_lights">
          <div className="dot_light dot_light_1"></div>
          <div className="dot_light dot_light_2"></div>
        </div>
      </main>
      <ModalInfo
        isModalInfoOpen={isModalInfoOpen}
        modalInfo="Токены обновляются через 24 часа. Для получения дополнительных токенов пишите на почту:
        easywebapp-anyquiz@yahoo.com
        На указзанную почту также пишите по любым другим вопросам.
        Мы обязательно свяжемся с вами!"
        handlerClose={handlerClose}
      />
      <Footer/>
    </>
  );
};
