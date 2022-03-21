import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

export const Log = (props) => {
  // Location data that gets passed to log from routine
  const location = useLocation();
  const data = location.state.exercise;

  // Values for form button toggle
  const values = ["good", "okay", "poor"];

  // State to hold weight, reps, form for submit
  const [weight, setWeight] = useState();
  const [reps, setReps] = useState();
  const [form, setForm] = useState(0);

  // State to hold exercise log history
  const [logHistory, setLogHistory] = useState([]);

  // Handle form button toggle, toggle through values array
  const handleToggle = () => {
    form === 2 ? setForm(0) : setForm(form + 1);
  };

  const handleSubmit = async () => {
    const newLog = {
      exercise: data._id,
      weight: weight,
      reps: reps,
      form: values[form],
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
      setLogHistory([...logHistory, data]);
    } catch (error) {
      console.error("Error submiting log: ", error);
    }
  };

  const fetchLogs = async () => {
    try {
      const res = await fetch("http://localhost:9900/log/list", {
        headers: { "x-access-token": localStorage.getItem("token") },
      });
      const data = await res.json();
      setLogHistory(data);
    } catch (error) {
      console.error("Error fetching log history: ", error);
    }
  };

  useEffect( () => {
    props.setBannerText(data.name);
    fetchLogs();
  }, []);

  return (
    <div className="flex h-full p-8">
      {/* Log Column */}
      <div className="w-2/3 h-full">
        <ul className="flex flex-col">
          {
            logHistory.map( (log, i) => {
              return (
                <li
                  key={i}
                  className="mb-2 mr-2 py-2 px-4 bg-amber-400 rounded-md"
                >
                  <p>{log.weight} lbs. X {log.reps} reps.</p>
                  <p>{log.form} form</p>
                </li>
              );
            })
          }
        </ul>
      </div>
      {/* Form Column */}
      <div className="w-1/3">
        <form
          onSubmit={ (e) => {
            e.preventDefault();
            handleSubmit();
          }}
          className="flex flex-col"
        >
          <input
            type="number"
            name="weight"
            placeholder={weight || "lbs"}
            onChange={ (e) => {
              setWeight(e.target.value);
            }}
            className="w-full p-2 rounded-lg mb-2"
          />
          <input
            type="number"
            name="reps"
            placeholder={reps || "reps"}
            onChange={ (e) => {
              setReps(e.target.value);
            }}
            className="w-full p-2 rounded-lg mb-2"
          />
          <button 
            value={values[form]}
            onClick={ (e) => {
              e.preventDefault();
              handleToggle();
            }}
            className={`w-full p-2 rounded-lg mb-2 
              ${form === 0 ? "bg-green-700" : form === 1 ? "bg-amber-400" : "bg-red-700"}`}
          >
            {values[form]}
          </button>
          <button
            type="submit"
            className="w-full p-2 rounded-lg mb-2 bg-black text-white"
          >Submit</button>
        </form>
      </div>
    </div>
  );
};