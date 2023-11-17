import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../helpers/authContext";
import { BASE_URL } from "../../helpers/url";
import axios from "axios";
import { renderValidationErrors } from "../../helpers/validation";
import Spinner from "../layouts/Spinner";
import { getConfig } from "../../helpers/config";
import { toast } from "react-toastify";

export default function Profile() {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const [loading, setLoading] = useState({
    updatingName: false,
    updatingPassword: false,
  });
  const { accessToken, setAccessToken, currentUser, setCurrentUser } =
    useContext(AuthContext);

    useEffect(() => {
      if (!accessToken) navigate("/login");
    }, [accessToken]);

  const updateProfile = async (e) => {
    e.preventDefault();
    setErrors({});
    setLoading({ ...loading, updatingName: true });
    const data = { name };
    try {
      const response = await axios.put(
        `${BASE_URL}/user/update/profile`,
        data,
        getConfig(accessToken)
      );
      setCurrentUser(response.data.user);
      setLoading({ ...loading, updatingName: false });
      setName("");
    } catch (error) {
      setLoading({ ...loading, updatingName: false });
      if (error.response.status === 422) {
        setErrors(error.response.data.errors);
      }
      console.log(error);
    }
  };

  const updatePassword = async (e) => {
    e.preventDefault();
    setErrors({});
    setLoading({ ...loading, updatingPassword: true });
    const data = { current_password: currentPassword, password: password };
    try {
      const response = await axios.put(
        `${BASE_URL}/user/update/password`,
        data,
        getConfig(accessToken)
      );
      setLoading({ ...loading, updatingPassword: false });
      setPassword("");
      setCurrentPassword("");
      toast.success(response.data.message, {
        position: toast.POSITION.TOP_RIGHT,
      });
    } catch (error) {
      setLoading({ ...loading, updatingPassword: false });
      if (error.response.status === 422) {
        setErrors(error.response.data.errors);
      }
      console.log(error);
    }
  };

  return (
    <div className="container">
      <div className="row my-5">
        <div className="col-md-6">
          <div className="card">
            <div className="card-header bg-white text-center">
              <h4 className="mt-2">Actualizar nombre</h4>
            </div>
            <div className="card-body">
              <form onSubmit={(e) => updateProfile(e)}>
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
                    <div>
                      {loading.updatingName ? (
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
        <div className="col-md-6">
          <div className="card">
            <div className="card-header bg-white text-center">
              <h4 className="mt-2">Actualizar contraseña</h4>
            </div>
            <div className="card-body">
              <form onSubmit={(e) => updatePassword(e)}>
                <div className="row mb-4">
                  <div className="col">
                    <div className="form-group">
                      <input
                        type="password"
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        name="current_password"
                        value={currentPassword}
                        className="form-control mb-2 rounded-0"
                        placeholder="Contraseña actual"
                      />
                      {renderValidationErrors(errors, "current_password")}
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
                      {loading.updatingPassword ? (
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
