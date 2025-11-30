import { Route, Routes } from "react-router-dom";
// import { PageTests } from "../pages/PageTests";
import { PageMain } from "../pages/PageMain/PageMain";
import { PageQuiz } from "../pages/PageQuiz/PageQuiz";


export const PagesRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<PageMain/>}/>
      {/*<Route path="/tests" element={<PageTests/>}/>*/}
      <Route path="/tests/:testid" element={<PageQuiz/>}/>
    </Routes>
  )
}
