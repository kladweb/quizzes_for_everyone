import React, { useEffect, useState } from "react";
import { Navigate, useParams } from "react-router-dom";
import { nanoid } from "nanoid";

// interface IQuizEditProps {
//   quiz: IQuizMeta;
// }

export const PageCreateQuizManual = () => {
  const params = useParams();
  const [testId, setTestId] = useState<string | undefined>(params.testid);

  console.log(params);
  console.log(testId)

  useEffect(() => {
    console.log("A");
    if (!testId) {
      setTestId(nanoid(12));
      console.log("B");
    }
  }, [testId]);

  return (
    <>
      {testId ? <Navigate to={`/createquiz/manual/${testId}`}/> : null}
    </>
  )
}
