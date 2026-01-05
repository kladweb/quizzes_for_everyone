import { BrowserRouter } from "react-router-dom";
import { PagesRouter } from "./router/PagesRouter";
import { Header } from "./components/Header/Header";
import { Footer } from "./components/Footer/Footer";
import "./styles/main.css";

function App() {

  return (
    <BrowserRouter>
        <Header/>
          <PagesRouter/>
        <Footer/>
    </BrowserRouter>
  )
}

export default App;
