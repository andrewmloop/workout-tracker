import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import Banner from "../components/Banner";
import Loading from "../components/Loading";

import { useNotif } from "../context/NotificationContext";

export default function RoutineList() {
  const navigate = useNavigate();

  const [routineList, setRoutineList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [shouldRerender, setShouldRerender] = useState(false);
 
  const fetchRoutines = async () => {
    try {
      setLoading(true);
      const res = await fetch("/routine/list", {
        headers: {
          "x-access-token": localStorage.getItem("token"),
        }
      });
      const data = await res.json();
      setRoutineList(data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching routine list: ", error);
      setError(true);
      setLoading(false);
    }
  };

  useEffect( () => {
    fetchRoutines();
  }, [shouldRerender]);

  if (error) return "Error!";
  if (loading) {
    return (
      <>
        <Banner
          bannerText="Routines"
          showAdd={true}
          addFunction={() => navigate("add")}
        />
        <Loading text="Turning the lights on..." />
      </>
    );
  }

  return (
    <>
      <Banner
        bannerText="Routines"
        showAdd={true}
        addFunction={() => navigate("add")}
      />
      <div className="p-8">
        <ul className="flex flex-col justify-start">
          { 
            routineList.map( routine => {
              return <RoutineItem 
                key={routine._id} 
                routine={routine} 
                setShouldRerender={setShouldRerender}
              />;
            })
          }
        </ul>
      </div>
    </>
  );
}

function RoutineItem({ routine, setShouldRerender }) {
  const { handleNotif } = useNotif();
  const [confirmDelete, setConfirmDelete] = useState(false);

  const deleteRoutine = async (id) => {
    try {
      const res = await fetch(`/routine/delete/${id}`, {
        method: "DELETE",
        headers: {
          "x-access-token": localStorage.getItem("token"),
        }
      });
      const data = await res.json();
      if (data.result === "success") {
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

  return (
    <>
      <li className="flex justify-between items-center mb-2 py-2 border-b-[1px] border-gray-500 text-white">
        <Link 
          to="detail"
          state={{ "routine": routine }}
          className="block w-full text-lg"
        >{routine.name}</Link>
        { confirmDelete 
          ? 
          <div className="flex">
            <button onClick={() => deleteRoutine(routine._id)} className="btn-confirm">Confirm</button>
            <button onClick={() => setConfirmDelete(false)} className="ml-3 btn-deny">Deny</button>
          </div>
          : 
          <button onClick={() => setConfirmDelete(true)} className="btn">Delete</button>
        }
      </li>
    </>
  );
}