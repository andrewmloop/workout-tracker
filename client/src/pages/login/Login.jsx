import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import Loading from "../../components/loading/Loading";
import PageTransition from "../../components/page-transition/PageTransition";
import { useUserStore } from "../../store/UserStore";

import "./Login.css";

export default function Login() {
  // Access to change global user store
  const { setUser } = useUserStore();

  // For redirect user on successful login
  const navigate = useNavigate();

  // State for login form inputs
  const [userEmail, setUserEmail] = useState("");
  const [userPassword, setUserPassword] = useState("");
  const [rememberLogin, setRememberLogin] = useState(
    JSON.parse(localStorage.getItem("rememberLogin"))
  );

  // State for login validation
  const [loading, setLoading] = useState(false);
  const [valErrors, setValErrors] = useState({});
  const [loginError, setLoginError] = useState("");

  const checkExpire = async () => {
    try {
      const response = await fetch("/api/auth/remember-me", {
        headers: {
          "x-access-token": localStorage.getItem("token"),
        },
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
      setLoginError({ error });
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
          body: JSON.stringify(user),
        });
        const data = await res.json();
        if (res.status === 200) {
          localStorage.setItem("token", data.token);
          setUser(data.data);
          setLoading(true);
          setTimeout(() => {
            navigate("/routine");
          }, 1500);
        } else {
          setLoginError(data.message);
        }
      } catch (error) {
        console.error("Error authenticating user: ", error);
        setLoginError({ error });
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

    setValErrors({ ...tempErrors });
    return isValid;
  };

  // useEffect(async () => {
  //   if (rememberLogin) await checkExpire();
  // }, []);

  return (
    <PageTransition>
      {loading ? (
        <Loading text="Logging in..." />
      ) : (
        <div className="login-page">
          <h1>Login</h1>
          <form className="login-form" onSubmit={handleSubmit}>
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              name="email"
              autoComplete="email"
              onChange={(e) => setUserEmail(e.target.value)}
            />
            {valErrors?.userEmail && (
              <p className="login-error">Please enter an email.</p>
            )}
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              name="password"
              autoComplete="current-password"
              onChange={(e) => setUserPassword(e.target.value)}
            />
            {valErrors?.userPassword && (
              <p className="login-error">Please enter a password.</p>
            )}
            <RememberMe
              rememberLogin={rememberLogin}
              setRememberLogin={setRememberLogin}
            />
            <button type="submit">Submit</button>
          </form>
          {loginError && <p className="text-red-500">{loginError}.</p>}
          <p className="mb-1">
            Don&apos;t have an account?{" "}
            <Link to="/register" className="text-amber-400">
              Sign Up
            </Link>
          </p>
          <p className="disclaimer">
            Disclaimer: This is a hobby project, so please enjoy the app, but
            expect to encounter bugs and other broken functionality. For the
            best exeperience, view this app on a mobile device.
          </p>
        </div>
      )}
    </PageTransition>
  );
}

function RememberMe({ rememberLogin, setRememberLogin }) {
  const handleChange = () => {
    localStorage.setItem("rememberLogin", !rememberLogin);
    setRememberLogin(!rememberLogin);
  };

  return (
    <label htmlFor="remember-login" className="remember-me">
      Remember me?&nbsp;
      <input
        id="remember-login"
        name="remember-login"
        type="checkbox"
        checked={rememberLogin}
        onChange={() => handleChange()}
        className="checkbox"
      />
    </label>
  );
}
