import { Route, Routes } from "react-router-dom";
import { PageMyQuizzes } from "../pages/PageMyQuizzes/PageMyQuizzes";
import { PageQuiz } from "../pages/PageQuiz/PageQuiz";
import {PageMain} from "../pages/PageMain/PageMain";
import {PageCreateQuiz} from "../pages/PageCreateQuiz/PageCreateQuiz";
import {PageEmpty} from "../pages/PageEmpty/PageEmpty";
import React from "react";


export const PagesRouter = () => {
  return (
    <main className="main">
      <Routes>
        <Route path="/" element={<PageMain/>}/>
        <Route path="/createquiz" element={<PageCreateQuiz/>}/>
        <Route path="/createquiz/json" element={<PageMyQuizzes/>}/>
        <Route path="/createquiz/manual" element={<PageEmpty emptyReason="pageDevelopment"/>}/>
        <Route path="/createquiz/ai" element={<PageEmpty emptyReason="pageDevelopment"/>}/>
        <Route path="/myquizzes" element={<PageMyQuizzes/>}/>
        <Route path="/quizzes/:testid" element={<PageQuiz/>}/>
      </Routes>
    </main>
  )
}
