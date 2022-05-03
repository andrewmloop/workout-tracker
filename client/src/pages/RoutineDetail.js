import React, { useEffect, useRef, useState } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

import Banner from "../components/Banner";

import { useNotif } from "../context/NotificationContext";

export default function RoutineDetail({ setAddMode, setActiveRoutine }) {
  const { handleNotif } = useNotif();
  const navigate = useNavigate();
  // Routine data from route history
  const location = useLocation();
  const routineData = location.state.routine;

  // Routine exercise state
  const [exerciseList, setExerciseList] = useState(routineData.exercise_list);
  const [showControls, setShowControls] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const firstRender = useRef(true);

  const deleteExercise = async (exerciseId) => {
    try {
      const res = await fetch(`/routine/del-exercise/${routineData._id}`, {
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
        let list = [...exerciseList];
        let index = list.findIndex(obj => obj._id === exerciseId);
        if (index > -1) list.splice(index, 1);
        setExerciseList(list);
      } else {
        handleNotif(data.message, false, true);
      }
    } catch (error) {
      console.error("Error deleting routine exercise: ", error);
      let errorText = "The iron gods are upset at the moment";
      handleNotif(errorText, false, true);
    }
  };

  const addExercise = async () => {
    await setActiveRoutine(routineData._id);
    await setAddMode(true);
    navigate("/exercise");
  };

  const handleOnDragEnd = async result => {
    if (!result.destination) return;

    let items = Array.from(exerciseList);
    let [newOrder] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, newOrder);

    setExerciseList(items);
  };

  const updateList = async () => {
    try {
      const res = await fetch(`/routine/upd-list/${routineData._id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-access-token": localStorage.getItem("token"),
        },
        body: JSON.stringify({ newList: exerciseList})
      });
      const data = await res.json();
      if (data.result === "success") {
        return;
      } else {
        handleNotif(data.message, false, true);
      }
    } catch (error) {
      console.error("Error deleting routine exercise: ", error);
      let errorText = "The iron gods are upset at the moment";
      handleNotif(errorText, false, true);
    }
  };
    
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
    } else {
      updateList();
    }
  }, [exerciseList]);

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
            addFunction={() => addExercise()}
          /> 
        }
        {exerciseList.length <=0 
          ? <p>To add exercises to this routine, click &quot;Edit&quot; in the header and then click &quot;Add&quot;.</p>
          : <div>
            <DragDropContext onDragEnd={result => handleOnDragEnd(result)}>
              <Droppable droppableId="exercises">
                {(provided) => {
                  return (
                    <ul className="flex flex-col justify-start text-left" {...provided.droppableProps} ref={provided.innerRef}>
                      {
                        exerciseList.map( (exercise, index) => {
                          return (
                            <DetailItem
                              key={exercise._id}
                              index={index}
                              exercise={exercise}
                              editMode={editMode}
                              showControls={showControls}
                              deleteFunction={() => deleteExercise(exercise._id)}
                            />
                          );
                        })
                      }
                      {provided.placeholder}
                    </ul>
                  );
                }}
              </Droppable>
            </DragDropContext>
          </div>
        }
      </div>
    </>
  );
}

function DetailItem({ exercise, editMode, showControls, deleteFunction, index }) {
  return (
    <Draggable key={exercise._id} draggableId={exercise._id} index={index} isDragDisabled={(showControls && !editMode) ? false : true}>
      {provided => (
        <li 
          ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}
          className="flex justify-between items-center mb-2 py-2 border-b-[1px] border-gray-500"
        >
          {(showControls && !editMode) &&
            <svg width={32} height={32} viewBox="0 0 32 32" stroke="white" strokeWidth={4} strokeLinecap="round" className="mr-2">
              <line x1="4" x2="28" y1="10" y2="10" />
              <line x1="4" x2="28" y1="22" y2="22" />
            </svg>
          }
          <Link 
            to="/exercise/detail"
            state={{ "exercise": exercise }}
            className="block w-full whitespace-nowrap overflow-x-hidden text-ellipsis"
          >{exercise.name}</Link>
          {
            editMode && <DeleteButton deleteFunction={deleteFunction} />
          }
          {
            (!showControls && !editMode) && 
            <Link
              to="/routine/log"
              state={{ "exercise": exercise }}
              className="btn ml-4"
            >Log</Link>
          }
        </li>
      )}
    </Draggable>
  );
}

function EditButtons({editFunction, editMode, addFunction}) {
  const editText = editMode ? "Done" : "Edit";

  return (
    <div className="flex justify-between items-center gap-4 mb-6">
      <button onClick={editFunction} className="w-full btn">{editText}</button>
      <button onClick={addFunction}  className="w-full btn-confirm">Add</button>
    </div>
  );
}

function DeleteButton({ deleteFunction }) {
  return (
    <button onClick={deleteFunction} className="btn-deny ml-4">Delete</button>
  );
}