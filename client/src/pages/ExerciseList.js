import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Banner from "../components/Banner";

export default function ExerciseList(props) {
  const [error, setError] = useState(false);

  // Sets "exerciseList" passed down from app component on first
  // render. Pulls from "exerciseList" state on subsequent renders
  // to avoid excessive requests
  useEffect( () => {
    if (props.exerciseList.length === 0) {
      fetchExercises();
    }
  }, []);

  const fetchExercises = async () => {
    try {
      const res = await fetch("http://localhost:9900/exercise/list", {
        headers: {
          "x-access-token": localStorage.getItem("token")
        }
      });
      const data = await res.json();
      props.setExerciseList(data);
    } catch (error) {
      console.error("Error fetching exercise list: ", error);
      setError(true);
    }
  };

  if (error) return "Error!";

  return (
    <>
      <Banner 
        bannerText={"Exercises"} 
        showAdd={true}
      />
      <div className="p-8 h-full overflow-y-scroll">
        <ul className="flex flex-col justify-start">
          {
            props.exerciseList.map( exercise => {
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
    </>
  );
}