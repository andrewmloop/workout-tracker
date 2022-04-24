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
import Notification from "./components/Notification";

import { UserProvider } from "./context/UserContext";
import { ExerciseListProvider } from "./context/ExerciseListContext";

export default function App() {
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
              <Route path="/exercise">
                <Route index path="/exercise" element={<ExerciseGroup />} />
                <Route path="list" element={<ExerciseList />} />
                <Route path="detail" element={<ExerciseDetail />} />
              </Route>
              <Route path="/routine">
                <Route index path="/routine" element={<RoutineList />} />
                <Route path="add" element={
                  <AddRoutine 
                    setShowNotif={setShowNotif} 
                    setNotifText={setNotifText}
                    setNotifType={setNotifType}
                  />
                } />
                <Route path="detail" element={<RoutineDetail />} />
                <Route path="log" element={
                  <Log 
                    setShowNotif={setShowNotif} 
                    setNotifText={setNotifText}
                    setNotifType={setNotifType}
                  />
                } />
              </Route>
              <Route exact path="/settings" element={
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
