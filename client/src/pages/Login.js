import React, { useState } from "react";

export const Login = () => {
  const [userEmail, setUserEmail] = useState("");
  const [userPassword, setUserPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const handleSubmit = async () => {
    const user = {
      email: userEmail,
      password: userPassword,
    };

    setLoading(true);

    try {
      const response = await fetch("http://localhost:9900/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(user)
      });
      const data = await response.json();
      localStorage.setItem("token", data.token);
    } catch (error) {
      console.error("Error authenticating user: ", error);
      setError(true);
    }

    setLoading(false);
  };

  return (
    <div className="p-8">
      <div>
        <form
          className="flex flex-col"
          onSubmit={ (e) => {
            e.preventDefault();
            handleSubmit();
          }}>
          <label htmlFor="email">Email</label>
          <input 
            type="email" 
            name="email"
            onChange={ (e) => setUserEmail(e.target.value) }
            className="mb-2"
          />
          <label htmlFor="password">Password</label>
          <input 
            type="password" 
            name="password"
            onChange={ (e) => setUserPassword(e.target.value) }
            className="mb-2"
          />
          <button
            type="submit"
            className="w-full bg-amber-400"
          >Submit</button>
        </form>
        { loading ? "Loading" : null }
        { error ? "Error logging in." : null }
      </div>
    </div>
  );
};