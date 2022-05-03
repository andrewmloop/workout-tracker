import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { useNotif } from "../context/NotificationContext";

export default function Register() {
  // Redirect user on successful register
  const navigate = useNavigate();
  const { handleNotif } = useNotif();

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

    let validEmail = email.toLowerCase().match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
    if (!validEmail) {
      tempErrors["email"] = true;
      isValid = false;
    }

    let validPassword = password.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$%^&+=]).{8,}$/);
    if (!validPassword) {
      tempErrors["password"] = true;
      isValid = false;
    }

    if (passwordMatch !== password) {
      tempErrors["passwordMatch"] = true;
      isValid = false;
    }

    setValErrors({...tempErrors});
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const isValidForm = handleValidation();

    if (isValidForm) {
  
      try {
        const response = await fetch("/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: email,
            password: password,
            first_name: name,
          })
        });
        const data = await response.json();
        if (data.result === "success") {
          setSuccessMessage(true);
          handleNotif(data.message, true, true);
          navigate("/login");
        } 
        if (data.result === "failure") {
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
    <div className="flex flex-col p-8 text-white"> 
      <form
        className="flex flex-col"
        onSubmit={handleSubmit}>
        {/* First Name Input */}
        <label htmlFor="name">First Name</label>
        <input 
          type="text" 
          name="name"
          onChange={ (e) => setName(e.target.value) }
          className="mb-2 text-input"
        />
        {valErrors?.name && (
          <p className="text-red-500">Please enter a name.</p>
        )}
        {/* Email Input */}
        <label htmlFor="email">Email</label>
        <input 
          type="email" 
          name="email"
          onChange={ (e) => setEmail(e.target.value) }
          className="mb-2 text-input"
        />
        {valErrors?.email && (
          <p className="text-red-500">Please enter a valid email.</p>
        )}
        {/* Password Input */}
        <label htmlFor="password">Password</label>
        <input 
          type="password" 
          name="password"
          onChange={ (e) => setPassword(e.target.value) }
          className="mb-2 text-input"
        />
        {valErrors?.password && (
          <p className="text-red-500">Password does not match format.</p>
        )}
        {/* Password Match Input */}
        <label htmlFor="password_match">Re-enter Password</label>
        <input 
          type="password" 
          name="password_match"
          onChange={ (e) => setPasswordMatch(e.target.value) }
          className="mb-3 text-input"
        />
        {valErrors?.passwordMatch && (
          <p className="text-red-500">Passwords do not match.</p>
        )}
        {/* Submit */}
        <button
          type="submit"
          className="w-full btn-lg mb-1"
        >Submit</button>
        <div className="text-left">
          {successMessage && (
            <p className="text-green-500 font-semibold text-sm my-2">
              Your account has been created! Redirecting.
            </p>
          )}
          {failureMessage && (
            <p className="text-red-500 font-semibold text-sm my-2">
              {regError}
            </p>
          )}
        </div>
      </form>
      <p className="mb-1">Already have an account? <Link to="/login" className="text-amber-400">Log In</Link></p>
      <p className="mt-auto leading-tight text-sm text-gray-400">Disclaimer: This is a hobby project, so please enjoy the app, but expect to encounter bugs and other broken functionality. For the best exeperience, view this app on a mobile device.</p>
    </div>
  );
}