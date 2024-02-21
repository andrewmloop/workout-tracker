import React from "react";

const UserContext = React.createContext(null);

const UserProvider = ({ children }) => {
  const [userStore, setUserStore] = React.useState({});

  return (
    <UserContext.Provider value={[userStore, setUserStore]}>
      {children}
    </UserContext.Provider>
  );
};

const useUserStore = () => {
  const [userStore, setUserStore] = React.useContext(UserContext);

  const setUser = (newUserState) => {
    setUserStore(newUserState);
  };

  const getUser = () => {
    return userStore;
  };

  return { getUser: getUser, setUser: setUser };
};

export { UserProvider, useUserStore };
