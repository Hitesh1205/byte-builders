import React from "react";
import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-custom py-3">
      <div className="container">
        <Link className="navbar-brand fw-bolder fs-4" to="/">
           Alumni<span className="text-primary">Connect</span>
        </Link>

        <div>
          {user ? (
            <>
              <Link className="btn btn-outline-dark rounded-pill px-4 me-2 btn-modern" to="/directory">
                Directory
              </Link>
              <Link 
                className="btn btn-primary rounded-pill px-4 me-2 btn-modern text-white shadow-sm" 
                to={user.role === "student" ? "/student-dashboard" : "/alumni-dashboard"}
              >
                Dashboard
              </Link>
              <button className="btn btn-danger rounded-pill px-4 btn-modern shadow-sm" onClick={handleLogout}>
                Logout
              </button>
            </>
          ) : (
            <>
              <Link className="btn btn-outline-dark rounded-pill px-4 me-2 btn-modern" to="/">
                Login
              </Link>
              <Link className="btn btn-dark rounded-pill px-4 btn-modern shadow-sm" to="/register">
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
