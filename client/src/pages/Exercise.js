import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export const Exercise = (props) => {
  const location = useLocation();
  const data = location.state.exercise;

  useEffect( () => {
    props.setBannerText("Exercise Details");
  }, []);
  
  return (
    <div className="p-8 text-center text-white">
      <h1 className="font-bold mb-4">{data.name}</h1>
      <h3 className="mb-4">Muscle Group: {capitalizeFirstLetter(data.muscle_group)}</h3>
      <p>{data.description}</p>
    </div>
  );
};