import React from "react";
import { NavLink } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="fixed left-0 bottom-0 w-full bg-black h-16 text-white">
      <div className="flex h-full justify-around items-center text-center">
        <NavItem to="/exercise-group" text="Exercises" />
        <NavItem to="/routine-list" text="Routines" />
        <NavItem to="/settings" text="Settings" />
      </div>
    </nav>
  );
}

const NavItem = (props) => {
  return (
    <div>
      <NavLink 
        to={props.to}
        className={ (navData) => navData.isActive ? "text-amber-400" : "" }
      >{props.text}</NavLink>
    </div>
  );
};

