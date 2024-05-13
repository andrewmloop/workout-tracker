import React from "react";

const NotifContext = React.createContext({});

const NotifProvider = ({ children }) => {
  const [notifStore, setNotifStore] = React.useState({
    text: "",
    isSuccess: true,
    show: false,
  });

  return (
    <NotifContext.Provider value={[notifStore, setNotifStore]}>
      {children}
    </NotifContext.Provider>
  );
};

const useNotif = () => {
  const [notifStore, setNotifStore] = React.useContext(NotifContext);

  const dispatchNotif = (notifText, isSuccess) => {
    setNotifStore({
      text: notifText,
      isSuccess: isSuccess,
      show: true,
    });
  };

  const clearNotif = () => {
    setNotifStore({
      text: "",
      isSuccess: true,
      show: false,
    });
  };

  return { notifStore, dispatchNotif, clearNotif };
};

export { NotifProvider, useNotif };
