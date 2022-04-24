import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import Banner from "../components/Banner";
import Loading from "../components/Loading";

import { useExerciseList } from "../context/ExerciseListContext";

export default function ExerciseList() {
  // Global exercise store to cut down on number of fetch calls
  const { exerciseListStore, fetchExercises } = useExerciseList();

  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  // Get muscle group to fetch from state passed by React
  // Router Link component
  const location = useLocation();

  const muscleGroup = location.state.group || "/all";
  const muscleGroupLabel = location.state.text;

  useEffect( async () => {
    setLoading(true);
    const isSuccess = await fetchExercises(muscleGroup);
    if (!isSuccess) setError(true);
    setLoading(false);
  }, [muscleGroup]);

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
                  <Link to="/exercise/detail"
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