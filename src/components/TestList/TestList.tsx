import React, { useEffect, useState } from "react";
import { type Quiz } from "../../types/Quiz";
import "./testList.css";

export const TestList: React.FC<{ testList: Quiz[] }> = ({testList}) => {

  const deleteTest = (e: React.MouseEvent<HTMLElement>) => {
    const testId = e.currentTarget.getAttribute("data-id");

  }

  const testsElements = testList.map((quiz, i) => {
    return (
      <div className='testItem' key={quiz.testId}>
        <p className='testItemName'>{i + 1}) {quiz.title}</p>
        <button className='buttonDel' data-id={quiz.testId} onClick={deleteTest}>
          Удалить
        </button>
      </div>
    )
  })

  return (
    <>
      <h3 className="testListName">МОИ ТЕСТЫ:</h3>
      <div className='testListBlock'>
        {testsElements}
      </div>
    </>
  )
}
