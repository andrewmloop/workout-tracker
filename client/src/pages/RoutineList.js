import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import Banner from "../components/Banner";
import Loading from "../components/Loading";

export default function RoutineList() {

  const [routineList, setRoutineList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const navigate = useNavigate();
 
  const fetchRoutines = async () => {
    setLoading(true);

    try {
      const res = await fetch("http://localhost:9900/routine/list", {
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
  }, []);

  if (error) return "Error!";
  if (loading) {
    return (
      <>
        <Banner
          bannerText="Routine"
          showAdd={true}
          addFunction={() => navigate("/routine/add")}
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
        addFunction={() => navigate("/routine/add")}
      />
      <div className="p-8">
        <ul className="flex flex-col justify-start">
          {
            routineList.map( routine => {
              return (
                <li 
                  key={routine._id}
                  className="mb-2 py-2 border-b-[1px] border-gray-500 text-white"
                >
                  <Link 
                    to="detail"
                    state={{ "routine": routine }}
                    className="block"
                  >{routine.name}</Link>
                </li>
              );
            })
          }
        </ul>
      </div>
    </>
  );
}