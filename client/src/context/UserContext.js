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

const useUser = () => {
  const [userStore, setUserStore] = React.useContext(UserContext);

  const handleUser = (newUserState) => {
    setUserStore(newUserState);
  };

  return { userStore: userStore, handleUser: handleUser };
};

export { UserProvider, useUser };
