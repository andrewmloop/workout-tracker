import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export const RoutineList = () => {
  const [routineList, setRoutineList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect( () => {
    fetchRoutines();
  }, []);

  const fetchRoutines = async () => {
    await fetch("http://localhost:9900/routine/list/621925cd651cd2b3e2bc9936")
      .then( response => {
        if (response.ok) {
          return response.json();
        }
        throw response;
      })
      .then( data => {
        setRoutineList(data);
      })
      .catch( error => {
        console.log("Error fetching routine list: ", error);
        setError(true);
      })
      .finally( () => {
        setLoading(false);
      });
  };

  if (loading) return "Loading...";
  if (error) return "Error!";

  return (
    <div className="p-8">
      <h1 className="text-white text-center font-bold">Exercises</h1>
      <ul className="my-4 flex flex-col justify-start">
        {console.log(routineList)}
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