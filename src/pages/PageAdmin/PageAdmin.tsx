import React, { useEffect } from "react";
import { NavLink, Outlet } from "react-router-dom";
import { getUsers } from "../../api/adminActions";

export const PageAdmin = () => {
  useEffect(() => {
    getUsers()
      .then((res) => {
        console.log(res);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [])

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
