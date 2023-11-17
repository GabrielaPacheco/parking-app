import React, { useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import { AuthContext } from "../../helpers/authContext";
import axios from "axios";
import { BASE_URL } from "../../helpers/url";
import { getConfig } from "../../helpers/config";

export default function Header() {
  const { accessToken, setAccessToken, currentUser, setCurrentUser } =
    useContext(AuthContext);
    const location = useLocation();

  const logout = async () => {
    try {
      await axios.post(`${BASE_URL}/user/logout`, {}, getConfig(accessToken));
      localStorage.removeItem("accessToken");
      setCurrentUser(null);
      setAccessToken("");
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <nav class="navbar navbar-expand-lg navbar-light bg-light">
      <div class="container-fluid">
        <a class="navbar-brand" href="#">
          <i className="fas fa-parking fa-3x"></i>
        </a>
        <button
          class="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarSupportedContent">
          <ul class="navbar-nav me-auto mb-2 mb-lg-0">
            <li class="nav-item">
              <Link class={`nav-link ${location.pathname === '/' ? 'active' : ''}`} aria-current="page" to="/">
                <i className="fas fa-home"></i> Home
              </Link>
            </li>
            {!currentUser ? 
              <>
                <li class="nav-item">
                  <Link class={`nav-link ${location.pathname === '/register' ? 'active' : ''}`} to="/register">
                    <i className="fas fa-plus"></i> Register
                  </Link>
                </li>
                <li class="nav-item">
                  <Link class={`nav-link ${location.pathname === '/login' ? 'active' : ''}`} to="/login">
                    <i className="fas fa-sign-in"></i> Login
                  </Link>
                </li>
              </>
             : 
              <>
                <li class="nav-item">
                  <Link class={`nav-link ${location.pathname === '/profile' ? 'active' : ''}`} to="/profile">
                    <i className="fas fa-user"></i> {currentUser.name}
                  </Link>
                </li>
                <li class="nav-item">
                  <Link class="nav-link" to="#" onClick={() => logout()}>
                    <i className="fas fa-sign-out"></i> Logout
                  </Link>
                </li>
              </>
            }
          </ul>
        </div>
      </div>
    </nav>
  );
}
