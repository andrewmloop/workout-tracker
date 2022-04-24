import React from "react";
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
import { NotifProvider } from "./context/NotificationContext";

export default function App() {
  return (
    <UserProvider><ExerciseListProvider><NotifProvider>
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
              <Route path="add" element={<AddRoutine />} />
              <Route path="detail" element={<RoutineDetail />} />
              <Route path="log" element={<Log />} />
            </Route>
            <Route exact path="/settings" element={
              <Settings />
            }/>
          </Route>
        </Routes>
        <Notification />
      </div>
    </NotifProvider></ExerciseListProvider></UserProvider>
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
