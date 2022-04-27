import React, { useCallback, useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import Banner from "../components/Banner";
import Loading from "../components/Loading";

import { useExerciseList } from "../context/ExerciseListContext";

export default function ExerciseList() {
  // Global exercise store to cut down on number of fetch calls
  const { exerciseListStore, fetchExercises } = useExerciseList();

  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  // Get muscle group to fetch from state passed by React
  // Router Link component
  const location = useLocation();

  const muscleGroup = location.state.group || "/all";
  const muscleGroupLabel = location.state.text;

  const debounce = (fn, delay) => {
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        fn.apply(this, args);
      }, delay);
    };
  };

  const handleSearch = (input) => {
    const scopedArray = [];
    exerciseListStore.map( exercise => {
      let lowInput = input.toLowerCase();
      let lowName = exercise.name.toLowerCase();
      if (lowName.includes(lowInput)) {
        scopedArray.push(exercise);
      }
    });
    setSearchResults(scopedArray);
  };

  const debounceSearch = useCallback(
    debounce(input => handleSearch(input), 300),
    []
  );

  useEffect( async () => {
    setLoading(true);
    const isSuccess = await fetchExercises(muscleGroup);
    isSuccess ? setLoading(false) : setError(true);
  }, [muscleGroup]);

  useEffect( () => {  
    debounceSearch(searchInput);
  }, [searchInput]);

  if (error) return "Error!";
  if (loading) {
    return (
      <>
        <Banner 
          bannerText={muscleGroupLabel} 
          showBack={true}
        />
        <div className="h-full">
          <Loading text="Moving the weights around..." />
        </div>
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
        <div className="w-full mb-4">
          <input id="search" name="search" type="text"
            placeholder="Search exercises" value={searchInput}
            onChange={e => setSearchInput(e.target.value)}
            className="w-full px-2 py-1 rounded-sm border-4 border-transparent bg-slate-600 text-white appearance-none focus:border-amber-400"
          /> 
        </div>
        <ul className="flex flex-col justify-start mb-20">
          { // If search results are empty, display entire fetched array
            // otherwise display the matched search results
            (!Array.isArray(searchResults) || !searchResults.length)
              ? exerciseListStore.map( exercise => {
                return (
                  <li key={exercise._id}
                    className="mb-2 py-2 border-b-[1px] border-gray-500 text-white"
                  >
                    <Link to="/exercise/detail"
                      state={{ "exercise": exercise }}
                      className="block"
                    >{exercise.name}</Link>
                  </li>
                );
              })
              : searchResults.map( exercise => {
                return (
                  <li key={exercise._id}
                    className="mb-2 py-2 border-b-[1px] border-gray-500 text-white"
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