import React from "react";
import { useTimer } from "../context/TimerContext";

export default function Timer() {
  const { timerStore, setRestTime, setTimeLeft, toggleTimer, endTimer } =
    useTimer();

  const formatTime = (secs) => {
    let time = new Date(0);
    time.setSeconds(secs);
    return time.toISOString().slice(14, 19);
  };

  const handleSelect = (e) => {
    setRestTime(e.target.value);
    endTimer();
  };

  const handleClick = () => {
    setTimeLeft(timerStore.restTime);
    toggleTimer();
  };

  return (
    <div className="w-full flex flex-col">
      <label htmlFor="rest-time" className="text-sm text-gray-400 font-bold">
        Rest Time
      </label>
      <select
        id="rest-time"
        value={timerStore.restTime}
        onChange={(e) => handleSelect(e)}
        className="timer z-[50] mb-2"
      >
        <option value={30}>30 sec</option>
        <option value={60}>1 min</option>
        <option value={90}>90 sec</option>
        <option value={120}>2 min</option>
        <option value={150}>150 sec</option>
        <option value={180}>3 min</option>
      </select>
      <button onClick={() => handleClick()} className="log-submit">
        {timerStore.isTicking ? formatTime(timerStore.timeLeft) : "Start"}
      </button>
    </div>
  );
}
