import React from "react";
import {loginGoogle, logoutGoogle, useUser} from "../../store/useUserStore";
import {useNavigate} from "react-router-dom";

export const PageMain = () => {
  const user = useUser();
  const navigate = useNavigate();

  const createTest = () => {
    if (user) {
      navigate("/createquiz");
      console.log("create test");
    }
  }

  return (
    <div className='tests-container'>
      {
        (!user) ?
          <>
            <div className={'noticeBlock'}>
              <p className='noticeText'>Войдите в систему, чтобы создавать свои тесты...</p>
            </div>
            <button className='btn button-login ' onClick={loginGoogle}>GOOGLE LOGIN</button>
          </>
          :
          <>
            <button className='btn button-login' onClick={logoutGoogle}>LOGOUT</button>
            <button className='btn button-create' onClick={createTest}>Создать новый тест</button>
          </>
      }
    </div>
  );
}