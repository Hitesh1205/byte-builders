import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import AlumniDirectory from "./pages/AlumniDirectory";
import StudentDashboard from "./pages/StudentDashboard";
import AlumniDashboard from "./pages/AlumniDashboard";
import ChatPage from "./pages/ChatPage";
import Navbar from "./components/Navbar";

function App() {
  return (
    <Router>
      {/* Notice bg-light is gone, letting the CSS gradient show through! */}
      <div className="d-flex flex-column min-vh-100">
        <Navbar />

        <main className="flex-grow-1 pb-5">
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/directory" element={<AlumniDirectory />} />
            <Route path="/student-dashboard" element={<StudentDashboard />} />
            <Route path="/alumni-dashboard" element={<AlumniDashboard />} />
            <Route path="/chat/:id" element={<ChatPage/>} />
          </Routes>
        </main>

        {/* Removed bg-white so the footer blends seamlessly into the gradient */}
        <footer className="py-4 mt-auto" style={{ borderTop: "1px solid rgba(255,255,255,0.3)" }}>
          <div className="container text-center">
            <p className="mb-0 small fw-bold" style={{ color: "#102a43" }}>
              <i className="bi bi-rocket-takeoff-fill text-primary me-2"></i> 
              AlumniConnect Platform
            </p>
            <small style={{ color: "rgba(16, 42, 67, 0.7)" }}>Empowering the next generation of professionals.</small>
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;