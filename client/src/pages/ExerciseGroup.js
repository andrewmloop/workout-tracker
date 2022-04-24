import React from "react";
import { Link } from "react-router-dom";
import Banner from "../components/Banner";


export default function ExerciseGroup() {
  return (
    <>
      <Banner
        bannerText="Muscle Group"
      />
      <div className="h-full p-8">
        <ul className="flex flex-col justify-start">
          <GroupItem text="All Exercises" group="/all" />
          <GroupItem text="Abdominals" group="/abs" />
          <GroupItem text="Arms" group="/arms" />
          <GroupItem text="Back" group="/back" />
          <GroupItem text="Chest" group="/chest" />
          <GroupItem text="Shoulders" group="/shoulders" />
          <GroupItem text="Legs" group="/legs" />
          <GroupItem text="Cardio" group="/cardio" />
          <GroupItem text="Stretching" group="/stretch" />
        </ul>
      </div>
    </>
  );
}

function GroupItem(props) {
  return (
    <li className="mb-2 py-2 border-b-2 text-white">
      <Link
        to="/exercise/list"
        state={{"group": props.group,
          "text": props.text}}
        className="block"
      >{props.text}</Link>
    </li>
  );
}