import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export const ExerciseList = () => {
  const [exerciseList, setExerciseList] = useState();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetchExercises();
  }, []);

  const fetchExercises = async () => {
    await fetch("http://192.168.0.104:9900/exercise/list")
      .then( response => {
        if (response.ok) {
          return response.json();
        }
        throw response;
      })
      .then( data => {
        setExerciseList(data);
      })
      .catch( error => {
        console.error("Error fetching exercise list: ", error);
        setError(true);
      })
      .finally( () => {
        setLoading(false);
      });
  };

  if (loading) return "Loading...";
  if (error) return "Error!";

  return (
    <div className="p-8">
      <h1 className="text-white text-center font-bold">Exercises</h1>
      <ul className="my-4 flex flex-col justify-start">
        {console.log(exerciseList)}
        {
          exerciseList.map( exercise => {
            return (
              <li 
                key={exercise._id}
                className="mb-2 py-2 border-b-2 text-white"
              >
                <Link 
                  to="/exercise"
                  state={{ "exercise": exercise }}
                  className="block"
                >{exercise.name}</Link>
              </li>
            );
          })
        }
      </ul>
    </div>
  );
};