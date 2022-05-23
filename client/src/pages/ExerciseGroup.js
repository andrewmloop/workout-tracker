import React from "react";
import { Link } from "react-router-dom";
import Banner from "../components/Banner";
import RightArrowSVG from "../components/RightArrowSVG";
import PageTransition from "../components/PageTransition";


export default function ExerciseGroup({ addMode }) {
  return (
    <>
      <Banner
        bannerText={addMode ? "Add Exercises" : "Muscle Group"}
      />
      <PageTransition>
        <div className="h-full p-6">
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
      </PageTransition>
    </>
  );
}

function GroupItem(props) {
  return (
    <li className=" flex justify-between items-center py-3 border-b-[1px] border-gray-500 text-white">
      <Link
        to="/exercise/list"
        state={{"group": props.group,
          "text": props.text}}
        className="block py-1"
      >{props.text}</Link>
      <RightArrowSVG />
    </li>
  );
}