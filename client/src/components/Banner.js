import React from "react";
import { useNavigate } from "react-router-dom";

export default function Banner({ bannerText, showBack, showAdd, addFunction, addText, targSets, targReps }) {

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
          { showAdd && <AddButton addFunction={addFunction} addText={addText} /> }
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
        <svg width={24} height={24} viewBox="0 0 24 24" stroke="white" strokeWidth={3} strokeLinecap="round">
          <line x1="8" x2="16" y1="12" y2="20" />
          <line x1="8" x2="16" y1="12" y2="4" />
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