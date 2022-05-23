import React, { useCallback, useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

import Banner from "../components/Banner";
import Loading from "../components/Loading";
import RightArrowSVG from "../components/RightArrowSVG";

import { useNotif } from "../context/NotificationContext";


export default function ExerciseList({ addMode, setAddMode, activeRoutine, newExercises, setNewExercises }) {
  const { handleNotif } = useNotif();
  const navigate = useNavigate();

  const [fetchList, setFetchList] = useState([]);
  const [searchList, setSearchList] = useState([]);
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
      setLoading(true);
      const res = await fetch(`/api/exercise/list${route}`, {
        headers: {
          "x-access-token": localStorage.getItem("token")
        }
      });
      const data = await res.json();
      if (data.isLoggedIn === false) {
        navigate("/");
        let loginText = "Your session has expired";
        handleNotif(loginText, true, true);
      } else if (res.status === 200) {
        setFetchList(data.data);
        setSearchList(data.data);
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.error("Error fetching exercise list: ", error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const addRoutineExercises = async exercisesToAdd => {
    if (exercisesToAdd.length > 0) {
      try {
        const res = await fetch(`/api/routine/upd-routine/${activeRoutine}`, {
          method: "POST",
          headers: {
            "x-access-token": localStorage.getItem("token"),
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ newExercises: exercisesToAdd })
        });
        const data = await res.json();
        if (res.status === 200) {
          handleNotif(data.message, true, true);
        } else {
          handleNotif(data.message, false, true);
        }
      } catch (error) {
        console.error("Error fetching exercise list: ", error);
        let errorText = "The iron gods are displeased at the moment";
        handleNotif(errorText, false, true);
      } finally {
        setAddMode(false);
        setNewExercises([]);
        navigate("/routine");
      }
    } else {
      setAddMode(false);
      setNewExercises([]);
      navigate("/routine");
    }
  };

  useEffect( () => {
    fetchExercises(muscleGroup);
  }, []);
  
  return (
    <>
      {addMode
        ? <Banner
          bannerText="Add Exercises"
          showBack={true}
          showAdd={true}
          addText="Finish"
          addFunction={() => addRoutineExercises(newExercises)}
        />
        : <Banner 
          bannerText={muscleGroupLabel} 
          showBack={true}
        />
      }
      <div className="p-6 h-full">
        <SearchField setSearchList={setSearchList} fetchList={fetchList} />
        {
          loading
            ? <Loading text="Moving the weights around..." />
            : <ul className="flex flex-col justify-start mb-20">
              {
                searchList.map( exercise => {
                  return (
                    <ListItem 
                      key={exercise._id} 
                      exercise={exercise} 
                      addMode={addMode}
                      newExercises={newExercises}
                      setNewExercises={setNewExercises}
                    />
                  );
                })
              }
            </ul>
        }
      </div>
    </>
  );
}

function ListItem({ exercise, addMode, newExercises, setNewExercises }) {
  const [isClicked, setIsClicked] = useState(newExercises.indexOf(exercise._id) > -1);

  const handleClick = () => {
    let list = [...newExercises];
    
    let index = list.indexOf(exercise._id);
    if (index > -1) {
      list.splice(index, 1);
    } else {
      list.push(exercise._id);
    }

    setNewExercises(list);
    setIsClicked(!isClicked);
  };

  return (
    <li className="flex justify-between items-center py-3 border-b-[1px] border-gray-500 text-white">
      <Link to="/exercise/detail"
        state={{ "exercise": exercise }}
        className="block py-1 whitespace-nowrap overflow-x-hidden text-ellipsis"
      >{exercise.name}</Link>
      {addMode 
        ? <button 
          onClick={() => handleClick()}
          className={`${isClicked ? "btn-deny" : "btn-confirm"} ml-4`}
        >{isClicked ? "Remove" : "Add"}</button>
        : <RightArrowSVG />
      }
    </li>
  );
}

function SearchField({ setSearchList, fetchList }) {

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

  return (
    <div className="w-full mb-4">
      <input id="search" name="search" type="text"
        placeholder="Search exercises"
        onChange={(e) => debounceSearch(e.target.value, fetchList)}
        className="w-full text-input"
      /> 
    </div>
  );
}