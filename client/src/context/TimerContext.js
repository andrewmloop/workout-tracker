import React, { createContext, useContext, useState } from "react";

const TimerContext = createContext({
  restTime: 30,
  startTime: 0,
  timeLeft: 0,
  start: false
});

export const TimerContextProvider = ({children}) => {
  const [timerStore, setTimerStore] = useState({
    restTime: 30,
    startTime: 0,
    timeLeft: 0,
    start: false
  });

  return (
    <TimerContext.Provider value={[timerStore, setTimerStore]}>
      {children}
    </TimerContext.Provider>
  );
};

export const useTimer = () => {
  const [timerStore, setTimerStore] = useContext(TimerContext);

  const setRestTime = (time) => {
    setTimerStore(prev => ({
      ...prev,
      restTime: time
    }));
  };

  const setStartTime = () => {
    let now = new Date();
    setTimerStore(prev => ({
      ...prev,
      startTime: now
    }));
  };

  const setTimeLeft = (time) => {
    setTimerStore(prev => ({
      ...prev,
      timeLeft: time
    }));
  };

  const toggleTimer = () => setTimerStore(prev => ({
    ...prev,
    start: !prev.start
  }));

  const endTimer = () => setTimerStore(prev => ({
    ...prev,
    start: false
  }));

  return ({
    timerStore,
    setRestTime,
    setStartTime,
    setTimeLeft,
    toggleTimer,
    endTimer
  });
};