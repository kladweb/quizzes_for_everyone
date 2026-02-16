import { useEffect } from "react";
import { BrowserRouter } from "react-router-dom";
import { AppRoutes } from "./routes/AppRoutes";
import { initUser } from "./store/useUserStore";
import "./styles/main.css";

function App() {

  useEffect(
    () => {
      initUser();
    }, []);

  return (
    <BrowserRouter>
      <AppRoutes/>
    </BrowserRouter>
  )
}

export default App;
