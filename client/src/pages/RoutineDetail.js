import React, { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import Banner from "../components/Banner";

export default function RoutineDetail() {
  // Routine data from route history
  const location = useLocation();
  const routineData = location.state.routine;

  // Routine exercise state
  const [exerciseList, setExerciseList] = useState([]);
  const [error, setError] = useState(false);

  const fetchRoutineExercises = async () => {
    Promise.all(routineData.exercise_list.map( async (exercise) => {
      const response = await fetch(`http://localhost:9900/exercise/${exercise.exercise}`, {
        headers: {
          "x-access-token": localStorage.getItem("token"),
        }
      });
      const data = await response.json();
      return data;
    })).then( exercises => {
      setExerciseList(...exerciseList, exercises);
    }).catch( error => {
      console.error("Error fetching routine exercises: ", error);
      setError(true);
    });
  };

  useEffect( () => {
    fetchRoutineExercises();
  }, []);

  if (error) return "Error!";

  return (
    <>
      <Banner
        bannerText={routineData.name}
        showBack={true}
        showAdd={true}
      />
      <div className="p-8 text-center text-white">
        <ul className="flex flex-col justify-start text-left">
          {console.log(exerciseList)}
          {
            exerciseList.map( exercise => {
              return (
                <li 
                  key={exercise._id}
                  className="flex justify-between mb-2 py-2 border-b-2"
                >
                  <Link 
                    to="/exercise/detail"
                    state={{ "exercise": exercise }}
                    className="block"
                  >{exercise.name}</Link>
                  <Link
                    to="/routine/log"
                    state={{ "exercise": exercise }}
                  >Add</Link>
                </li>
              );
            })
          }
        </ul>
      </div>
    </>
  );
}