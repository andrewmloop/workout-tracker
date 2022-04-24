import React from "react";

const NotifContext = React.createContext({});

const NotifProvider = ({children}) => {
  const [notifStore, setNotifStore] = React.useState({});

  return (
    <NotifContext.Provider value={[notifStore, setNotifStore]}>
      {children}
    </NotifContext.Provider>
  );
};

const useNotif = () => {
  const [notifStore, setNotifStore] = React.useContext(NotifContext);

  const handleNotif = (newNotifText, newNotifType, showNotif) => {
    setNotifStore({
      text: newNotifText,
      // true == successful action, false == failed action
      type: newNotifType,
      show: showNotif,
    });
  };

  return { notifStore: notifStore, handleNotif: handleNotif };
};

export { NotifProvider, useNotif };