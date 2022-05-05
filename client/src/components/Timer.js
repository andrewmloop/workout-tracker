import React, { useEffect, useState } from "react";

import { useNotif } from "../context/NotificationContext";

export default function Timer() {
  const { handleNotif } = useNotif();

  const [restTime, setRestTime] = useState(30);
  const [startTime, setStartTime] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [start, setStart] = useState(false);

  const formatTime = (secs) => {
    let time = new Date(0);
    time.setSeconds(secs);
    return time.toISOString().slice(14, 19);
  };

  const handleChange = (e) => {
    setRestTime(e.target.value);
    setStart(false);
  };

  // Function to display push notifications for mobile devices.
  // As of 5/5/22, iOS does not support this, but will keep this 
  // function commented out for future use.
  // const sendNotification = () => {
  //   if (window.Notification && Notification.permission === "granted") {
  //     navigator.serviceWorker.getRegistration().then( reg => {
  //       let options = {
  //         vibrate: [100, 50, 100],
  //       };
  //       reg.showNotification("Rest Timer Done", options);
  //     });
  //   } else if (window.Notification && Notification.permission !== "denied") {
  //     Notification.requestPermission(status => {
  //       if (status === "granted") {
  //         navigator.serviceWorker.getRegistration().then( reg => {
  //           let options = {
  //             vibrate: [100, 50, 100],
  //           };
  //           reg.showNotification("Rest Timer Done", options);
  //         });
  //       }
  //     });
  //   } else {
  //     return;
  //   }
  // };

  useEffect(() => {
    /* We are using difference in Date objects to help the timerInterval
    keep track of actual time when the app is in the background. 
    TimerInterval works fine when viewing through a normal browser tab when simply updating the timeLeft state by subtracting 1, but 
    when installed as a PWA, the timer becomes inconsistent which this 
    solves. */
    if (start) {
      let timerInterval = setInterval(() => {
        let now = new Date();
        let remainingTime = restTime - Math.floor((now - startTime) / 1000);
        if (remainingTime < 0) remainingTime = 0;
        if (timeLeft > 0) setTimeLeft(remainingTime);
        if (timeLeft === 0) {
          // sendNotification();
          handleNotif("Rest timer done", true, true);
          clearInterval(timerInterval);
          setStart(false);
        }
      }, 1000);

      return () => {
        clearInterval(timerInterval);
      };
    }
  }, [timeLeft]);

  useEffect(() => {
    if (start) {
      let now = new Date();
      setStartTime(now);
      setTimeLeft(restTime);
    }
    if (!start) setTimeLeft(0);
  }, [start]);

  return (
    <div className="w-full flex flex-col mt-2">
      <select value={restTime} onChange={(e) => handleChange(e)} className="timer z-[50]">
        <option value={30}>30 sec</option>
        <option value={60}>1 min</option>
        <option value={90}>90 sec</option>
        <option value={120}>2 min</option>
        <option value={150}>150 sec</option>
        <option value={180}>3 min</option>
      </select>
      <button onClick={() => setStart(!start)} className="btn-lg mt-2">
        { !start ? "Start" : formatTime(timeLeft) }
      </button>
    </div>
  );
}