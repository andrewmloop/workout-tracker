import React, { useState } from "react";
import { useLocation, Link } from "react-router-dom";

import Banner from "../components/Banner";

import { useNotif } from "../context/NotificationContext";

export default function RoutineDetail() {
  const { handleNotif } = useNotif();
  // Routine data from route history
  const location = useLocation();
  const routineData = location.state.routine;

  // Routine exercise state
  const [exerciseList] = useState(routineData.exercise_list);
  const [showControls, setShowControls] = useState(false);
  const [editMode, setEditMode] = useState(false);

  const deleteExercise = async (exerciseId) => {
    try {
      const res = await fetch(`http://localhost:9900/routine/del-exercise/${routineData._id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-access-token": localStorage.getItem("token"),
        },
        body: JSON.stringify({ exercise_list_id: exerciseId})
      });
      const data = await res.json();
      if (data.result === "success") {
        handleNotif(data.message, true, true);
      } else {
        handleNotif(data.message, false, true);
      }
    } catch (error) {
      console.error("Error deleting routine exercise: ", error);
      let errorText = "The iron gods are upset at the moment";
      handleNotif(errorText, false, true);
    }
  };

  return (
    <>
      <Banner
        bannerText={routineData.name}
        showBack={true}
        showAdd={true}
        addFunction={() => {
          setShowControls(prev => !prev);
          // Quit from edit mode if master edit button is click
          // This prevents the delete button from displaying even
          // when the user expects to have left edit mode
          if (editMode) setEditMode(false);
        }}
        addText="Edit"
      />
      <div className="p-8 text-center text-white">
        { showControls 
          && <EditButtons 
            editFunction={() => setEditMode(prev => !prev)} 
            editMode={editMode} 
          /> 
        }
        <div>
          <ul className="flex flex-col justify-start text-left">
            {
              exerciseList.map( exercise => {
                return <DetailItem 
                  key={exercise._id} 
                  exercise={exercise}
                  editMode={editMode}
                  deleteFunction={() => deleteExercise(exercise._id)}
                />;
              })
            }
          </ul>
        </div>
      </div>
    </>
  );
}

function DetailItem({ exercise, editMode, deleteFunction }) {
  return (
    <li 
      key={exercise._id}
      className="flex justify-between items-center mb-2 py-2 border-b-[1px] border-gray-500"
    >
      <Link 
        to="/exercise/detail"
        state={{ "exercise": exercise }}
        className="block w-full"
      >{exercise.name}</Link>
      {
        editMode
          ? <DeleteButton deleteFunction={deleteFunction} />
          : <Link
            to="/routine/log"
            state={{ "exercise": exercise }}
            className="btn"
          >Log</Link>
      }
      
    </li>
  );
}

function EditButtons({editFunction, editMode, addFunction}) {
  const editText = editMode ? "Done" : "Edit";

  return (
    <div className="flex justify-between items-center gap-4 mb-6">
      <button onClick={editFunction} className="w-full btn">{editText}</button>
      <button onClick={() => addFunction}  className="w-full btn">Add</button>
    </div>
  );
}

function DeleteButton({ deleteFunction }) {
  return (
    <button onClick={deleteFunction} className="btn">Delete</button>
  );
}