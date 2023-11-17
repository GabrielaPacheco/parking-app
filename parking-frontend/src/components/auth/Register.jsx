import axios from "axios";
import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../../helpers/url";
import { renderValidationErrors } from "../../helpers/validation";
import Spinner from "../layouts/Spinner";
import { AuthContext } from "../../helpers/authContext";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { accessToken, setAccessToken, currentUser, setCurrentUser } =
    useContext(AuthContext);

  useEffect(() => {
    if (accessToken) navigate("/");
  }, [accessToken, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setLoading(true);
    const data = { name, email, password };
    try {
      const response = await axios.post(`${BASE_URL}/user/register`, data);
      localStorage.setItem(
        "accessToken",
        JSON.stringify(response.data.access_token)
      );
      setAccessToken(response.data.access_token);
      setCurrentUser(response.data.user);
      setLoading(false);
      setName("");
      setEmail("");
      setPassword("");
      navigate("/");
    } catch (error) {
      setLoading(false);
      if (error.response.status === 422) {
        setErrors(error.response.data.errors);
      }
      console.log(error);
    }
  };

  return (
    <div className="container">
      <div className="row my-5">
        <div className="col-md-6 mx-auto">
          <div className="card">
            <div className="card-header bg-white p-3 text-center">
              <h4>Crear una cuenta</h4>
            </div>
            <div className="card-body">
              <form onSubmit={(e) => handleSubmit(e)}>
                <div className="row mb-4">
                  <div className="col">
                    <div className="form-group">
                      <input
                        type="text"
                        onChange={(e) => setName(e.target.value)}
                        name="name"
                        value={name}
                        className="form-control mb-2 rounded-0"
                        placeholder="Nombre"
                      />
                      {renderValidationErrors(errors, "name")}
                    </div>
                    <div className="form-group">
                      <input
                        type="email"
                        onChange={(e) => setEmail(e.target.value)}
                        name="email"
                        value={email}
                        className="form-control mb-2 rounded-0"
                        placeholder="Email"
                      />
                      {renderValidationErrors(errors, "email")}
                    </div>
                    <div className="form-group">
                      <input
                        type="password"
                        onChange={(e) => setPassword(e.target.value)}
                        name="password"
                        value={password}
                        className="form-control mb-2 rounded-0"
                        placeholder="Contraseña"
                      />
                      {renderValidationErrors(errors, "password")}
                    </div>
                    <div>
                      {loading ? (
                        <Spinner />
                      ) : (
                        <button className="btn btn-primary btn-sm rounded-0">
                          Submit
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
