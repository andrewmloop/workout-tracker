import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export const RoutineList = (props) => {
  const [routineList, setRoutineList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect( () => {
    props.setBannerText("Routines");
    fetchRoutines();
  }, []);

  const fetchRoutines = async () => {
    try {
      const res = await fetch("http://localhost:9900/routine/list/621925cd651cd2b3e2bc9936");
      const data = await res.json();
      setRoutineList(data);
    } catch (error) {
      console.log("Error fetching routine list: ", error);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return "Loading...";
  if (error) return "Error!";

  return (
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
                  to="/routine"
                  state={{ "routine": routine }}
                  className="block"
                >{routine.name}</Link>
              </li>
            );
          })
        }
      </ul>
    </div>
  );
};