import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Banner from "../components/Banner";
import PageTransition from "../components/PageTransition";


export default function ExerciseDetail() {
  // Exercise data passed from ExerciseList page to avoid multiple requests
  const location = useLocation();
  const data = location.state.exercise;

  const navigate = useNavigate();
  
  return (
    <>
      <Banner
        bannerText={"Exercise Details"}
        showBack={true}
        showAdd={true}
        addFunction={() => navigate("/chart", {state: {exercise: data}})}
        addText="Chart"
      />
      <PageTransition>
        <div className="p-6 text-center text-white">
          <h1 className="text-xl font-bold mb-2 first-letter:uppercase">{data.name}</h1>
          <div className="flex justify-center">
            <p className="first-letter:uppercase">{data.level}&nbsp;|</p>
            <p className="first-letter:uppercase">&nbsp;{data.category}</p>
          </div>
          <div className="flex justify-center mb-4">
            <p className="first-letter:uppercase">{data.mechanic}</p>
            { (data.mechanic && data.force) && <p>&nbsp;|&nbsp;</p>}
            <p className="first-letter:uppercase">{data.force}</p>
          </div>
          <h2 className="font-bold">Equipment</h2>
          <p className="first-letter:uppercase mb-4">{data.equipment || "None"}</p>
          <h2 className="font-bold">Primary Muscles</h2>
          <div className="mb-4">
            { 
              data.primaryMuscles.map( (muscle, i) => {
                return <p key={i} className="first-letter:uppercase">{muscle}</p>;
              })
            }
          </div>
          <h2 className="font-bold">Instructions</h2>
          <div className="text-justify mb-20">{data.instructions.join(" ")}</div>
        </div>
      </PageTransition>
    </>
  );
}