import React from "react";
import { useNavigate } from "react-router-dom";

export default function Banner(props) {
  const navigate = useNavigate();

  const showBack = props.showBack;
  const showAdd = props.showAdd;

  return (
    <div className="sticky top-0 left-0 w-full bg-black p-4 text-white">
      <div className="flex justify-between items-center text-center">
        { showBack 
          ? <button onClick={() => navigate(-1)}>Back</button> 
          : undefined
        }
        <h1>{props.bannerText}</h1>
        { showAdd 
          ? <button>Add</button> 
          : undefined
        }
      </div>
    </div>
  );
}