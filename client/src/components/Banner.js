import React from "react";
import { useNavigate } from "react-router-dom";

export default function Banner(props) {
  const navigate = useNavigate();

  const showBack = props.showBack;
  const showAdd = props.showAdd;
  const addFunction = props.addFunction;

  return (
    <div className="sticky top-0 left-0 w-full bg-black p-4 text-white">
      <div className="grid grid-cols-3">
        <div className="justify-self-start">
          { showBack 
            ? <button onClick={() => navigate(-1)}>Back</button> 
            : undefined
          }
        </div>
        <h1 className="justify-self-center">{props.bannerText}</h1>
        <div className="justify-self-end">
          { showAdd 
            ? <button onClick={addFunction}>Add</button> 
            : undefined
          }
        </div>
      </div>
    </div>
  );
}