import { BrowserRouter } from "react-router-dom";
import { PagesRouter } from "./router/PagesRouter";
import { Header } from "./components/Header/Header";

function App() {

  return (
    <BrowserRouter>
      <Header/>
      <PagesRouter/>
    </BrowserRouter>
  )
}

export default App;
