import React, { useState, useEffect} from "react";
import { useNavigate } from "react-router-dom";
import { useNotif } from "../context/NotificationContext";

export default function EditLogModal({ show, log, setShow, setRefetch }) {
  const { handleNotif } = useNotif();
  const navigate = useNavigate();

  const [inputWeight, setInputWeight] = useState(log.weight || 0);
  const [inputReps, setInputReps] = useState(log.reps || 0);
  const [inputForm, setInputForm] = useState(log.form || "");

  const handleSave = async (e) => {
    e.preventDefault();

    if (!handleValidation()) {
      let errorText = "Add a weight and rep";
      handleNotif(errorText, false, true);
      return;
    }

    const newData = {
      weight: inputWeight,
      reps: inputReps,
      form: inputForm
    };

    try {
      const res =  await fetch(`/api/log/update/${log._id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-access-token": localStorage.getItem("token")
        },
        body: JSON.stringify(newData)
      });
      const data = await res.json();
      if (data.isLoggedIn === false) {
        navigate("/");
        let loginText = "Your session has expired";
        handleNotif(loginText, true, true);
      } else if (res.status === 200) {
        handleNotif(data.message, true, true);
      } else {
        handleNotif(data.message, false, true);
      }
    } catch (error) {
      console.error("Error updating log:", error);
      const errorText = "The iron gods are upset at the moment";
      handleNotif(errorText, false, true);
    } finally {
      setRefetch(prev => !prev);
      setShow(false);
    }
  };

  const handleCancel = (e) => {
    e.preventDefault();
    setShow(false);
  };

  const handleForm = (e, form) => {
    e.preventDefault();
    setInputForm(form);
  };

  const handleValidation = () => {
    let isValid = true;

    if (inputWeight === "") isValid =  false;
    if (inputReps === "") isValid =  false;

    return isValid;
  };

  useEffect(() => {
    setInputWeight(log.weight);
    setInputReps(log.reps);
    setInputForm(log.form);
  }, [show]);

  return (
    <div className={`fixed ${show ? "top-[40vh] translate-y-[-40%]" : "top-[110vh]"} left-1/2 translate-x-[-50%] p-6 max-w-[500px] w-[75vw] rounded-md bg-black text-white transition-all duration-300 z-[100] shadow-2xl`}>
      <form>
        <label htmlFor="weight-input" className="flex flex-col">
          Weight
          <input 
            id="weight-input"
            type="number" 
            value={inputWeight} 
            onFocus={() => setInputWeight("")}
            onChange={(e) => setInputWeight(e.target.value)}
            className="text-input mb-3"
          />
        </label>
        <label htmlFor="reps-input" className="flex flex-col">
          Reps
          <input 
            id="reps-input"
            type="number" 
            value={inputReps} 
            onFocus={() => setInputReps("")}
            onChange={(e) => setInputReps(e.target.value)}
            className="text-input mb-3"
          />
        </label>
        <label htmlFor="reps-input">
          Form
          <div>
            <button 
              onClick={(e) => handleForm(e, "good")}
              className={`w-full ${inputForm === "good" ? "btn-good" : "btn-good-inverted"} mb-2`}
            >Good</button>
            <button 
              onClick={(e) => handleForm(e, "okay")}
              className={`w-full ${inputForm === "okay" ? "btn-okay" : "btn-okay-inverted"} mb-2`}
            >Okay</button>
            <button 
              onClick={(e) => handleForm(e, "poor")}
              className={`w-full ${inputForm === "poor" ? "btn-poor" : "btn-poor-inverted"} mb-4`}  
            >Poor</button>
          </div>
        </label>
        <div className="flex w-full gap-2">
          <button
            onClick={(e) => handleSave(e)}
            className="btn w-full"
          >Save</button>
          <button
            onClick={(e) => handleCancel(e)}
            className="btn w-full"
          >Cancel</button>
        </div>
      </form>
    </div>
  );
}