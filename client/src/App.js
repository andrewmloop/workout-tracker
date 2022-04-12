import React, { useState } from "react";
import { Route, Routes, Outlet } from "react-router-dom";
import Navbar from "./components/Navbar";
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

export default function App() {
  const [exerciseList, setExerciseList] = useState([]);
  const [showNotif, setShowNotif] = useState(false);
  const [notifText, setNotifText] = useState("");
  const [notifType, setNotifType] = useState(true);

  return (
    <div className="h-screen bg-gray-600">
      <Routes>
        <Route element={<WithoutNav  />}>
          <Route exact path="/" element={<Login />}/>
          <Route exact path="/login" element={<Login />}/>
          <Route exact path="/register" element={<Register />}/>
        </Route>
        <Route element={<WithNav />}>
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
            <Settings />
          }/>
        </Route>
      </Routes>
      <Notification 
        showNotif={showNotif} 
        notifText={notifText}
        notifType={notifType}
      />
    </div>
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
