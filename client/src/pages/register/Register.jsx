import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import PageTransition from "../../components/PageTransition";
import { useNotifStore } from "../../store/NotificationStore";

import "./Register.css";

export default function Register() {
  const navigate = useNavigate();
  const { handleNotif } = useNotifStore();

  // State for form inputs
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordMatch, setPasswordMatch] = useState("");

  // State for errors received from server
  const [regError, setRegError] = useState({});
  // State for errors on form validation
  const [valErrors, setValErrors] = useState({});

  // State for success or failure message
  const [successMessage, setSuccessMessage] = useState(false);
  const [failureMessage, setFailureMessage] = useState(false);

  const handleValidation = () => {
    let isValid = true;
    let tempErrors = {};

    if (name.length <= 0) {
      tempErrors["name"] = true;
      isValid = false;
    }

    let validEmail = email
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
    if (!validEmail) {
      tempErrors["email"] = true;
      isValid = false;
    }

    let validPassword = password.match(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$%^&+=]).{8,}$/
    );
    if (!validPassword) {
      tempErrors["password"] = true;
      isValid = false;
    }

    if (passwordMatch !== password) {
      tempErrors["passwordMatch"] = true;
      isValid = false;
    }

    setValErrors({ ...tempErrors });
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const isValidForm = handleValidation();

    if (isValidForm) {
      try {
        const res = await fetch("/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: email,
            password: password,
            first_name: name,
          }),
        });
        const data = await res.json();
        if (res.status === 200) {
          setSuccessMessage(true);
          handleNotif(data.message, true, true);
          navigate("/login");
        } else {
          setFailureMessage(true);
          handleNotif(data.message, false, true);
          setRegError(data.message);
        }
      } catch (error) {
        if (error) console.error("Error registering new user: ", error);
        let errorText = "The iron gods are displeased at the moment";
        handleNotif(errorText, false, true);
      }
    }
  };

  return (
    <PageTransition>
      <div className="register-page">
        <h1>Register an account</h1>
        <form className="register-form" onSubmit={handleSubmit}>
          {/* First Name Input */}
          <label htmlFor="name">First Name</label>
          <input
            type="text"
            name="name"
            onChange={(e) => setName(e.target.value)}
          />
          {valErrors?.name && (
            <p className="register-error">A name is required</p>
          )}

          {/* Email Input */}
          <label htmlFor="email">Email</label>
          <input
            type="email"
            name="email"
            autoComplete="username"
            onChange={(e) => setEmail(e.target.value)}
          />
          {valErrors?.email && (
            <p className="register-error">A valid email is required</p>
          )}

          {/* Password Input */}
          <label htmlFor="password">Password</label>
          <input
            type="password"
            name="password"
            autoComplete="new-password"
            onChange={(e) => setPassword(e.target.value)}
          />
          {valErrors?.password && (
            <p className="register-error">Password does not match format</p>
          )}

          {/* Password Match Input */}
          <label htmlFor="password_match">Re-enter Password</label>
          <input
            type="password"
            name="password_match"
            autoComplete="new-password"
            onChange={(e) => setPasswordMatch(e.target.value)}
          />
          <p className={valErrors?.passwordMatch ? "register-error" : "hidden"}>
            Passwords do not match
          </p>

          {/* Submit */}
          <button type="submit">Submit</button>
          <div>
            {successMessage && (
              <p className="text-green-500 font-semibold text-sm my-2">
                Your account has been created! Redirecting.
              </p>
            )}
            {failureMessage && <p className="register-error">{regError}</p>}
          </div>
        </form>
        <p>
          Already have an account? <Link to="/login">Log In</Link>
        </p>
        <p className="disclaimer">
          Disclaimer: This is a hobby project, so please enjoy the app, but
          expect to encounter bugs and other broken functionality. For the best
          exeperience, view this app on a mobile device.
        </p>
      </div>
    </PageTransition>
  );
}
