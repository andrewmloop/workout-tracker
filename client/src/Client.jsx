import React, { useState } from "react";
import { Route, Routes, Outlet } from "react-router-dom";

import Navbar from "./components/Navbar";
import ExerciseGroup from "./pages/ExerciseGroup";
import ExerciseList from "./pages/ExerciseList";
import ExerciseDetail from "./pages/ExerciseDetail";
import RoutineList from "./pages/RoutineList";
import RoutineDetail from "./pages/RoutineDetail";
import Log from "./pages/Log";
import Settings from "./pages/Settings";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AddRoutine from "./pages/AddRoutine";
import EditRoutine from "./pages/EditRoutine";
import Chart from "./pages/Chart";
import Notification from "./components/Notification";

import { UserProvider } from "./context/UserContext";
import { NotifProvider } from "./context/NotificationContext";
import { TimerContextProvider } from "./context/TimerContext";

export default function ClientUI() {
  // addMode allows the user to add exercises to a routine
  // This is passed to the <ExerciseGroup /> and <ExerciseList /> components.
  // If in addMode, a button will allow users to add any exercise to the current
  // set activeRoutine
  const [addMode, setAddMode] = useState(false);
  const [activeRoutine, setActiveRoutine] = useState("");
  const [newExercises, setNewExercises] = useState([]);

  return (
    <UserProvider>
      <NotifProvider>
        <TimerContextProvider>
          <div>
            <Routes>
              <Route element={<WithoutNav />}>
                <Route exact path="/" element={<Login />} />
                <Route exact path="/login" element={<Login />} />
                <Route exact path="/register" element={<Register />} />
              </Route>
              <Route element={<WithNav />}>
                <Route path="/exercise">
                  <Route
                    index
                    path="/exercise"
                    element={<ExerciseGroup addMode={addMode} />}
                  />
                  <Route
                    path="list"
                    element={
                      <ExerciseList
                        addMode={addMode}
                        setAddMode={setAddMode}
                        activeRoutine={activeRoutine}
                        newExercises={newExercises}
                        setNewExercises={setNewExercises}
                      />
                    }
                  />
                  <Route path="detail" element={<ExerciseDetail />} />
                </Route>
                <Route path="/routine">
                  <Route index path="/routine" element={<RoutineList />} />
                  <Route path="add" element={<AddRoutine />} />
                  <Route path="update" element={<EditRoutine />} />
                  <Route
                    path="detail"
                    element={
                      <RoutineDetail
                        setAddMode={setAddMode}
                        setActiveRoutine={setActiveRoutine}
                      />
                    }
                  />
                  <Route path="log" element={<Log />} />
                </Route>
                <Route exact path="/settings" element={<Settings />} />
                <Route exact path="/chart" element={<Chart />} />
              </Route>
            </Routes>
            <Notification />
          </div>
        </TimerContextProvider>
      </NotifProvider>
    </UserProvider>
  );
}

function WithNav() {
  return (
    <>
      <Outlet />
      <Navbar />
    </>
  );
}

function WithoutNav() {
  return (
    <>
      <Outlet />
    </>
  );
}
