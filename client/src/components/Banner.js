import React from "react";
import { useNavigate } from "react-router-dom";

export default function Banner({ bannerText, showBack, showAdd, addFunction, addText }) {

  return (
    <div className="sticky top-0 left-0 w-full bg-black p-4 text-white">
      <div className="grid grid-cols-3">
        <div className="justify-self-start">
          { showBack && <BackButton /> }
        </div>
        <h1 className="w-full text-center whitespace-nowrap justify-self-center">{bannerText}</h1>
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
      <button onClick={() => navigate(-1)}>Back</button>
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