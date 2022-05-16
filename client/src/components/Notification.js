import React, { useEffect } from "react";

import { useNotif } from "../context/NotificationContext";

export default function Notification() {
  const { notifStore, handleNotif } = useNotif();

  const text = notifStore.text;
  const type = notifStore.type;
  const show = notifStore.show;

  const color = type ? "bg-green-400" : "bg-red-400";

  useEffect(() => {
    if (notifStore.show) {
      setTimeout(() => {
        handleNotif(text, type, false);
      }, 3000);
    }
  }, [notifStore]);

  return (
    <>
      <div className={`fixed bottom-[5.5rem] left-[50%] translate-x-[-50%] text-center w-[85%] p-4 rounded-lg ${show ? "bottom-[5.5rem]" : "bottom-[-110vh] pointer-events-none"} ${color} transition-all duration-300`}>
        <p>{text}</p>
      </div>
    </>
  );
}