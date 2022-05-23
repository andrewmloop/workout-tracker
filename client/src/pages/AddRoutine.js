import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import Banner from "../components/Banner";
import PageTransition from "../components/PageTransition";

import { useNotif } from "../context/NotificationContext";

export default function AddRoutine() {
  const { handleNotif } = useNotif();
  const navigate = useNavigate();

  const [name, setName] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (name.length > 0) {
      const routine = {
        // Backend handles empty exercise array for new routine
        // Backend handles user id based on JWT taken from local storage
        name: name,
      };

      try {
        const res = await fetch("/api/routine/add", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-access-token": localStorage.getItem("token"),
          },
          body: JSON.stringify(routine),
        });
        const data = await res.json();
        if (data.isLoggedIn === false) {
          navigate("/");
          let loginText = "Your session has expired";
          handleNotif(loginText, true, true);
        }
        if (res.status === 200) {
          handleNotif(data.message, true, true);
          navigate("/routine");
        }
      } catch (error) {
        console.error("Error creating routine: ", error);
        const errorText = "The iron gods are upset at the moment";
        handleNotif(errorText, false, true);
      }
    } else {
      let emptyFieldText = "Your routine needs a name";
      handleNotif(emptyFieldText, false, true);
    }
  };

  return (
    <>
      <Banner
        bannerText={"Create Routine"}
        showBack={true}
      />
      <PageTransition>
        <div className="p-8">
          <form 
            onSubmit={handleSubmit}
            className="flex flex-col"
          >
            <label htmlFor="routine-name" className="text-white mb-1">Name</label>
            <input
              type="text"
              name="routine-name"
              placeholder="Routine name"
              onChange={ (e) => setName(e.target.value)}
              className="w-full mb-3 text-input"
            />
            <button
              type="submit"
              className="w-full bg-amber-400 py-1 font-semibold rounded-md text-gray-700"
            >Submit</button>
          </form>
        </div>
      </PageTransition>
    </>
  );
}