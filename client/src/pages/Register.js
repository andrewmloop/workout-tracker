import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Register() {
  // Redirect user on successful register
  const navigate = useNavigate();

  // State for form inputs
  const [name, setName] = useState("");
  const [birthDate, setBirthDate] = useState(new Date());
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

    if (birthDate.length <= 0) {
      tempErrors["birthDate"] = true;
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
        const response = await fetch("http://localhost:9900/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: email,
            password: password,
            first_name: name,
            birth_date: birthDate,
          })
        });
        const data = await response.json();
        if (data.message === "success") {
          setSuccessMessage(true);
          navigate("/login");
        } else if (data.message === "failure") {
          setFailureMessage(true);
          setRegError(data.error);
        }
      } catch (error) {
        if (error) console.error("Error registering new user: ", error);
      }
    }
  };

  return (
    <div className="p-8 text-white"> 
      <div>
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
          {/* Birth Date Input */}
          <label htmlFor="birth_date">Birth Date</label>
          <input 
            type="date" 
            name="birth_date"
            placeholder="mm/dd/yyyy"
            onChange={ (e) => setBirthDate(e.target.value) }
            className="mb-2 date-input"
          />
          {valErrors?.birthDate && (
            <p className="text-red-500">Please enter a correct date.</p>
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
            className="mb-2 text-input"
          />
          {valErrors?.passwordMatch && (
            <p className="text-red-500">Passwords do not match.</p>
          )}
          {/* Submit */}
          <button
            type="submit"
            className="w-full btn"
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
        <p>Already have an account? <Link to="/login" className="text-amber-400">Log In</Link></p>
      </div>
    </div>
  );
}