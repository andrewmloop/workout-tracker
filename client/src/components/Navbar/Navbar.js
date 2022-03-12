import React from "react";
import { NavLink } from "react-router-dom";

export const Navbar = () => {
  return (
    <nav className="absolute left-0 bottom-0 w-full bg-black h-16 text-white">
      <div className="flex h-full justify-around items-center text-center">
        <NavItem to="/exercise-list" text="Exercises" />
        <NavItem to="/" text="Routines" />
        <NavItem to="/log-list" text="Logs" />
        <NavItem to="/settings" text="Settings" />
      </div>
    </nav>
  );
};

const NavItem = (props) => {
  return (
    <div>
      <NavLink 
        to={props.to}
        className={ (navData) => navData.isActive ? "text-amber-400" : "" }
      >
        {props.text}
      </NavLink>
    </div>
  );
};

