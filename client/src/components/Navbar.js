import React from "react";
import { NavLink } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="fixed left-0 bottom-0 w-full bg-black h-16 text-white">
      <div className="flex h-full justify-around items-center text-center">
        <NavLink to="/exercise" className={ navData => navData.isActive ? "text-amber-400" : ""}>Exercises</NavLink>
        <NavLink to="/routine" className={ navData => navData.isActive ? "text-amber-400" : "" }>Routines</NavLink>
        <NavLink to="/settings" className={ navData => navData.isActive ? "text-amber-400" : "" }>Settings</NavLink>
      </div>
    </nav>
  );
}

