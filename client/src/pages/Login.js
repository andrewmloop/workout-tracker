import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { useUser } from "../context/UserContext";

import Loading from "../components/Loading";

export default function Login() {

  // Access to change global user store
  const { handleUser } = useUser();

  // For redirect user on successful login
  const navigate = useNavigate();

  // State for login form inputs
  const [userEmail, setUserEmail] = useState("");
  const [userPassword, setUserPassword] = useState("");
  const [rememberLogin, setRememberLogin] = useState(JSON.parse(localStorage.getItem("rememberLogin")));
  const [loading, setLoading] = useState(false);
  const [valErrors, setValErrors] = useState({});

  const [loginError, setLoginError] = useState("");

  const checkExpire = async () => {
    try {
      const response = await fetch("/api/auth/remember-me", {
        headers: {
          "x-access-token": localStorage.getItem("token")
        }
      });
      const data = await response.json();
      if (data.isLoggedIn) {
        setLoading(true);
        setTimeout(() => {
          navigate("/routine");
        }, 1500);
      }
    } catch (error) {
      console.error("Error authenticating user: ", error);
      setLoginError({error});
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let isValidForm = handleValidation();

    if (isValidForm) {
      const user = {
        email: userEmail,
        password: userPassword,
      };
  
      try {
        const res = await fetch("/api/auth/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(user)
        });
        const data = await res.json();
        console.log(data);
        if (res.status === 200) {
          localStorage.setItem("token", data.token);
          handleUser(data.data);
          setLoading(true);
          setTimeout(() => {
            navigate("/routine");
          }, 1500);
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

  useEffect( async () => {
    if (rememberLogin) await checkExpire();
  }, []);

  return (
    <>
      {
        loading
          ? <Loading text="Logging in..." />
          : <div className="flex flex-col p-8 text-white">
            <form
              className="flex flex-col"
              onSubmit={handleSubmit}>
              <label htmlFor="email">Email</label>
              <input 
                type="email" 
                name="email"
                autoComplete="email"
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
                autoComplete="current-password"
                onChange={ (e) => setUserPassword(e.target.value) }
                className="mb-3 text-input"
              />
              {valErrors?.userPassword && (
                <p className="text-red-500">Please enter a password.</p>
              )}
              <RememberMe rememberLogin={rememberLogin} setRememberLogin={setRememberLogin} />
              <button
                type="submit"
                className="w-full btn-lg mb-1"
              >Submit</button>
            </form>
            {loginError && (
              <p className="text-red-500">{loginError}.</p>
            )}
            <p className="mb-1">Don&apos;t have an account? <Link to="/register" className="text-amber-400">Sign Up</Link></p>
            <p className="relative mt-auto leading-tight text-sm text-gray-400">Disclaimer: This is a hobby project, so please enjoy the app, but expect to encounter bugs and other broken functionality. For the best exeperience, view this app on a mobile device.</p>
          </div>
      }
    </>
  );
}
    

function RememberMe({ rememberLogin, setRememberLogin }) {
  const handleChange = () => {
    localStorage.setItem("rememberLogin", !rememberLogin);
    setRememberLogin(!rememberLogin);
  };

  return (
    <label htmlFor="remember-login" className="flex justify-start items-center mb-2">
      Remember me?&nbsp;
      <input 
        id="remember-login" name="remember-login"
        type="checkbox" checked={rememberLogin}
        onChange={() => handleChange()} 
        className="checkbox"
      />
    </label>
  );
}