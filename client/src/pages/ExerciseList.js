import React, { useCallback, useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import Banner from "../components/Banner";
import Loading from "../components/Loading";


export default function ExerciseList() {
  const [fetchList, setFetchList] = useState([]);
  const [searchList, setSearchList] = useState([]);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  // Get muscle group to fetch from state passed by React
  // Router Link component
  const location = useLocation();
  const muscleGroup = location.state.group || "/all";
  const muscleGroupLabel = location.state.text;

  // Fetch desired exercise list, store the full copy in fetchList and
  // store a copy in searchList which will be modified with the search function
  const fetchExercises = async route => {
    try {
      const response = await fetch(`http://localhost:9900/exercise/list${route}`, {
        headers: {
          "x-access-token": localStorage.getItem("token")
        }
      });
      const data = await response.json();
      if (data.result === "success") {
        setFetchList(data.data);
        setSearchList(data.data);
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.error("Error fetching exercise list: ", error);
      return false;
    }
  };

  const debounce = (fn, delay) => {
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        fn.apply(this, args);
      }, delay);
    };
  };

  const handleSearch = (input, list) => {
    // If no input, show full copy, else show filtered list
    if (input === "") {
      setSearchList([...list]);
    } else {
      let filter = list.filter( item => {
        if (input === "") return true;
        return item.name.toLowerCase().indexOf(input.toLowerCase()) > -1;
      });
      setSearchList(filter);
    }
  };

  const debounceSearch = useCallback(
    debounce( (input, list) => handleSearch(input, list), 300), []
  );

  useEffect( async () => {
    setLoading(true);
    const isSuccess = await fetchExercises(muscleGroup);
    isSuccess ? setLoading(false) : setError(true);
  }, []);

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
            placeholder="Search exercises"
            onChange={(e) => debounceSearch(e.target.value, fetchList)}
            className="w-full text-input"
          /> 
        </div>
        <ul className="flex flex-col justify-start mb-20">
          {
            searchList.map( exercise => {
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