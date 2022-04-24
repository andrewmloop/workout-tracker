import React, { useState } from "react";

const ExerciseListContext = React.createContext(null);

const ExerciseListProvider = ({children}) => {
  const [exerciseListStore, setExerciseListStore] = useState([]);

  return (
    <ExerciseListContext.Provider value={[exerciseListStore, setExerciseListStore]}>
      {children}
    </ExerciseListContext.Provider>
  );
};

const useExerciseList = () => {
  const [exerciseListStore, setExerciseListStore] = React.useContext(ExerciseListContext);

  const handleExerciseList = (newExerciseList) => {
    setExerciseListStore(newExerciseList);
  };

  const fetchExercises = async route => {
    try {
      const response = await fetch(`http://localhost:9900/exercise/list${route}`, {
        headers: {
          "x-access-token": localStorage.getItem("token")
        }
      });
      const data = await response.json();
      if (data.result === "success") {
        handleExerciseList(data.data);
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.error("Error fetching exercise list: ", error);
      return false;
    }
  };

  return { 
    exerciseListStore: exerciseListStore, 
    handleExerciseList: handleExerciseList,
    fetchExercises: fetchExercises,
  };
};

export { ExerciseListProvider, useExerciseList };