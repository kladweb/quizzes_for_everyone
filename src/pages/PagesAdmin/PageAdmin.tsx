import React, { useEffect } from "react";
import { NavLink, Outlet } from "react-router-dom";
import { loadUsers, useIsLoadedUsers, useIsLoadingUsers } from "../../store/useAdminStore";
import { Loader } from "../../components/Loader/Loader";
import { loadAllQuizzes, useIsAllLoaded } from "../../store/useQuizzesStore";

export const PageAdmin = () => {
  const isAllLoaded = useIsAllLoaded();
  const isLoadedUsers = useIsLoadedUsers();

  useEffect(() => {
    if (!isLoadedUsers) {
      loadUsers();
    }
    if (!isAllLoaded) {
      loadAllQuizzes();
    }
  }, []);

  const isLoadingUsers = useIsLoadingUsers();

  if (isLoadingUsers) {
    return <div className="loader-container"><Loader/></div>;
  }

  return (
    <div className='tests-container'>
      <h2 className="test-list-name">СТРАНИЦА АДМИНИСТРАТОРА</h2>
      <nav className="navbar">
        <NavLink className='link-nav' to={'dashboard'}>
          <span>Dashboard</span>
        </NavLink>
        <NavLink className='link-nav' to={'users'}>
          <span>Users</span>
        </NavLink>
      </nav>
      <Outlet/>
    </div>
  )
}
