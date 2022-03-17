import React from "react";
import { useNavigate } from "react-router-dom";

export const Banner = (props) => {
  const navigate = useNavigate();

  return (
    <div className="sticky top-0 left-0 w-full bg-black p-4 text-white">
      <div className="flex justify-between items-center">
        <button onClick={() => navigate(-1)}>
          Back
        </button>
        <h1>{props.bannerText}</h1>
        <button>
          Add
        </button>
      </div>
    </div>
  );
};