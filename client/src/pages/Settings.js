import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import Banner from "../components/Banner";
import PageTransition from "../components/PageTransition";

import { useUser } from "../context/UserContext";
import { useNotif } from "../context/NotificationContext";

export default function Settings() {
  const { userStore, handleUser } = useUser();
  const { dispatchNotif } = useNotif();
  const navigate = useNavigate();

  const [isMetric, setIsMetric] = useState(userStore.use_metric);
  const firstRender = useRef(true);

  const handleChange = async () => {
    const newData = {
      use_metric: isMetric,
    };

    try {
      const res = await fetch("/api/user/update", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-access-token": localStorage.getItem("token"),
        },
        body: JSON.stringify(newData),
      });
      const data = await res.json();
      if (data.isLoggedIn === false) {
        navigate("/");
        let loginText = "Your session has expired";
        dispatchNotif(loginText, true);
      } else if (res.status === 200) {
        dispatchNotif(data.message, true);
        handleUser(data.data);
      } else {
        dispatchNotif(data.message, false);
      }
    } catch (error) {
      console.error("Error updating user: ", error);
      let errorText = "The iron gods are upset at the moment";
      dispatchNotif(errorText, false);
    }
  };

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
    } else {
      handleChange();
    }
  }, [isMetric]);

  return (
    <>
      <Banner bannerText={"Settings"} showBack={true} />
      <PageTransition>
        <div className="p-6 text-white">
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
          <Logout />
        </div>
      </PageTransition>
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
      <label
        htmlFor={name}
        className="flex justify-between align-middle cursor-pointer w-[70px] h-[35px] border-2 rounded-full"
      >
        <span
          className={`${
            checked
              ? "bg-amber-400 translate-x-[100%]"
              : "bg-slate-300 translate-x-0"
          } w-1/2 rounded-full transition-transform duration-200`}
        />
      </label>
    </div>
  );
}

function Logout() {
  const navigate = useNavigate();

  const handleClick = () => {
    localStorage.setItem("rememberLogin", false);
    localStorage.setItem("token", "");
    navigate("/");
  };

  return (
    <button
      type="button"
      onClick={() => handleClick()}
      className="btn-deny-lg w-full"
    >
      Logout
    </button>
  );
}
