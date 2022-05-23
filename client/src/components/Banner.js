import React from "react";
import { useNavigate } from "react-router-dom";

export default function Banner({ 
  bannerText, showBack, 
  showAdd, addFunction, addText, 
  targSets, targReps }) {

  return (
    <div className="sticky top-0 left-0 w-full bg-black p-4 text-white">
      <div className="flex justify-between items-center">
        <div className="justify-start flex">
          { showBack && <BackButton /> }
        </div>
        <div className="flex flex-col items-end whitespace-nowrap overflow-x-hidden text-ellipsis ml-[auto]">
          <h1 className="w-full">{bannerText}</h1>
          <div className="flex">
            { targSets && 
              <p className="font-light text-xs text-amber-400">
                Sets: {targSets}&nbsp;
              </p> 
            }
            { targReps && 
              <p className="font-light text-xs text-amber-400">
                Reps: {targReps}
              </p> 
            }
          </div>
        </div>
        <div className="ml-4">
          { showAdd && 
            <AddButton addFunction={addFunction} addText={addText} /> 
          }
        </div>
      </div>
    </div>
  );
}

function BackButton() {
  const navigate = useNavigate();
  
  return (
    <>
      <button onClick={() => navigate(-1)}>
        <svg xmlns="http://www.w3.org/2000/svg" 
          width={"1.25rem"} height={"1.25rem"} viewBox="0 0 330 330"
        >
          <path fill="white" d="M111.213,165.004L250.607,25.607c5.858-5.858,5.858-15.355,0-21.213c-5.858-5.858-15.355-5.858-21.213,0.001  l-150,150.004C76.58,157.211,75,161.026,75,165.004c0,3.979,1.581,7.794,4.394,10.607l150,149.996  C232.322,328.536,236.161,330,240,330s7.678-1.464,10.607-4.394c5.858-5.858,5.858-15.355,0-21.213L111.213,165.004z"/>
        </svg>
      </button>
    </>
  );
}

function AddButton({ addFunction, addText }) {
  const text = addText || "Add";
  return (
    <>
      <button onClick={addFunction} className="btn-banner">{text}</button>
    </>
  );
}