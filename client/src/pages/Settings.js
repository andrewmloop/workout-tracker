import React, { useEffect, useState } from "react";
import Banner from "../components/Banner";

import { useUser } from "../context/UserContext";

export default function Settings(props) {
  const { userStore, handleUser } = useUser();

  const [isLeftHand, setIsLeftHand] = useState(userStore.left_hand);
  const [isMetric, setIsMetric] = useState(userStore.use_metric);

  const handleChange = async () => {
    const newData = {
      left_hand: isLeftHand,
      use_metric: isMetric,
    };

    try {
      const response = await fetch("http://localhost:9900/user/update", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-access-token": localStorage.getItem("token")
        },
        body: JSON.stringify(newData)
      });
      const data = await response.json();
      if (data.result === "success") {
        props.setNotifText(data.message);
        props.setNotifType(true);
        props.setShowNotif(true);
        handleUser(data.data);
      } else {
        props.setNotifText(data.message);
        props.setNotifType(false);
        props.setShowNotif(true);
      }
    } catch (error) {
      console.error("Error updating user: ", error);
      props.setNotifText("The iron gods are upset at the moment");
      props.setNotifType(false);
      props.setShowNotif(true);
    }
  };

  useEffect(() => {
    handleChange();
  }, [isLeftHand, isMetric]);

  return (
    <>
      <Banner
        bannerText={"Settings"}
      />
      <div className="p-8 text-white">
        <div className="flex flex-col mb-4">
          <div className="flex justify-between items-center mb-2">
            <h5 className="text-lg font-bold">Left Handed</h5>
            <ToggleSwitch 
              name="leftHanded" 
              checked={isLeftHand}
              onChange={() => setIsLeftHand(!isLeftHand)} 
            />
          </div>
          <p>This will move the buttons to record logs to the left side.</p>
        </div>
        <div className="flex flex-col mb-4">
          <div className="flex justify-between items-center mb-2">
            <h5 className="text-lg font-bold">Use Metric</h5>
            <ToggleSwitch 
              name="metric" 
              checked={isMetric}
              onChange={() => setIsMetric(!isMetric)}
            />
          </div>
          <p>This will show all measurements in kilograms and centimeters.</p>
        </div>
      </div>
    </>
  );
}

function ToggleSwitch({ name, checked, onChange }) {
  return (
    <div>
      <input
        type="checkbox"
        name={name}
        id={name}
        className="hidden"
        onClick={onChange}
      />
      <label htmlFor={name} className="flex justify-between align-middle cursor-pointer w-[80px] h-[40px] border-2 rounded-full" >
        <span className={`${checked ? "bg-amber-400 translate-x-[100%]" : "bg-slate-300 translate-x-0"} w-1/2 rounded-full transition-transform duration-200`} />
      </label>
    </div>
  );
}