import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

export const Routine = (props) => {
  // Routine data from route history
  const location = useLocation();
  const routineData = location.state.routine;

  // Routine exercise state
  const [exerciseList, setExerciseList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const fetchRoutineExercises = () => {
    routineData.exercise_list.map( async (exercise) => {
      try {
        const response = await fetch(`http://localhost:9900/exercise/${exercise.exercise}`);
        const data = await response.json();
        setExerciseList([...exerciseList, data]);
      } catch (error) {
        console.error("Error fetching routine exercise: ", error);
        setError(true);
      }
    });

    setLoading(false);
  };

  useEffect( () => {
    props.setBannerText(routineData.name);
    fetchRoutineExercises();
  }, []);

  if (loading) return "Loading...";
  if (error) return "Error!";

  return (
    <div className="p-8 text-center text-white">
      <ul className="flex flex-col justify-start text-left">
        {
          exerciseList.map( exercise => {
            return (
              <li 
                key={exercise._id}
                className="mb-2 py-2 border-b-2"
              >{exercise.name}</li>
            );
          })
        }
      </ul>
    </div>
  );
};