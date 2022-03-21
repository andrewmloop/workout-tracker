import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export const ExerciseList = (props) => {
  const [exerciseList, setExerciseList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect( () => {
    props.setBannerText("Exercises");
    fetchExercises();
  }, []);

  const fetchExercises = async () => {
    try {
      const res = await fetch("http://localhost:9900/exercise/list", {
        headers: {
          "x-access-token": localStorage.getItem("token")
        }
      });
      const data = await res.json();
      setExerciseList(data);
    } catch (error) {
      console.error("Error fetching exercise list: ", error);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return "Loading...";
  if (error) return "Error!";

  return (
    <div className="p-8 h-full overflow-y-scroll">
      <ul className="flex flex-col justify-start">
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