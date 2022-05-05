import React from "react";

export default function Loading(props) {
  return (
    <div className="h-[75vh] flex flex-col justify-center items-center m-auto">
      <svg xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" width="100px" height="100px" viewBox="0 0 50 50" preserveAspectRatio="xMidYMid" className="mb-2">
        <circle cx="25" cy="25" r="16" strokeWidth="4" stroke="#ffffff" strokeDasharray="50.26548245743669 50.26548245743669" fill="none" strokeLinecap="round">
          <animateTransform attributeName="transform" type="rotate" dur="1s" repeatCount="indefinite" keyTimes="0;1" values="0 25 25;360 25 25"></animateTransform>
        </circle>
        <circle cx="25" cy="25" r="11.5" strokeWidth="4" stroke="#fbbf24" strokeDasharray="36.12831551628262 36.12831551628262" strokeDashoffset="36.12831551628262" fill="none" strokeLinecap="round">
          <animateTransform attributeName="transform" type="rotate" dur="1s" repeatCount="indefinite" keyTimes="0;1" values="0 25 25;-360 25 25"></animateTransform>
        </circle>
      </svg>
      <p className="text-white">{props.text}</p>
    </div>
  );
}