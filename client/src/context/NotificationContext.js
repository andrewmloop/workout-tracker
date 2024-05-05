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

  const handleNotif = (newNotifText, isSuccess, showNotif) => {
    setNotifStore({
      text: newNotifText,
      isSuccess: isSuccess,
      show: showNotif,
    });
  };

  const clearNotif = () => {
    setNotifStore({
      text: "",
      isSuccess: true,
      show: false,
    });
  };

  return { notifStore, handleNotif, clearNotif };
};

export { NotifProvider, useNotif };
