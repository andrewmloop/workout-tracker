import React, { useState } from "react";
import { Route, Routes } from "react-router-dom";
import { Navbar } from "./components/navbar/Navbar";
import { Banner } from "./components/banner/Banner";

import { RoutineList } from "./pages/RoutineList";
import { Routine } from "./pages/Routine";
import { ExerciseList } from "./pages/ExerciseList";
import { Exercise } from "./pages/Exercise";
import { Log } from "./pages/Log";
import { Settings } from "./pages/Settings";
import { Login } from "./pages/Login";

function App() {
  const [bannerText, setBannerText] = useState("");

  return (
    <div className="relative h-screen bg-gray-600"> 
      <Banner 
        bannerText={bannerText} 
        setBannerText={setBannerText} 
      />
      <Routes>
        <Route path="/" element={
          <RoutineList 
            setBannerText={setBannerText}
          />
        }/>
        <Route path="/exercise-list" element={
          <ExerciseList 
            setBannerText={setBannerText}
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
        <Route path="/login" element={
          <Login 
          />
        }/>
      </Routes>
      <Navbar />
    </div>
  );
}

export default App;
