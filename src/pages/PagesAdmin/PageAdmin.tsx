import React, { useEffect } from "react";
import { NavLink, Outlet } from "react-router-dom";
import { loadUsers, useIsLoadingUsers } from "../../store/useAdminStore";
import { Loader } from "../../components/Loader/Loader";

export const PageAdmin = () => {
  useEffect(() => {
    loadUsers();
  }, [])

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
