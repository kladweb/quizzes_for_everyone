import React, { lazy } from "react";
import { Route, Routes } from "react-router-dom";
import { MainLayout } from "../layouts/MainLayout";
import { ProtectedRoute } from "./ProtectedRoute";
import { PageQuiz } from "../pages/PageQuiz/PageQuiz";
import { PageMain } from "../pages/PageMain/PageMain";
import { PageAllQuizzes } from "../pages/PageAllQuizzes/PageAllQuizzes";
import { PageEmpty } from "../pages/PageEmpty/PageEmpty";
import { Page404 } from "../pages/Page404/Page404";

const PageCreateQuiz = lazy(() => import ("../pages/PageCreateQuiz/PageCreateQuiz")
  .then((module) => ({default: module.PageCreateQuiz})));

const PageCreateQuizJson = lazy(() => import ("../pages/PageCreateQuizJson/PageCreateQuizJson")
  .then((module) => ({default: module.PageCreateQuizJson})));

const PageCreateQuizManual = lazy(() => import ("../pages/PageCreateQuizManual/PageCreateQuizManual")
  .then((module) => ({default: module.PageCreateQuizManual})));

const PageQuizEdit = lazy(() => import ("../pages/PageQuizEdit/PageQuizEdit")
  .then((module) => ({default: module.PageQuizEdit})));

const PageCreateQuizAI = lazy(() => import ("../pages/PageCreateQuizAI/PageCreateQuizAI")
  .then((module) => ({default: module.PageCreateQuizAI})));

const PageMyQuizzes = lazy(() => import ("../pages/PageMyQuizzes/PageMyQuizzes")
  .then((module) => ({default: module.PageMyQuizzes})));

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
          <Route path="/createquiz/ai" element={<PageCreateQuizAI/>}/>
          <Route path="/myquizzes" element={<PageMyQuizzes/>}/>
          <Route path="/myquizzes/:category?" element={<PageMyQuizzes/>}/>
          {/*<Route path="/createquiz/ai" element={<PageEmpty emptyReason="pageDevelopment"/>}/>*/}
        </Route>

        <Route path="/allquizzes" element={<PageAllQuizzes/>}/>
        <Route path="/allquizzes/:category?" element={<PageAllQuizzes/>}/>
        <Route path="/quizzes/:testid" element={<PageQuiz/>}/>
        <Route path="/service" element={<PageEmpty emptyReason="serviceWork"/>}/>
        <Route path='*' element={<Page404/>}/>
      </Route>
    </Routes>
  )
}
