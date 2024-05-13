import React, { createContext, useContext, useState } from "react";
import { useNotif } from "./NotificationContext";
import { useInterval } from "../hooks/UseInterval";

const TimerContext = createContext({
  restTime: 30,
  startTime: 0,
  timeLeft: 0,
  isTicking: false,
});

export const TimerContextProvider = ({ children }) => {
  const { dispatchNotif } = useNotif();
  const [timerStore, setTimerStore] = useState({
    restTime: 30,
    startTime: 0,
    timeLeft: 0,
    isTicking: false,
  });

  const endTimer = () => {
    setTimerStore((prev) => ({
      ...prev,
      isTicking: false,
    }));
  };

  const setTimeLeft = (time) => {
    setTimerStore((prev) => ({
      ...prev,
      timeLeft: time,
    }));
  };

  const calcTimeLeft = () => {
    let now = new Date();
    let remainingTime =
      timerStore.restTime - Math.floor((now - timerStore.startTime) / 1000);
    if (remainingTime <= 0) remainingTime = 0;
    if (timerStore.timeLeft > 0) setTimeLeft(remainingTime);
  };

  const dispatchTimerNotif = () => {
    // Update notif store to trigger notif
    dispatchNotif("Rest timer done", true);

    // Reset TimerStore
    endTimer();
  };

  // Updates timeLeft every second if the timer is ticking
  useInterval(() => {
    if (timerStore.isTicking) {
      calcTimeLeft();
    }

    if (timerStore.isTicking && timerStore.timeLeft <= 0) {
      dispatchTimerNotif();
    }
  }, 1000);

  return (
    <TimerContext.Provider value={[timerStore, setTimerStore]}>
      {children}
    </TimerContext.Provider>
  );
};

export const useTimer = () => {
  const [timerStore, setTimerStore] = useContext(TimerContext);

  const setRestTime = (time) => {
    setTimerStore((prev) => ({
      ...prev,
      restTime: time,
    }));
  };

  const setTimeLeft = (time) => {
    setTimerStore((prev) => ({
      ...prev,
      timeLeft: time,
    }));
  };

  const toggleTimer = () => {
    let now = new Date();
    setTimerStore((prev) => ({
      ...prev,
      startTime: now,
      isTicking: !prev.isTicking,
    }));
  };

  const endTimer = () => {
    setTimerStore((prev) => ({
      ...prev,
      isTicking: false,
    }));
  };

  return {
    timerStore,
    setRestTime,
    setTimeLeft,
    toggleTimer,
    endTimer,
  };
};
