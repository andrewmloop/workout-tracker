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

  return { exerciseListStore: exerciseListStore, handleExerciseList: handleExerciseList};
};

export { ExerciseListProvider, useExerciseList };