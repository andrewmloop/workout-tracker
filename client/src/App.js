import React, { useState } from "react";
import { Route, Routes, Outlet } from "react-router-dom";
import { Navbar } from "./components/navbar/Navbar";
import { Banner } from "./components/banner/Banner";

import { RoutineList } from "./pages/RoutineList";
import { Routine } from "./pages/Routine";
import { ExerciseList } from "./pages/ExerciseList";
import { Exercise } from "./pages/Exercise";
import { Log } from "./pages/Log";
import { Settings } from "./pages/Settings";
import { Login } from "./pages/Login";
import { Register } from "./pages/Register";

export default function App() {
  const [exerciseList, setExerciseList] = useState([]);
  const [bannerText, setBannerText] = useState("");

  return (
    <div className="relative h-screen bg-gray-600">
      <Routes>
        <Route element={<WithoutNav  />}>
          <Route exact path="/" element={<Login />}/>
          <Route exact path="/login" element={<Login />}/>
          <Route exact path="/register" element={<Register />}/>
        </Route>
        <Route element={<WithNav bannerText={bannerText} />}>
          <Route path="/routine-list" element={
            <RoutineList 
              setBannerText={setBannerText}
            />
          }/>
          <Route path="/exercise-list" element={
            <ExerciseList 
              setBannerText={setBannerText}
              exerciseList={exerciseList}
              setExerciseList={setExerciseList}
            />
          }/>
          <Route path="/exercise" element={
            <Exercise
              setBannerText={setBannerText}
            />
          }/>
          <Route path="/routine" element={
            <Routine 
              setBannerText={setBannerText}
            />
          }/>
          <Route path="/log" element={
            <Log 
              setBannerText={setBannerText}
            />
          }/>
          <Route path="/settings" element={
            <Settings 
              setBannerText={setBannerText}
            />
          }/>
        </Route>
      </Routes>
    </div>
  );
}

function WithNav(props) {
  return (
    <>
      <Banner bannerText={props.bannerText} />
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
