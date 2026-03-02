import React from "react";
import { Route, Routes } from "react-router-dom";
import { MainLayout } from "../layouts/MainLayout";
import { ProtectedRoute } from "./ProtectedRoute";
import { PageMyQuizzes } from "../pages/PageMyQuizzes/PageMyQuizzes";
import { PageQuiz } from "../pages/PageQuiz/PageQuiz";
import { PageMain } from "../pages/PageMain/PageMain";
import { PageCreateQuiz } from "../pages/PageCreateQuiz/PageCreateQuiz";
import { PageEmpty } from "../pages/PageEmpty/PageEmpty";
import { PageCreateQuizJson } from "../pages/PageCreateQuizJson/PageCreateQuizJson";
import { PageAllQuizzes } from "../pages/PageAllQuizzes/PageAllQuizzes";
import { PageCreateQuizManual } from "../pages/PageCreateQuizManual/PageCreateQuizManual";
import { PageQuizEdit } from "../pages/PageQuizEdit/PageQuizEdit";

export const AppRoutes = () => {
  return (
    <Routes>
      <Route element={<MainLayout/>}>
        <Route path="/" element={<PageMain/>}/>

        <Route element={<ProtectedRoute/>}>
          <Route path="/createquiz" element={<PageCreateQuiz/>}/>
          <Route path="/createquiz/json" element={<PageCreateQuizJson/>}/>
          <Route path="/createquiz/manual" element={<PageCreateQuizManual/>}/>
          <Route path="/createquiz/manual/:testid" element={<PageQuizEdit/>}/>
          <Route path="/createquiz/ai" element={<PageEmpty emptyReason="pageDevelopment"/>}/>
          <Route path="/myquizzes" element={<PageMyQuizzes/>}/>
        </Route>

        <Route path="/allquizzes" element={<PageAllQuizzes/>}/>
        <Route path="/quizzes/:testid" element={<PageQuiz/>}/>
        <Route path="/service" element={<PageEmpty emptyReason="serviceWork"/>}/>
      </Route>
    </Routes>
  )
}
