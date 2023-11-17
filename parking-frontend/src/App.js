import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./components/Home";
import Register from "./components/auth/Register";
import Login from "./components/auth/Login";
import Profile from "./components/user/Profile";
import Header from "./components/layouts/Header";
import { useEffect, useState } from "react";
import axios from "axios";
import { BASE_URL } from "./helpers/url";
import { getConfig } from "./helpers/config";
import { AuthContext } from "./helpers/authContext";

function App() {
  const [accessToken, setAccessToken] = useState(
    JSON.parse(localStorage.getItem("accessToken"))
  );

  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const fechtCurrentUSer = async () => {
      try {
        const response = await axios.get(
          `${BASE_URL}/user`,
          getConfig(accessToken)
        );
        setCurrentUser(response.data.user);
      } catch (error) {
        if (error.response.status === 401) {
          localStorage.removeItem("accessToken");
          setCurrentUser(null);
          setAccessToken("");
        }
        console.log(error);
      }
    };
    if (accessToken) {
      fechtCurrentUSer();
    }
  }, [accessToken]);

  return (
    <AuthContext.Provider value={{accessToken, setAccessToken, currentUser, setCurrentUser}}>
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </BrowserRouter>
    </AuthContext.Provider>
  );
}

export default App;
