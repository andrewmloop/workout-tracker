import React, { useEffect } from "react";

export default function Notification(props) {
  const notifText = props.notifText || "Notification";
  const color = props.notifType ? "bg-green-400" : "bg-red-400";

  useEffect(() => {
    setTimeout(() => {
      props.setShowNotif(false);
    }, 3000);
  }, [props.showNotif]);

  return (
    <>
      <div className={`absolute bottom-[72px] left-[50%] translate-x-[-50%] text-center w-[85%] p-4 rounded-lg ${props.showNotif ? "opacity-1" : "opacity-0 pointer-events-none"} ${color}`}>
        <p>{notifText}</p>
      </div>
    </>
  );
}