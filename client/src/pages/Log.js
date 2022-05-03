import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

import Banner from "../components/Banner";
import Loading from "../components/Loading";

import { useUser } from "../context/UserContext";
import { useNotif } from "../context/NotificationContext";

export default function Log() {
  // Location data that gets passed to log from routine
  const location = useLocation();
  const exercise = location.state.exercise;

  const { userStore } = useUser();
  const { handleNotif } = useNotif();

  // Values for form button toggle
  const values = ["Good", "Okay", "Poor"];
  const units = userStore.use_metric ? "kg" : "lbs";

  // State to hold weight, reps, form, date for submit
  const [weight, setWeight] = useState("");
  const [reps, setReps] = useState("");
  const [form, setForm] = useState(0);
  const [logDate] = useState(Date.now());
  const [loading, setLoading] = useState(false);

  // State to hold exercise log history
  const [logHistory, setLogHistory] = useState([]);
  // An array of dates from logHistory to group logs displayed
  const [displayDates, setDisplayDates] = useState([]);
  // Ref toggle to refetch logs when a new one is submitted
  const [refetch, setRefetch] = useState(false);

  // Handle form button toggle, toggle through values array
  const handleToggle = (e) => {
    e.preventDefault();
    form === 2 ? setForm(0) : setForm(form + 1);
  };

  // Prevent fetch if form is empty
  const handleValidation = () => {
    let isValid = true;

    if (weight === "" || typeof weight !== "number") isValid = false;
    if (reps === "" || typeof reps !== "number") isValid = false;

    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!handleValidation()) {
      let errorText = "Add a weight and rep";
      handleNotif(errorText, false, true);
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
      const res = await fetch("/log/add", {
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
        handleNotif(data.message, true, true);
        setRefetch(prev => !prev);
      }
      if (data.result === "failure") {
        handleNotif(data.message, false, true);
      }
    } catch (error) {
      console.error("Error submiting log: ", error);
      const errorText = "The iron gods are upset at the moment";
      handleNotif(errorText, false, true);
    }
  };

  const fetchLogs = async () => {
    setLoading(true);

    try {
      const res = await fetch(`/log/exercise/${exercise._id}`, {
        headers: { "x-access-token": localStorage.getItem("token") },
      });
      const data = await res.json();
      setLogHistory(data.data);
      populateDates(data.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching log history: ", error);
      setLoading(false);
    }
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

  const populateDates = arrOfObjs => {
    let dates = [...displayDates];
    for (let obj of arrOfObjs) {
      let date = new Date(obj.date).toDateString();
      if (dates.includes(date)) continue;
      dates.push(date);
    }
    setDisplayDates(dates);
  };

  useEffect( () => {
    fetchLogs();
  }, [refetch]);

  return (
    <>
      <Banner
        bannerText={exercise.name}
        showBack={true}
      />
      <div className={`grid ${userStore.left_hand ? "grid-cols-[35%_65%]" : "grid-cols-[65%_35%]"} h-full justify-between gap-1 p-4`}>
        {/* Log Column */}
        {
          loading
            ? <div className={`overflow-y-hidden ${userStore.left_hand ? "order-2 ml-2" : ""}`}>
              <Loading text="" />
            </div>
            : logHistory.length > 0 
              ? <div className={`h-[75vh] flex flex-col overflow-hidden ${userStore.left_hand ? "order-2 ml-2" : ""}`}>
                <ul className="flex flex-col overflow-y-scroll text-white">
                  {
                    displayDates.map( (date, i) => {
                      return (
                        <div key={i} className="mb-2">
                          <h3 className="mb-1">{date}</h3>
                          {
                            logHistory.map( log => {
                              if (new Date(log.date).toDateString() === date) {
                                return (
                                  <li
                                    key={log._id}
                                    className="mb-2 px-2 py-1 mr-3 bg-slate-800 rounded-md"
                                    onClick={() => setInputs(log.weight, log.reps)}
                                  >
                                    <p className="text-lg">{log.weight} {units} x {log.reps} reps.</p>
                                    <div className="w-full flex justify-between items-center text-sm">
                                      <p>1RM: {log.maxRep} {units}</p>
                                      <p className="first-letter:uppercase">{log.form} form</p>
                                    </div>
                                  </li>
                                );
                              }
                            })
                          }
                        </div>
                      );
                    })
                  }
                </ul>
              </div>
              : <p className="text-white m-auto">No logs yet</p>
        }
        {/* Form Column */}
        <div className="bg-slate-900">
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
            <button
              type="submit"
              className="w-full btn-lg"
            >Submit</button>
          </form>
        </div>
      </div>
    </>
  );
}