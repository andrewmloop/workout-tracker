import React, { useState } from "react";
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

  const [exerciseList, setExerciseList] = useState(routineData.exercise_list);
  const [editMode, setEditMode] = useState(false);
  const [targetMode, setTargetMode] = useState(false);

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
      } else if (data.isLoggedIn === false) {
        navigate("/");
        let loginText = "Your session has expired";
        handleNotif(loginText, true, true);
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
    // Do nothing if drag didn't change anything
    if (!result.destination) return;

    let items = Array.from(exerciseList);
    // Splice out item that changed
    let [newOrder] = items.splice(result.source.index, 1);
    // Splice in the changed item into the correct index
    items.splice(result.destination.index, 0, newOrder);

    // Sets new list in component
    setExerciseList(items);
    // Sets same list in DB
    updateList(items);
  };

  const updateList = async (newList) => {
    try {
      const res = await fetch(`/routine/upd-list/${routineData._id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-access-token": localStorage.getItem("token"),
        },
        body: JSON.stringify({ newList: newList})
      });
      const data = await res.json();
      if (data.result === "success") {
        return;
      } else if (data.isLoggedIn === false) {
        navigate("/");
        let loginText = "Your session has expired";
        handleNotif(loginText, true, true);
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
          setEditMode(prev => !prev);
          setTargetMode(false);
        }}
        addText={editMode ? "Done" : "Edit"}
      />
      <div className="p-8 text-center text-white">
        <RoutineButtons
          addFunction={() => addExercise()}
          targetMode={targetMode}
          targetFunction={() => {
            setTargetMode(prev => !prev);
            setEditMode(false);
          }}
        /> 
        <div>
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
                            routineId={routineData._id}
                            exerciseObj={exercise}
                            editMode={editMode}
                            targetMode={targetMode}
                            setExerciseList={setExerciseList}
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
      </div>
    </>
  );
}

function DetailItem(
  { index, routineId, exerciseObj, setExerciseList,
    editMode, targetMode, deleteFunction,  }) {

  return (
    <Draggable key={exerciseObj._id} draggableId={exerciseObj._id} index={index} isDragDisabled={ editMode ? false : true }>
      {provided => (
        <li 
          ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}
          className="flex justify-between items-center py-3 border-b-[1px] border-gray-500"
        >
          <div className="flex justify-start items-center whitespace-nowrap overflow-x-hidden text-ellipsis">
            { editMode &&
              <svg width={32} height={32} viewBox="0 0 32 32" stroke="white" strokeWidth={3} strokeLinecap="round" className="mr-2">
                <line x1="4" x2="28" y1="12" y2="12" />
                <line x1="4" x2="28" y1="20" y2="20" />
              </svg>
            }
            <div className="flex flex-col whitespace-nowrap overflow-x-hidden text-ellipsis py-1">
              <Link 
                to="/exercise/detail"
                state={{ "exercise": exerciseObj.exercise }}
                className="block whitespace-nowrap overflow-x-hidden text-ellipsis"
              >{exerciseObj.exercise.name}</Link>
              <div className="flex justify-start font-light text-xs text-amber-400">
                { exerciseObj.targSets && 
                  <p>Sets: {exerciseObj.targSets}&nbsp;</p> 
                }
                { exerciseObj.targReps && 
                  <p>Reps: {exerciseObj.targReps}</p> 
                }
              </div>
            </div>
          </div>
          {
            editMode && <DeleteButton deleteFunction={deleteFunction} />
          }
          {
            targetMode && 
            <TargetInputs 
              routineId={routineId} 
              exercise={exerciseObj} 
              setExerciseList={setExerciseList}
            />
          }
          {
            (!editMode && !targetMode) && 
            <Link
              to="/routine/log"
              state={{ "exercise": exerciseObj }}
              className="btn ml-4"
            >Log</Link>
          }
        </li>
      )}
    </Draggable>
  );
}

function DeleteButton({ deleteFunction }) {
  return (
    <button onClick={deleteFunction} className="btn-deny ml-4">Delete</button>
  );
}

function RoutineButtons({addFunction, targetMode, targetFunction}) {
  const targetText = targetMode ? "Done" : "Targets";

  return (
    <div className="flex justify-between items-center gap-4 mb-6">
      <button onClick={targetFunction} className="w-full btn">{targetText}</button>
      <button onClick={addFunction}  className="w-full btn-confirm">Add</button>
    </div>
  );
}

function TargetInputs({ routineId, exercise, setExerciseList}) {
  const navigate = useNavigate();
  const { handleNotif } = useNotif();

  const [targetSets, setTargetSets] = useState(exercise.targSets || "");
  const [targetReps, setTargetReps] = useState(exercise.targReps || "");

  const updateTargets = async () => {
    const targets = {
      exerciseId: exercise.exercise._id,
      targSets: targetSets,
      targReps: targetReps
    };

    try {
      const res = await fetch(`/routine/upd-targets/${routineId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-access-token": localStorage.getItem("token"),
        },
        body: JSON.stringify(targets)
      });
      const data = await res.json();
      if (data.result === "success") {
        // If the changes are updated in DB
        // update them in the component
        setExerciseList(prev => ([
          ...prev.map( item => {
            if (item.exercise._id === exercise.exercise._id) {
              return Object.assign(item, {
                targSets: targets.targSets,
                targReps: targets.targReps
              });
            } else { return item; }
          })
        ]));
      } else if (data.isLoggedIn === false) {
        navigate("/");
        let loginText = "Your session has expired";
        handleNotif(loginText, true, true);
      } else {
        handleNotif(data.message, false, true);
      }
    } catch (error) {
      console.error("Error setting targets: ", error);
      let errorText = "The iron gods are upset at the moment";
      handleNotif(errorText, false, true);
    }
  };

  return (
    <div className="flex justify-end">
      <input 
        id="target-sets" name="target-sets" type="number"
        value={targetSets} placeholder="Sets" 
        onChange={(e) => setTargetSets(e.target.value)}
        onBlur={() => updateTargets()}
        className="text-input-sm" />
      <input 
        id="target-reps" name="target-reps" type="number" 
        value={targetReps} placeholder="Reps" 
        onChange={(e) => setTargetReps(e.target.value)}
        onBlur={() => updateTargets()}
        className="text-input-sm" />
    </div>
  );
}