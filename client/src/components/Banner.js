import React from "react";
import { useNavigate } from "react-router-dom";

export default function Banner({ bannerText, showBack, showAdd, addFunction, addText }) {

  return (
    <div className="sticky top-0 left-0 w-full bg-black p-4 text-white">
      <div className="grid grid-cols-[1fr_4fr_1fr] items-center">
        <div className="justify-self-start flex">
          { showBack && <BackButton /> }
        </div>
        <div className="text-center whitespace-nowrap text-ellipsis overflow-x-hidden">
          <h1>{bannerText}</h1>
        </div>
        <div className="justify-self-end">
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
      <button onClick={addFunction}>{text}</button>
    </>
  );
}