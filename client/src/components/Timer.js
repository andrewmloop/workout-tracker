import React, { useEffect } from "react";

import { useNotif } from "../context/NotificationContext";
import { useTimer } from "../context/TimerContext";

export default function Timer() {
  const { handleNotif } = useNotif();
  const { 
    timerStore,
    setRestTime,
    setStartTime,
    setTimeLeft,
    toggleTimer,
    endTimer
  } = useTimer();

  const formatTime = (secs) => {
    let time = new Date(0);
    time.setSeconds(secs);
    return time.toISOString().slice(14, 19);
  };

  const handleSelect = (e) => {
    setRestTime(e.target.value);
    endTimer();
  };

  const handleStart = () => {
    toggleTimer();
    setStartTime();
    setTimeLeft(timerStore.restTime);
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

  // Immediately set the timeLeft on mount or the user would have to wait the 1 
  // sec for the timerInterval to update timeLeft in the other useEffect
  // causing the timer to skip seconds if the user is switching between
  // logs.
  useEffect(() => {
    let now = new Date();
    let remainingTime = timerStore.restTime - Math.floor((now - timerStore.startTime) / 1000);
    if (remainingTime < 0) remainingTime = 0;
    if (timerStore.timeLeft > 0) setTimeLeft(remainingTime);
  }, []);

  useEffect(() => {
    /* We are using difference in Date objects to help the timerInterval
    keep track of actual time when the app is in the background. 
    TimerInterval works fine when viewing through a normal browser tab when simply updating the timeLeft state by subtracting 1, but 
    when installed as a PWA, the timer becomes inconsistent which this 
    solves. */
    if (timerStore.start) {
      let timerInterval = setInterval(() => {
        let now = new Date();
        let remainingTime = timerStore.restTime - Math.floor((now - timerStore.startTime) / 1000);
        if (remainingTime < 0) remainingTime = 0;
        if (timerStore.timeLeft > 0) setTimeLeft(remainingTime);
        if (timerStore.timeLeft === 0) {
          // sendNotification();
          clearInterval(timerInterval);
          endTimer();
          handleNotif("Rest timer done", true, true);
        }
      }, 1000);

      return () => {
        clearInterval(timerInterval);
      };
    }
  }, [timerStore.startTime, timerStore.timeLeft]);

  return (
    <div className="w-full flex flex-col">
      <label htmlFor="rest-time" className="text-sm text-gray-400 font-bold">Rest Time</label>
      <select id="rest-time" value={timerStore.restTime} onChange={(e) => handleSelect(e)} className="timer z-[50] mb-2">
        <option value={30}>30 sec</option>
        <option value={60}>1 min</option>
        <option value={90}>90 sec</option>
        <option value={120}>2 min</option>
        <option value={150}>150 sec</option>
        <option value={180}>3 min</option>
      </select>
      <button onClick={() => handleStart()} className="log-submit">
        { timerStore.start ? formatTime(timerStore.timeLeft) : "Start" }
      </button>
    </div>
  );
}