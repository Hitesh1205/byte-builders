import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("https://byte-builders-j8ca.onrender.com/api/auth/login", { email, password });
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      if (res.data.user.role === "student") navigate("/student-dashboard");
      else navigate("/alumni-dashboard");
    } catch (err) { alert("Login Failed. Check your credentials."); }
  };

  return (
    <div className="row justify-content-center align-items-center" style={{ minHeight: "75vh" }}>
      <div className="col-md-5">
        <div className="card modern-card p-5">
          <div className="text-center mb-4">
            <h2 className="fw-bold">Welcome Back</h2>
            <p className="text-muted">Login to continue your mentorship journey.</p>
          </div>
          <form onSubmit={handleLogin}>
            <div className="mb-3">
              <label className="form-label fw-bold text-secondary">Email Address</label>
              <input type="email" className="form-control" placeholder="name@example.com" onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div className="mb-4">
              <label className="form-label fw-bold text-secondary">Password</label>
              <input type="password" className="form-control" placeholder="••••••••" onChange={(e) => setPassword(e.target.value)} required />
            </div>
            <button className="btn btn-primary w-100 py-2 btn-modern mb-3">Login</button>
            <div className="text-center">
              <small className="text-muted">Don't have an account? <Link to="/register" className="text-decoration-none">Register here</Link></small>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
