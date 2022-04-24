import React, { useState } from "react";
import { Route, Routes, Outlet } from "react-router-dom";

import Navbar from "./components/Navbar";
import ExerciseGroup from "./pages/ExerciseGroup";
import ExerciseList from "./pages/ExerciseList";
import Exercise from "./pages/Exercise";
import RoutineList from "./pages/RoutineList";
import Routine from "./pages/Routine";
import Log from "./pages/Log";
import Settings from "./pages/Settings";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AddRoutine from "./pages/AddRoutine";
import Notification from "./components/Notification";

import { UserProvider } from "./context/UserContext";
import { ExerciseListProvider } from "./context/ExerciseListContext";

export default function App() {
  const [exerciseList, setExerciseList] = useState([]);
  const [showNotif, setShowNotif] = useState(false);
  const [notifText, setNotifText] = useState("");
  const [notifType, setNotifType] = useState(true);

  return (
    <UserProvider>
      <ExerciseListProvider>
        <div>
          <Routes>
            <Route element={<WithoutNav  />}>
              <Route exact path="/" element={<Login />}/>
              <Route exact path="/login" element={<Login />}/>
              <Route exact path="/register" element={<Register />}/>
            </Route>
            <Route element={<WithNav />}>
              <Route path="/exercise-group" element={
                <ExerciseGroup />
              }/>
              <Route path="/exercise-list" element={
                <ExerciseList 
                  exerciseList={exerciseList}
                  setExerciseList={setExerciseList}
                />
              }/>
              <Route path="/exercise" element={
                <Exercise />
              }/>
              <Route path="/routine-list" element={
                <RoutineList />
              }/>
              <Route path="/add-routine" element={
                <AddRoutine 
                  setShowNotif={setShowNotif} 
                  setNotifText={setNotifText}
                  setNotifType={setNotifType}
                />
              }/>
              <Route path="/routine" element={
                <Routine />
              }/>
              <Route path="/log" element={
                <Log 
                  setShowNotif={setShowNotif} 
                  setNotifText={setNotifText}
                  setNotifType={setNotifType}
                />
              }/>
              <Route path="/settings" element={
                <Settings
                  setShowNotif={setShowNotif} 
                  setNotifText={setNotifText}
                  setNotifType={setNotifType} 
                />
              }/>
            </Route>
          </Routes>
          <Notification 
            setShowNotif={setShowNotif}
            showNotif={showNotif} 
            notifText={notifText}
            notifType={notifType}
          />
        </div>
      </ExerciseListProvider>
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
