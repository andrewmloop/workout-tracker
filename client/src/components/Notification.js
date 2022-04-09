import React, { useEffect, useState } from "react";

export default function Notification(props) {
  const [show, setShow] = useState(false);
  const notifText = props.notifText || "Notification";
  const notifType = props.notifType || true;

  const color = notifType ? "bg-green-700" : "bg-red-400";

  useEffect(() => {
    setShow(true);
    setTimeout(() => {
      setShow(false);
    }, 3000);
  }, [props.showNotif]);

  return (
    <>
      <div className={`absolute bottom-[72px] left-[50%] translate-x-[-50%] text-center w-[85%] p-4 rounded-lg ${show ? "" : "hidden pointer-events-none"} ${color}`}>
        <p>{notifText}</p>
      </div>
    </>
  );
}