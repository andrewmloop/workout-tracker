import React from "react";
import { Route, Routes } from "react-router-dom";
import { Navbar } from "./components/Navbar/Navbar";

import { RoutineList } from "./pages/RoutineList";
import { ExerciseList } from "./pages/ExerciseList";
import { Exercise } from "./pages/Exercise";

function App() {
  return (
    <div className="h-screen bg-gray-600"> 
      <Routes>
        <Route path="/" element={<RoutineList />} />
        <Route path="/exercise-list" element={<ExerciseList />} />
        <Route path="/exercise" element={<Exercise />} />
      </Routes>
      <Navbar />
    </div>
  );
}

export default App;
