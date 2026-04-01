import React, { useEffect, useState } from "react";
import axios from "axios";

function AlumniDirectory() {
  const [search, setSearch] = useState("");
  const [alumni, setAlumni] = useState([]);
  const [messages, setMessages] = useState({});

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    fetchAlumni();
  }, []);

  const fetchAlumni = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/users/alumni");
      setAlumni(res.data);
    } catch (err) { console.log(err); }
  };

  const handleMessageChange = (id, text) => {
    setMessages({ ...messages, [id]: text });
  };

  const sendRequest = async (alumniId) => {
    if (!user) return alert("Please login first");
    if (user.role !== "student") return alert("Only students can send requests");
    if (!messages[alumniId] || messages[alumniId].trim() === "") return alert("Please provide a specific ask.");

    try {
      await axios.post("http://localhost:5000/api/request/send", {
        studentId: user._id, alumniId, message: messages[alumniId]
      });
      alert("Mentorship Request Sent Successfully!");
      setMessages({ ...messages, [alumniId]: "" });
    } catch (err) { alert("Error sending request"); }
  };

  const filteredAlumni = alumni.filter((a) =>
    a.name.toLowerCase().includes(search.toLowerCase()) ||
    (a.company && a.company.toLowerCase().includes(search.toLowerCase())) ||
    (a.jobRole && a.jobRole.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="container mt-5">
      
      {/* Search Header */}
      <div className="text-center mb-5">
        <h2 className="fw-bolder text-dark display-5">Find Your Mentor</h2>
        <p className="text-muted fs-5 mb-4">Connect with alumni who have walked your path.</p>
        <div className="position-relative mx-auto" style={{ maxWidth: "600px" }}>
          <i className="bi bi-search position-absolute text-muted" style={{ top: "15px", left: "20px", fontSize: "1.2rem" }}></i>
          <input
            type="text"
            placeholder="Search by name, company, or role..."
            className="form-control form-control-lg shadow-sm w-100"
            style={{ paddingLeft: "50px", borderRadius: "50rem" }}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Responsive Grid */}
      <div className="row g-4">
        {filteredAlumni.length === 0 ? (
          <div className="col-12 text-center py-5">
            <h5 className="text-muted">No alumni match your search.</h5>
          </div>
        ) : (
          filteredAlumni.map((a) => (
            /* Explicit responsive column sizing */
            <div key={a._id} className="col-12 col-md-6 col-lg-4">
              
              <div className="card modern-card h-100 d-flex flex-column">
                {/* 1. Banner Header */}
                <div className="profile-banner"></div>
                
                {/* 2. Overlapping Avatar */}
                <div className="px-4 d-flex justify-content-between align-items-end">
                  {/* <div className="avatar-profile shadow">
                    {a.name.charAt(0).toUpperCase()}
                  </div> */}
                  {/* Subtle grad year tag */}
                  {/* <span className="badge bg-light text-secondary border mb-2">Class of {a.graduationYear || "N/A"}</span> */}
                </div>

                {/* 3. Card Body */}
                <div className="card-body px-4 pt-3 d-flex flex-column flex-grow-1">
                  <h4 className="fw-bold text-dark mb-1">{a.name}</h4>
                  <h6 className="text-primary">{a.email}</h6>
                  <p className="text-primary fw-semibold mb-3">
                    <i className="bi bi-briefcase-fill me-2"></i>
                    {a.jobRole || "Professional"} @ {a.company || "Independent"}
                  </p>

                  <div className="mb-3">
                    <strong className="d-block mb-2 text-secondary small text-uppercase tracking-wide">Areas of Expertise</strong>
                    <div className="d-flex flex-wrap">
                      {a.skills && a.skills.length > 0 ? (
                        a.skills.map((skill, index) => <span key={index} className="skill-badge">{skill}</span>)
                      ) : <span className="skill-badge">General Mentorship</span>}
                    </div>
                  </div>

                  <p className="text-muted small mb-0 mt-auto">
                    <i className="bi bi-calendar-check me-2"></i>
                    <strong>Availability:</strong> {a.availability || "Open to chat"}
                  </p>

                  {/* 4. Action Area (Locked to bottom) */}
                  {user && user.role === "student" && (
                    <div className="mt-4 pt-3 border-top">
                      <textarea 
                          className="form-control form-control-sm mb-2" 
                          placeholder="Introduce yourself and specify your goal..."
                          rows="2"
                          value={messages[a._id] || ""}
                          onChange={(e) => handleMessageChange(a._id, e.target.value)}
                      ></textarea>
                      <button className="btn btn-primary w-100 btn-modern fw-bold" onClick={() => sendRequest(a._id)}>
                        <i className="bi bi-send-fill me-2"></i> Request Mentorship
                      </button>
                    </div>
                  )}
                </div>
              </div>
              
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default AlumniDirectory;