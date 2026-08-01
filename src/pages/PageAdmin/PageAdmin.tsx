import React from "react";
import { NavLink, Outlet } from "react-router-dom";

export const PageAdmin = () => {

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
