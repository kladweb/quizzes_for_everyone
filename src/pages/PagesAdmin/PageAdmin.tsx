import React from "react";
import { NavLink, Outlet } from "react-router-dom";
import {
  useIsLoadingQuizzesInfo, useIsLoadingStatInfo,
  useIsLoadingUsers
} from "../../store/useAdminStore";
import { Loader } from "../../components/Loader/Loader";
import "./pageAdmin.css"
import { addTokensToUser } from "../../api/adminActions";
import { useUser } from "../../store/useUserStore";

export const PageAdmin = () => {

  const user = useUser();
  const isLoadingUsers = useIsLoadingUsers();
  const isLoadingQuizzesInfo = useIsLoadingQuizzesInfo();
  const isLoadingStatInfo = useIsLoadingStatInfo();

  if (isLoadingUsers || isLoadingQuizzesInfo || isLoadingStatInfo) {
    return <div className="loader-container"><Loader/></div>;
  }

  return (
    <div className='admin-container'>
      <h2 className="test-list-name">СТРАНИЦА АДМИНИСТРАТОРА</h2>
      <nav className="admin-navbar">
        <NavLink className='link-nav' to={'userslist'}>
          <span>Users List</span>
        </NavLink>
        <NavLink className='link-nav' to={"usersgeneralinfo"}>
          <span>Users Info</span>
        </NavLink>
        <NavLink className='link-nav' to={"quizzesinfo"}>
          <span>Quizzes Info</span>
        </NavLink>
        <NavLink className='link-nav' to={"statinfo"}>
          <span>Statistics Info</span>
        </NavLink>
      </nav>
      <button onClick={async () => {
        if (!user) return;
        const ttt = await addTokensToUser(user?.uid, 10);
        console.log(ttt);
      }}>
        TEST
      </button>
      <Outlet/>
    </div>
  )
}
