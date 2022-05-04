import React, { useEffect, useState } from "react";

export default function Timer() {
  const [restTime, setRestTime] = useState(30);
  const [timeLeft, setTimeLeft] = useState(0);
  const [start, setStart] = useState(false);

  const formatTime = (secs) => {
    let time = new Date(0);
    time.setSeconds(secs);
    return time.toISOString().slice(14, 19);
  };

  useEffect(() => {
    if (start) {
      let timerInterval = setInterval(() => {
        if (timeLeft > 0) setTimeLeft(timeLeft - 1);
        if (timeLeft === 0) {
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
    if (start) setTimeLeft(restTime);
    if (!start) setTimeLeft(0);
  }, [start]);

  return (
    <div className="w-full flex flex-col mt-2">
      <select value={restTime} onChange={(e) => setRestTime(e.target.value)} className="timer">
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