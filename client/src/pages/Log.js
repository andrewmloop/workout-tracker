import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

import Banner from "../components/Banner";

import { useUser } from "../context/UserContext";

export default function Log(props) {
  // Location data that gets passed to log from routine
  const location = useLocation();
  const exercise = location.state.exercise;

  const { userStore } = useUser();

  // Values for form button toggle
  const values = ["Good", "Okay", "Poor"];
  const units = userStore.use_metric ? "kg." : "lbs.";

  // State to hold weight, reps, form, date for submit
  const [weight, setWeight] = useState("");
  const [reps, setReps] = useState("");
  const [form, setForm] = useState(0);
  const [logDate, setLogDate] = useState(Date());

  // State to hold exercise log history
  const [logHistory, setLogHistory] = useState([]);

  // Handle form button toggle, toggle through values array
  const handleToggle = (e) => {
    e.preventDefault();
    form === 2 ? setForm(0) : setForm(form + 1);
  };

  // Prevent fetch if form is empty
  const handleValidation = () => {
    let isValid = true;

    if (weight === "") isValid = false;
    if (reps === "") isValid = false;

    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!handleValidation()) {
      props.setNotifText("Add a weight and rep");
      props.setNotifType(false);
      props.setShowNotif(true);
      return;
    }

    const newLog = {
      exercise: exercise._id,
      weight: weight,
      reps: reps,
      maxRep: getOneRepMax(weight, reps),
      form: values[form],
      date: logDate,
    };

    try {
      const res = await fetch("http://localhost:9900/log/add", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "x-access-token": localStorage.getItem("token"),
        },
        body: JSON.stringify(newLog),
      });
      const data = await res.json();
      if (data.result === "success") {
        setLogHistory([data.data, ...logHistory]);
        props.setNotifText("Log added");
        props.setNotifType(true);
        props.setShowNotif(true);
      }
      if (data.result === "failure") {
        props.setNotifText("Failed to add log");
        props.setNotifType(false);
        props.setShowNotif(true);
      }
    } catch (error) {
      console.error("Error submiting log: ", error);
      props.setNotifText("The iron gods are upset at the moment");
      props.setNotifType(false);
      props.setShowNotif(true);
    }
  };

  const fetchLogs = async () => {
    try {
      const res = await fetch(`http://localhost:9900/log/exercise/${exercise._id}`, {
        headers: { "x-access-token": localStorage.getItem("token") },
      });
      const data = await res.json();
      setLogHistory(data.data);
    } catch (error) {
      console.error("Error fetching log history: ", error);
    }
  };

  const formatDate = (d) => {
    const date = new Date(d);
    const currentMonth = date.getMonth() + 1;
    const monthString = currentMonth >= 10 ? currentMonth : `0${currentMonth}`;
    const currentDate = date.getDate();
    return `${date.getFullYear()}-${monthString}-${currentDate}`;
  };

  const getOneRepMax = (weight, reps) => {
    if (reps == 1) {
      return weight;
    } else {
      return Math.round(weight * (36 / (37 - reps)));
    }
  };

  // The user can click on a previous log to autofill the 
  // form for the next log to be added quicker.
  const setInputs = (w, r) => {
    setWeight(w);
    setReps(r);
  };

  useEffect( () => {
    fetchLogs();
  }, []);

  return (
    <>
      <Banner
        bannerText={exercise.name}
        showBack={true}
      />
      <div className={`grid ${userStore.left_hand ? "grid-cols-[33%_66%]" : "grid-cols-[66%_33%]"} h-[calc(100%-120px)] gap-2 p-4`}>
        {/* Log Column */}
        <div className={`flex flex-col overflow-hidden ${userStore.left_hand ? "order-2" : ""}`}>
          <ul className="flex flex-col overflow-y-scroll">
            {
              logHistory.map( (log, i) => {
                return (
                  <li
                    key={i}
                    className="mb-2 py-2 px-4 bg-amber-400 rounded-md"
                    onClick={() => setInputs(log.weight, log.reps)}
                  >
                    <p>{log.weight} {units} X {log.reps} reps.</p>
                    <p>{formatDate(log.date)}</p>
                    <p>{log.form} form</p>
                    <p>1RM: {log.maxRep}</p>
                  </li>
                );
              })
            }
          </ul>
        </div>
        {/* Form Column */}
        <div>
          <form onSubmit={ (e) => handleSubmit(e) }
            className="h-full flex flex-col justify-center"
          >
            <input
              type="number"
              name="weight"
              placeholder={units}
              value={weight}
              onChange={ (e) => setWeight(e.target.value) }
              className="w-full p-2 rounded-lg mb-2 text-center"
            />
            <input
              type="number"
              name="reps"
              placeholder={"reps"}
              value={reps}
              onChange={ (e) => setReps(e.target.value) }
              className="w-full p-2 rounded-lg mb-2 text-center"
            />
            <button 
              onClick={ (e) => handleToggle(e) }
              className={`w-full p-2 rounded-lg mb-2 
                ${form === 0 ? "bg-green-700" : form === 1 ? "bg-amber-400" : "bg-red-700"}`}
            >
              {values[form]}
            </button>
            <input
              type="date"
              name="date"
              value={formatDate(logDate)}
              onChange={(e) => setLogDate(e.target.value) }
              className="w-full p-2 rounded-lg mb-2 text-center"
            />
            <button
              type="submit"
              className="w-full p-2 rounded-lg mb-2 bg-black text-white"
            >Submit</button>
          </form>
        </div>
      </div>
    </>
  );
}