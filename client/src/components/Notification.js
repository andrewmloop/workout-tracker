import React, { useEffect } from "react";
import { useNotif } from "../context/NotificationContext";

export default function Notification() {
  const { notifStore, clearNotif } = useNotif();

  const text = notifStore.text;
  const isSuccess = notifStore.isSuccess;
  const show = notifStore.show;

  const color = isSuccess ? "bg-green-400" : "bg-red-400";

  useEffect(() => {
    if (notifStore.show) {
      setTimeout(() => {
        clearNotif();
      }, 3000);
    }
  }, [notifStore]);

  return (
    <div
      className={`fixed bottom-[-110vh] left-[50%] translate-x-[-50%] text-center w-[85%] p-4 rounded-lg pointer-events-none ${
        show ? "bottom-[5.5rem]" : "bottom-[-110vh]"
      }
       ${color} transition-all duration-300`}
    >
      <p>{text}</p>
    </div>
  );
}
