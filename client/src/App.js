import React, { useState } from "react";
import { Route, Routes } from "react-router-dom";
import { Navbar } from "./components/navbar/Navbar";
import { Banner } from "./components/banner/Banner";

import { RoutineList } from "./pages/RoutineList";
import { Routine } from "./pages/Routine";
import { ExerciseList } from "./pages/ExerciseList";
import { Exercise } from "./pages/Exercise";

function App() {
  const [bannerText, setBannerText] = useState("");

  return (
    <div className="h-screen bg-gray-600"> 
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
          />
        }/>
        <Route path="/routine" element={
          <Routine 
            setBannerText={setBannerText}
          />
        }/>
      </Routes>
      <Navbar />
    </div>
  );
}

export default App;
