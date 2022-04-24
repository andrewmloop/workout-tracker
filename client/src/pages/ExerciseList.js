import React, { useEffect, useState } from "react";
import { Link, useLocation  } from "react-router-dom";
import Banner from "../components/Banner";
import Loading from "../components/Loading";

import { useExerciseList } from "../context/ExerciseListContext";

export default function ExerciseList() {
  // Global exercise store to cut down on number of fetch calls
  const { exerciseListStore, handleExerciseList } = useExerciseList();

  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  // Get muscle group to fetch from state passed by React
  // Router Link component
  const location = useLocation();

  const muscleGroup = location.state.group || "/all";
  const muscleGroupLabel = location.state.text;

  const fetchExercises = async () => {
    setLoading(true);

    try {
      const res = await fetch(`http://localhost:9900/exercise/list${muscleGroup}`, {
        headers: {
          "x-access-token": localStorage.getItem("token")
        }
      });
      const data = await res.json();
      if (data.result === "success") {
        handleExerciseList(data.data);
        setLoading(false);
        setError(false);
      }
    } catch (error) {
      console.error("Error fetching exercise list: ", error);
      setLoading(false);
      setError(true);
    }
  };

  useEffect( () => {
    fetchExercises();
  }, []);

  if (error) return "Error!";
  if (loading) {
    return (
      <>
        <Banner 
          bannerText={muscleGroupLabel} 
          showBack={true}
        />
        <Loading text="Moving the weights around..." />
      </>
    );
  }
  
  return (
    <>
      <Banner 
        bannerText={muscleGroupLabel} 
        showBack={true}
      />
      <div className="p-8 h-full overflow-y-scroll">
        <ul className="flex flex-col justify-start mb-20">
          {
            exerciseListStore.map( exercise => {
              return (
                <li key={exercise._id}
                  className="mb-2 py-2 border-b-[1px] text-white last:border-0"
                >
                  <Link to="/exercise"
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