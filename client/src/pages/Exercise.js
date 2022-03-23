import React from "react";
import { useLocation } from "react-router-dom";
import Banner from "../components/Banner";

// function capitalizeFirstLetter(string) {
//   return string.charAt(0).toUpperCase() + string.slice(1);
// }

export default function Exercise() {
  // Exercise data passed from ExerciseList page to avoid multiple requests
  const location = useLocation();
  const data = location.state.exercise;
  
  return (
    <>
      <Banner
        bannerText={"Exercise Details"}
        showBack={true}
      />
      <div className="p-8 text-center text-white">
        <h1 className="font-bold mb-4">{data.name}</h1>
        <p>{data.level} | {data.force} | {data.category}</p>
        <p>{data.category} | {data.mechanic}</p>
        <p>{data.equipment}</p>
        { data.primary_muscles.map( (muscle, i) => {
          return <p key={i}>{muscle}</p>;
        })}
        { data.secondary_muscles.map( (muscle, i) => {
          return <p key={i}>{muscle}</p>;
        })}
        { data.instructions.map( (line, i) => {
          return <p key={i}>{line}</p>;
        })}
      </div>
    </>
  );
}