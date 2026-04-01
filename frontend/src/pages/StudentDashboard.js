import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function StudentDashboard() {
  const [requests, setRequests] = useState([]);
  const [feedbackInput, setFeedbackInput] = useState({});
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || user.role !== "student") return;
    fetchRequests();
  }, [user]);

  const fetchRequests = async () => {
    try {
      const res = await axios.get(`https://byte-builders-j8ca.onrender.com/api/request/student/${user._id}`);
      setRequests(res.data);
    } catch (err) { console.log(err); }
  };

  const submitFeedback = async (requestId) => {
    if (!feedbackInput[requestId]) return alert("Please enter feedback");
    try {
      await axios.put("https://byte-builders-j8ca.onrender.com/api/request/feedback", {
        requestId, role: "student", feedback: feedbackInput[requestId]
      });
      alert("Feedback saved successfully.");
      fetchRequests();
    } catch (err) { alert("Error submitting feedback"); }
  };

  const handleDeleteAccount = async () => {
    if (window.confirm("⚠️ WARNING: Are you sure you want to permanently delete your account? This action cannot be undone and will delete all your mentorship history.")) {
      try {
        await axios.delete(`https://byte-builders-j8ca.onrender.com/api/users/${user._id}`);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        alert("Account deleted successfully.");
        navigate("/");
      } catch (err) {
        alert("Error deleting account.");
      }
    }
  };

  if (!user || user.role !== "student") return (<div className="container mt-5 text-center"><h2 className="text-danger">Access Denied</h2></div>);

  return (
    <div className="container mt-4 d-flex flex-column min-vh-100">
      <div className="d-flex justify-content-between align-items-center mb-4 bg-white p-2 rounded-pill shadow-sm" style={{background: 'rgba(255,255,255,0.6)'}}>
        <h4 className="fw-bold text-dark m-0 ms-3">My Mentorship Journey</h4>
        <span className="badge bg-primary rounded-pill py-2 px-3 me-1 shadow-sm"><i className="bi bi-person-workspace me-2"></i>Student Portal</span>
      </div>
      
      {requests.length === 0 ? ( 
        <div className="text-center p-5 rounded modern-card shadow-sm mx-auto flex-grow-1 d-flex flex-column justify-content-center" style={{maxWidth: "500px", maxHeight: "400px"}}>
          <i className="bi bi-rocket display-4 text-primary mb-2"></i>
          <h5 className="fw-bold text-dark">Ready to Launch?</h5>
          <p className="text-muted small">Head over to the Directory to find your first mentor.</p>
          <a href="/directory" className="btn btn-primary btn-sm btn-modern px-4 mt-2 mx-auto">Browse Alumni</a>
        </div> 
      ) : (
        <div className="row g-3 flex-grow-1">
          {requests.map((req) => (
            <div key={req._id} className="col-12 col-md-6 col-xl-4">
              <div className="card modern-card student-card-bg p-3 h-100">
                
                <div className="d-flex justify-content-between align-items-start mb-2">
                  <div className="d-flex align-items-center">
                    <div className="avatar-circle bg-primary text-white me-2 shadow-sm">
                      {req.alumniId?.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h6 className="fw-bold text-dark mb-0">{req.alumniId?.name}</h6>
                      <small className="text-primary" style={{fontSize: "0.75rem"}}><i className="bi bi-envelope me-1"></i>{req.alumniId?.email}</small>
                    </div>
                  </div>
                </div>

                <div className="mb-2 d-flex align-items-center justify-content-between">
                  <span className={`status-pill status-${req.status}`} style={{fontSize: "0.65rem", padding: "4px 10px"}}>
                    {req.status === 'pending' && <i className="bi bi-hourglass-split"></i>}
                    {req.status === 'accepted' && <i className="bi bi-check-circle-fill"></i>}
                    {req.status === 'completed' && <i className="bi bi-award-fill"></i>}
                    {req.status === 'rejected' && <i className="bi bi-x-circle-fill"></i>}
                    {req.status}
                  </span>
                </div>

                <div className="mb-3 bg-white p-2 rounded shadow-sm border-start border-3 border-primary">
                  <strong className="text-primary d-block mb-1 text-uppercase" style={{fontSize: "0.7rem"}}>Your Objective</strong> 
                  <p className="text-dark mb-0 fst-italic small">"{req.message}"</p>
                </div>

                {req.status === "accepted" && (
                  <div className="action-panel p-2 mt-auto shadow-sm">
                    <div className="d-flex justify-content-between align-items-center mb-2 pb-2 border-bottom">
                      <div>
                        <small className="text-dark fw-bold d-block" style={{fontSize: "0.8rem"}}>Scheduled Session</small>
                        <small className="text-muted"><i className="bi bi-calendar-event me-1"></i>{req.meetingDate}</small>
                      </div>
                      <a href={req.meetingLink} target="_blank" rel="noreferrer" className="btn btn-sm btn-outline-primary btn-modern" style={{fontSize: "0.75rem"}}>Join <i className="bi bi-box-arrow-up-right"></i></a>
                    </div>
                    <div>
                      <textarea className="form-control form-control-sm mb-2" placeholder="Leave post-session feedback..." rows="2" onChange={(e) => setFeedbackInput({...feedbackInput, [req._id]: e.target.value})}></textarea>
                      <button className="btn btn-primary btn-sm btn-modern w-100 fw-bold" onClick={() => submitFeedback(req._id)}>Complete Session</button>
                    </div>
                  </div>
                )}

                {req.status === "completed" && (
                   <div className="alert alert-success mt-auto mb-0 p-2 shadow-sm border-0 bg-white">
                     <strong className="text-success d-block mb-1" style={{fontSize: "0.8rem"}}><i className="bi bi-check-circle-fill me-1"></i>Session Concluded</strong>
                     <div className="bg-light rounded p-1 mb-1">
                       <small className="text-muted d-block fw-bold" style={{fontSize: "0.7rem"}}>Your Feedback</small>
                       <p className="mb-0 text-dark" style={{fontSize: "0.75rem"}}>{req.studentFeedback || "N/A"}</p>
                     </div>
                     {req.alumniFeedback && (
                       <div className="bg-light rounded p-1">
                         <small className="text-primary d-block fw-bold" style={{fontSize: "0.7rem"}}>Mentor's Feedback</small>
                         <p className="mb-0 text-dark" style={{fontSize: "0.75rem"}}>{req.alumniFeedback}</p>
                       </div>
                     )}
                   </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Account Deletion Button */}
      <div className="mt-5 pt-4 text-center pb-3">
        <button className="btn btn-outline-danger btn-modern rounded-pill px-4 shadow-sm" onClick={handleDeleteAccount}>
          <i className="bi bi-trash3-fill me-2"></i> Delete My Account
        </button>
      </div>
    </div>
  );
}

export default StudentDashboard;