import { Outlet } from "react-router-dom";
import { Header } from "../components/Header/Header";
import { Footer } from "../components/Footer/Footer";

export const MainLayout = () => {
  return (
    <>
      <Header/>
      <main className="main">
        <Outlet/>
      </main>
      <Footer/>
    </>
  );
};
