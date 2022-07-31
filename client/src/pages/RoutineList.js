import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import Banner from "../components/Banner";
import Loading from "../components/Loading";
import EditButtons from "../components/EditButtons";
import RightArrowSVG from "../components/RightArrowSVG";
import PageTransition from "../components/PageTransition";

import { useNotif } from "../context/NotificationContext";

export default function RoutineList() {
  const navigate = useNavigate();
  const { handleNotif } = useNotif();

  const [routineList, setRoutineList] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [shouldRerender, setShouldRerender] = useState(false);
 
  const fetchRoutines = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/routine/list", {
        headers: {
          "x-access-token": localStorage.getItem("token"),
        }
      });
      const data = await res.json();
      if (data.isLoggedIn === false) {
        navigate("/");
        let loginText = "Your session has expired";
        handleNotif(loginText, true, true);
      } 
      if (res.status === 200) {
        setRoutineList(data.data);
      }
    } catch (error) {
      console.error("Error fetching routine list: ", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect( () => {
    fetchRoutines();
  }, [shouldRerender]);

  return (
    <>
      <Banner bannerText="Routines" />
      <PageTransition>
        <div className="p-6">
          <EditButtons 
            editFunction={() => setEditMode(prev => !prev)} 
            editMode={editMode}
            addFunction={() => navigate("add")}
          /> 
          {
            loading
              ? <Loading text="Turning the lights on..." />
              : <ul className="flex flex-col justify-start">
                { 
                  routineList.map( routine => {
                    return <RoutineItem 
                      key={routine._id} 
                      routine={routine} 
                      setShouldRerender={setShouldRerender}
                      editMode={editMode}
                    />;
                  })
                }
              </ul>
          }
        </div>
      </PageTransition>
    </>
  );
}

function RoutineItem({ routine, setShouldRerender, editMode }) {
  const navigate = useNavigate();
  const { handleNotif } = useNotif();

  const deleteRoutine = async (id) => {
    try {
      const res = await fetch(`/api/routine/delete/${id}`, {
        method: "DELETE",
        headers: {
          "x-access-token": localStorage.getItem("token"),
        }
      });
      const data = await res.json();
      if (data.isLoggedIn === false) {
        navigate("/");
        let loginText = "Your session has expired";
        handleNotif(loginText, true, true);
      } else if (res.status === 200) {
        handleNotif(data.message, true, true);
        setShouldRerender(prev => !prev);
      } else {
        handleNotif(data.message, false, true);
      }
    } catch (error) {
      console.error("Error fetching routine list: ", error);
      let errorText = "The iron gods are upset at the moment";
      handleNotif(errorText, false, true);
    }
  };

  const renameRoutine = (id, name) => {
    navigate("update", {
      state: {
        routineId: id,
        routineName: name
      }
    });
  };

  return (
    <>
      <li className="flex justify-between items-center py-3 border-b-[1px] border-gray-500 text-white">
        <Link 
          to="detail"
          state={{ "routine": routine }}
          className="block w-full text-lg py-1"
        >{routine.name}</Link>
        { editMode 
          ? <div className="flex">
            <RenameButton 
              renameFunction={() => renameRoutine(routine._id, routine.name)} 
            />
            <DeleteButton deleteFunction={() => deleteRoutine(routine._id)} />
          </div>
          : <RightArrowSVG />
        }
      </li>
    </>
  );
}

function DeleteButton({ deleteFunction }) {
  return (
    <button onClick={deleteFunction} className="btn-deny ml-4">Delete</button>
  );
}

function RenameButton( { renameFunction }) {
  return (
    <button onClick={ renameFunction } className="btn ml-4">Rename</button>
  );
}