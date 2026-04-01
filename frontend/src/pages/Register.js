import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

function Register() {
  const [formData, setFormData] = useState({
    name: "", email: "", password: "", role: "student",
    graduationYear: "", company: "", jobRole: "", 
    skills: "", mentorshipAreas: "", availability: ""
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await axios.post("https://byte-builders-j8ca.onrender.com/api/auth/register", formData);
      alert("Registration Successful! Please login.");
      navigate("/");
    } catch (err) {
      alert("Registration Failed: " + (err.response?.data?.error || "Check your details."));
    }
  };

  return (
    <div className="row justify-content-center align-items-center py-5">
      <div className="col-md-7 col-lg-6">
        <div className="card modern-card p-5 border-top border-4 border-primary">
          <div className="text-center mb-4">
            <h2 className="fw-bold text-dark">Join the Network</h2>
            <p className="text-muted">Create your account to connect and grow.</p>
          </div>
          
          <form onSubmit={handleRegister}>
            <div className="row g-3 mb-3">
              <div className="col-md-6">
                <label className="form-label fw-bold text-secondary small">Full Name</label>
                <input name="name" className="form-control" placeholder="John Doe" required onChange={handleChange} />
              </div>
              <div className="col-md-6">
                <label className="form-label fw-bold text-secondary small">Account Type</label>
                <select name="role" className="form-control" onChange={handleChange} value={formData.role}>
                  <option value="student">Student (Mentee)</option>
                  <option value="alumni">Alumni (Mentor)</option>
                </select>
              </div>
            </div>

            <div className="mb-3">
              <label className="form-label fw-bold text-secondary small">Email Address</label>
              <input name="email" type="email" className="form-control" placeholder="name@example.com" required onChange={handleChange} />
            </div>
            
            <div className="mb-4">
              <label className="form-label fw-bold text-secondary small">Password</label>
              <input name="password" type="password" className="form-control" placeholder="Create a strong password" required onChange={handleChange} />
            </div>

            {/* Dynamic Alumni Fields */}
            {formData.role === "alumni" && (
              <div className="p-4 rounded mb-4" style={{ backgroundColor: "#f8f9fa", border: "1px dashed #ced4da" }}>
                <h6 className="fw-bold text-dark mb-3"><i className="bi bi-person-badge text-primary me-2"></i>Professional Details</h6>
                <div className="row g-2">
                  <div className="col-6">
                    <input name="graduationYear" className="form-control form-control-sm" placeholder="Grad Year (e.g., 2020)" onChange={handleChange} />
                  </div>
                  <div className="col-6">
                    <input name="company" className="form-control form-control-sm" placeholder="Current Company" onChange={handleChange} />
                  </div>
                  <div className="col-12">
                    <input name="jobRole" className="form-control form-control-sm" placeholder="Job Role (e.g., Software Engineer)" onChange={handleChange} />
                  </div>
                  <div className="col-12">
                    <input name="skills" className="form-control form-control-sm" placeholder="Skills (comma separated)" onChange={handleChange} />
                  </div>
                  <div className="col-12">
                    <input name="availability" className="form-control form-control-sm" placeholder="Availability (e.g., Weekends 10AM-12PM)" onChange={handleChange} />
                  </div>
                </div>
              </div>
            )}

            <button className="btn btn-primary w-100 py-2 btn-modern mb-3 fs-5">Create Account</button>
            <div className="text-center">
              <small className="text-muted">Already have an account? <Link to="/" className="text-decoration-none fw-bold">Log in here</Link></small>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Register;