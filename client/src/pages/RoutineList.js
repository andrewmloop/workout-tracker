import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Banner from "../components/Banner";

export default function RoutineList() {

  const [routineList, setRoutineList] = useState([]);
  const [error, setError] = useState(false);

  const navigate = useNavigate();

  useEffect( () => {
    fetchRoutines();
  }, []);

  const fetchRoutines = async () => {
    try {
      const res = await fetch("http://localhost:9900/routine/list", {
        headers: {
          "x-access-token": localStorage.getItem("token"),
        }
      });
      const data = await res.json();
      setRoutineList(data);
    } catch (error) {
      console.error("Error fetching routine list: ", error);
      setError(true);
    }
  };

  if (error) return "Error!";

  return (
    <>
      <Banner
        bannerText={"Routines"}
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
                  className="mb-2 py-2 border-b-2 text-white"
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