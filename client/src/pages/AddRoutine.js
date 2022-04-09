import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Banner from "../components/Banner";

export default function AddRoutine() {
  const [name, setName] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (name.length > 0) {
      const routine = {
        // Backend handles empty array for new routine
        // Backend handles user id based on JWT taken from local storage
        name: name,
      };

      try {
        const response = await fetch("http://localhost:9900/routine/add", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-access-token": localStorage.getItem("token"),
          },
          body: JSON.stringify(routine),
        });
        const data = await response.json();
        if (data.result === "success") {
          navigate("/routine-list");
        }
      } catch (error) {
        console.error("Error creating routine: ", error);
      }
    }
  };

  return (
    <>
      <Banner
        bannerText={"Create Routine"}
        showBack={true}
      />
      <div className="p-8">
        <form 
          onSubmit={handleSubmit}
          className="flex flex-col"
        >
          <label htmlFor="routine-name">Name</label>
          <input
            type="text"
            name="routine-name"
            placeholder="Routine name"
            onChange={ (e) => setName(e.target.value)}
            className="w-full p-1 rounded-lg mb-2"
          />
          <button
            type="submit"
            className="w-full bg-amber-400"
          >Submit</button>
        </form>
      </div>
    </>
  );
}