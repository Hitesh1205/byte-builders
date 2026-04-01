import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function AlumniDashboard() {
  const [requests, setRequests] = useState([]);
  const [feedbackInput, setFeedbackInput] = useState({});
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || user.role !== "alumni") return;
    fetchRequests();
  }, [user]);

  const fetchRequests = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/request/alumni/${user._id}`);
      setRequests(res.data);
    } catch (err) { console.log(err); }
  };

  const handleAccept = async (requestId) => {
    const meetingLink = `https://meet.google.com/mentorship-${Math.floor(Math.random() * 10000)}`;
    const meetingDate = prompt("Enter meeting date & time (e.g., Tomorrow at 5 PM):", "TBD");
    if (meetingDate === null) return; 

    try {
      await axios.put("http://localhost:5000/api/request/update-status", {
        requestId, status: "accepted", meetingLink, meetingDate
      });
      alert("Request Accepted and Link Generated!");
      fetchRequests();
    } catch (err) { alert("Error accepting"); }
  };

  const handleReject = async (requestId) => {
    if(!window.confirm("Decline this request?")) return;
    try {
      await axios.put("http://localhost:5000/api/request/update-status", { requestId, status: "rejected" });
      fetchRequests();
    } catch (err) { alert("Error rejecting"); }
  };

  const submitFeedback = async (requestId) => {
    if (!feedbackInput[requestId]) return alert("Please enter feedback");
    try {
      await axios.put("http://localhost:5000/api/request/feedback", {
        requestId, role: "alumni", feedback: feedbackInput[requestId]
      });
      alert("Session marked as completed.");
      fetchRequests();
    } catch (err) { alert("Error submitting feedback"); }
  };

  const handleDeleteAccount = async () => {
    if (window.confirm("⚠️ WARNING: Are you sure you want to permanently delete your Alumni account? This will erase all your mentorship records.")) {
      try {
        await axios.delete(`http://localhost:5000/api/users/${user._id}`);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        alert("Account deleted successfully.");
        navigate("/");
      } catch (err) {
        alert("Error deleting account.");
      }
    }
  };

  if (!user || user.role !== "alumni") return (<div className="container mt-5 text-center"><h2 className="text-danger">Access Denied</h2></div>);

  return (
    <div className="container mt-4 d-flex flex-column min-vh-100">
      <div className="d-flex justify-content-between align-items-center mb-4 bg-white p-2 rounded-pill shadow-sm" style={{background: 'rgba(255,255,255,0.6)'}}>
        <h4 className="fw-bold text-dark m-0 ms-3">Mentee Requests</h4>
        <span className="badge bg-success rounded-pill py-2 px-3 me-1 shadow-sm"><i className="bi bi-briefcase-fill me-2"></i>Alumni Portal</span>
      </div>
      
      {requests.length === 0 ? ( 
        <div className="text-center p-5 rounded modern-card shadow-sm mx-auto flex-grow-1 d-flex flex-column justify-content-center" style={{maxWidth: "500px", maxHeight: "400px"}}>
           <i className="bi bi-inbox display-4 text-success mb-2"></i>
           <h5 className="fw-bold text-dark">Inbox Zero</h5>
           <p className="text-muted small">You have no pending mentorship requests right now.</p>
        </div>
      ) : (
        <div className="row g-3 flex-grow-1">
          {requests.map((req) => (
            <div key={req._id} className="col-12 col-md-6 col-xl-4">
              <div className="card modern-card alumni-card-bg p-3 h-100">
                
                <div className="d-flex justify-content-between align-items-start mb-2">
                  <div className="d-flex align-items-center">
                    <div className="avatar-circle bg-success text-white me-2 shadow-sm">
                      {req.studentId?.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h6 className="fw-bold text-dark mb-0">{req.studentId?.name}</h6>
                      <small className="text-success" style={{fontSize: "0.75rem"}}><i className="bi bi-mortarboard-fill me-1"></i>Student Mentee</small>
                    </div>
                  </div>
                </div>

                <div className="mb-2 d-flex align-items-center justify-content-between">
                  <span className={`status-pill status-${req.status}`} style={{fontSize: "0.65rem", padding: "4px 10px"}}>
                    {req.status === 'pending' && <i className="bi bi-hourglass-split"></i>}
                    {req.status === 'accepted' && <i className="bi bi-calendar-check-fill"></i>}
                    {req.status === 'completed' && <i className="bi bi-check-all"></i>}
                    {req.status === 'rejected' && <i className="bi bi-x-circle-fill"></i>}
                    {req.status}
                  </span>
                </div>

                <div className="mb-3 bg-white p-2 rounded shadow-sm border-start border-3 border-success">
                  <strong className="text-success d-block mb-1 text-uppercase" style={{fontSize: "0.7rem"}}>Mentorship Goal</strong>
                  <p className="text-dark mb-0 fst-italic small">"{req.message}"</p>
                </div>

                {req.status === "pending" && (
                  <div className="mt-auto d-flex gap-2 pt-2 border-top">
                    <button className="btn btn-success btn-sm flex-grow-1 btn-modern fw-bold" onClick={() => handleAccept(req._id)}>
                      <i className="bi bi-check2"></i> Accept
                    </button>
                    <button className="btn btn-outline-danger btn-sm btn-modern" onClick={() => handleReject(req._id)}>
                      Decline
                    </button>
                  </div>
                )}

                {req.status === "accepted" && (
                  <div className="action-panel p-2 mt-auto shadow-sm">
                    <div className="d-flex justify-content-between align-items-center mb-2 pb-2 border-bottom">
                      <div>
                        <small className="text-success fw-bold d-block" style={{fontSize: "0.8rem"}}>Meeting Details</small>
                        <small className="text-dark fw-bold">{req.meetingDate}</small>
                      </div>
                      <a href={req.meetingLink} target="_blank" rel="noreferrer" className="btn btn-sm btn-success btn-modern" style={{fontSize: "0.75rem"}}>Link <i className="bi bi-camera-video"></i></a>
                    </div>
                    <div>
                      <textarea className="form-control form-control-sm mb-2" placeholder="Leave post-session notes..." rows="2" onChange={(e) => setFeedbackInput({...feedbackInput, [req._id]: e.target.value})}></textarea>
                      <button className="btn btn-success btn-sm w-100 btn-modern fw-bold" onClick={() => submitFeedback(req._id)}>Mark Completed</button>
                    </div>
                  </div>
                )}

                {req.status === "completed" && (
                  <div className="alert alert-success mt-auto mb-0 p-2 shadow-sm border-0 bg-white">
                    <strong className="text-success d-block mb-1" style={{fontSize: "0.8rem"}}><i className="bi bi-check-circle-fill me-1"></i>Concluded</strong>
                    <div className="bg-light rounded p-1 mb-1">
                      <small className="text-success d-block fw-bold" style={{fontSize: "0.7rem"}}>Your Notes</small>
                      <p className="mb-0 text-dark" style={{fontSize: "0.75rem"}}>{req.alumniFeedback || "N/A"}</p>
                    </div>
                    {req.studentFeedback && (
                      <div className="bg-light rounded p-1">
                        <small className="text-primary d-block fw-bold" style={{fontSize: "0.7rem"}}>Student's Review</small>
                        <p className="mb-0 text-dark" style={{fontSize: "0.75rem"}}>{req.studentFeedback}</p>
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

export default AlumniDashboard;