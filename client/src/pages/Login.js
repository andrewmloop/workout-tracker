import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { useUser } from "../context/UserContext";

export default function Login() {

  // Access to change global user store
  const { handleUser } = useUser();

  // For redirect user on successful login
  const navigate = useNavigate();

  // State for login form inputs
  const [userEmail, setUserEmail] = useState("");
  const [userPassword, setUserPassword] = useState("");
  const [valErrors, setValErrors] = useState({});

  const [loginError, setLoginError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    let isValidForm = handleValidation();

    if (isValidForm) {
      const user = {
        email: userEmail,
        password: userPassword,
      };
  
      try {
        const response = await fetch("http://localhost:9900/auth/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(user)
        });
        const data = await response.json();
        if (data.result === "success") {
          localStorage.setItem("token", data.token);
          handleUser(data.data);
          navigate("/routine");
        } else {
          setLoginError(data.message);
        }
      } catch (error) {
        console.error("Error authenticating user: ", error);
        setLoginError({error});
      }
    }
  };

  const handleValidation = () => {
    let tempErrors = {};
    let isValid = true;

    if (userEmail <= 0) {
      tempErrors["userEmail"] = true;
      isValid = false;
    }

    if (userPassword <= 0) {
      tempErrors["userPassword"] = true;
      isValid = false;
    }

    setValErrors({...tempErrors});
    return isValid;

  };

  return (
    <div className="p-8 text-white">
      <div>
        <form
          className="flex flex-col"
          onSubmit={handleSubmit}>
          <label htmlFor="email">Email</label>
          <input 
            type="email" 
            name="email"
            onChange={ (e) => setUserEmail(e.target.value) }
            className="mb-2 text-input"
          />
          {valErrors?.userEmail && (
            <p className="text-red-500">Please enter an email.</p>
          )}
          <label htmlFor="password">Password</label>
          <input 
            type="password" 
            name="password"
            onChange={ (e) => setUserPassword(e.target.value) }
            className="mb-2 text-input"
          />
          {valErrors?.userPassword && (
            <p className="text-red-500">Please enter a password.</p>
          )}
          <button
            type="submit"
            className="w-full btn"
          >Submit</button>
        </form>
        {loginError && (
          <p className="text-red-500">{loginError}.</p>
        )}
        <p>Don&apos;t have an account? <Link to="/register" className="text-amber-400">Sign Up</Link></p>
      </div>
    </div>
  );
}