import React, {useEffect} from "react";
import {useNavigate} from "react-router-dom";
import {loginGoogle, useUser} from "../../store/useUserStore";

export const PageMain = () => {
  const user = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate("/createquiz");
    }
  }, [user]);

  return (
    <div className='tests-container'>
      <div className={'noticeBlock'}>
        <p className='noticeText'>Войдите в систему, чтобы начать создавать свои тесты...</p>
      </div>
      <button className='btn button-login' onClick={loginGoogle}>GOOGLE LOGIN</button>
    </div>
  );
}