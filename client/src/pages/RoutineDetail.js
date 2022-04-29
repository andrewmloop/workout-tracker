import React, { useState } from "react";
import { useLocation, Link } from "react-router-dom";

import Banner from "../components/Banner";

export default function RoutineDetail() {
  // Routine data from route history
  const location = useLocation();
  const routineData = location.state.routine;

  // Routine exercise state
  const [exerciseList] = useState(routineData.exercise_list);

  return (
    <>
      <Banner
        bannerText={routineData.name}
        showBack={true}
        showAdd={true}
      />
      <div className="p-8 text-center text-white">
        <ul className="flex flex-col justify-start text-left">
          {
            exerciseList.map( exercise => <DetailItem key={exercise._id} exercise={exercise} />)
          }
        </ul>
      </div>
    </>
  );
}

function DetailItem({ exercise }) {
  return (
    <li 
      key={exercise._id}
      className="flex justify-between items-center mb-2 py-2 border-b-[1px] border-gray-500"
    >
      <Link 
        to="/exercise/detail"
        state={{ "exercise": exercise }}
        className="block w-full"
      >{exercise.name}</Link>
      <Link
        to="/routine/log"
        state={{ "exercise": exercise }}
        className="btn"
      >Log</Link>
    </li>
  );
}