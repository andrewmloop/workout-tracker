import React, { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";

import Banner from "../components/Banner";
import Loading from "../components/Loading";

export default function RoutineDetail() {
  // Routine data from route history
  const location = useLocation();
  const routineData = location.state.routine;

  // Routine exercise state
  const [exerciseList, setExerciseList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const fetchRoutineExercises = async () => {
    setLoading(true);

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
      setLoading(false);
    }).catch( error => {
      console.error("Error fetching routine exercises: ", error);
      setError(true);
      setLoading(false);
    });
  };

  useEffect( () => {
    fetchRoutineExercises();
  }, []);

  if (error) return "Error!";
  if (loading) {
    return (
      <>
        <Banner
          bannerText={routineData.name}
          showBack={true}
          showAdd={true}
        />
        <Loading text="Stretching out..." />
      </>
    );
  }

  return (
    <>
      <Banner
        bannerText={routineData.name}
        showBack={true}
        showAdd={true}
      />
      <div className="p-8 text-center text-white">
        <ul className="flex flex-col justify-start text-left">
          {
            exerciseList.map( exercise => {
              return (
                <li 
                  key={exercise._id}
                  className="flex justify-between items-center mb-2 py-2 border-b-[1px] border-gray-500"
                >
                  <Link 
                    to="/exercise/detail"
                    state={{ "exercise": exercise }}
                    className="block w-full"
                  >{exercise.name}</Link>
                  <Link
                    to="/routine/log"
                    state={{ "exercise": exercise }}
                    className="px-4 py-1 bg-amber-400 rounded-md font-semibold text-gray-700"
                  >Log</Link>
                </li>
              );
            })
          }
        </ul>
      </div>
    </>
  );
}