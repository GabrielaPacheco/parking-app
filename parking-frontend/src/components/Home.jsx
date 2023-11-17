import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../helpers/authContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "../helpers/url";
import { getConfig } from "../helpers/config";
import { toast } from "react-toastify";
import Spinner from "./layouts/Spinner";
import Stripe from "./payments/Stripe";

export default function Home() {
  const [sectors, setSectors] = useState([]);
  const { accessToken, currentUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState({ id: null, status: false });
  const [amount, setAmount] = useState(
    JSON.parse(localStorage.getItem("amount") || 0)
  );

  useEffect(() => {
    if (!accessToken) navigate("/login");
    const fetchSectors = async () => {
      try {
        const response = await axios.get(
          `${BASE_URL}/sectors`,
          getConfig(accessToken)
        );
        setSectors(response.data.data);
      } catch (error) {
        console.log(error);
      }
    };
    if (accessToken) {
      fetchSectors();
    }
  }, [accessToken]);

  const startParking = async (place_id) => {
    setLoading({
      ...loading,
      id: place_id,
      status: true,
    });

    const data = { user_id: currentUser?.id };

    try {
      const response = await axios.put(
        `${BASE_URL}/parking/${place_id}/start`,
        data,
        getConfig(accessToken)
      );
      if (response.data.error) {
        toast.error(response.data.error, {
          position: toast.POSITION.TOP_RIGHT,
        });
      }

      let updatedPlace = response.data.data;

      const updatedSectors = [...sectors];

      const sector = updatedSectors.find(
        (sector) => sector.id === updatedPlace.sector_id
      );

      sector.places = sector.places.map((place) =>
        place.id === place_id ? { ...place, ...updatedPlace } : place
      );

      setSectors(updatedSectors);

      setLoading({
        ...loading,
        id: place_id,
        status: false,
      });
    } catch (error) {
      console.log(error);
      setLoading({
        ...loading,
        id: place_id,
        status: false,
      });
    }
  };

  const endParking = async (place_id) => {
    setLoading({
      ...loading,
      id: place_id,
      status: true,
    });
    const data = { user_id: currentUser?.id };
    try {
      const response = await axios.put(
        `${BASE_URL}/parking/${place_id}/end`,
        data,
        getConfig(accessToken)
      );
      let updatedPlace = response.data.data;
      const updatedSectors = [...sectors];
      const sector = updatedSectors.find(
        (sector) => sector.id === updatedPlace.sector_id
      );
      sector.places = sector.places.map((place) =>
        place.id === place_id ? { ...place, ...updatedPlace } : place
      );
      setSectors(updatedSectors);

      localStorage.setItem("amount", JSON.stringify(updatedPlace.precio_total));
      setAmount(updatedPlace.precio_total);

      toast.success("El parqueo terminó, favor de revisar el monto a pagar.", {
        position: toast.POSITION.TOP_RIGHT,
      });
      setLoading({
        ...loading,
        id: place_id,
        status: false,
      });
    } catch (error) {
      console.log(error);
      setLoading({
        ...loading,
        id: place_id,
        status: false,
      });
    }
  };

  return (
    <div className="container">
      <div className="row my-4">
        <div className="col-md-8">
          <div className="card">
            <div className="card-body">
              <div className="card-header bg-white text-center">
                <h4 className="mt-2">Sectores</h4>
              </div>
              <div className="card-body">
                <div className="row">
                  {sectors?.map((sector) => (
                    <div className="col-md-4" key={sector.id}>
                      <div className="card boder border-dark">
                        <div className="text-center">
                          <h5 className="mt-3">
                            {sector.nombre} (${sector.precio_hora})
                          </h5>
                          <p className="text-muted">
                            <span className="text-danger">*</span>
                            <i>Precio por 1 hora</i>
                          </p>
                        </div>
                        <div className="card-body">
                          {sector.places?.map((place) => (
                            <div
                              className="card boder border-dark m-2"
                              key={place.id}
                            >
                              <div className="text-center">
                                <h6 className="mt-2">{place.nombre}</h6>
                              </div>
                              <div className="card-body d-flex flex-column justify-content-center align-items-center">
                                {place.disponibilidad ? (
                                  <>
                                    <span className="mb-2">
                                      <i className="fas fa-car fa-2x"></i>
                                    </span>
                                    {loading.id === place.id &&
                                    loading.status ? (
                                      <Spinner />
                                    ) : (
                                      <button
                                      disabled={amount>0}
                                        onClick={() => startParking(place.id)}
                                        className="btn btn-danger btn-sm text-capitalize"
                                      >
                                        Parquear aquí!
                                      </button>
                                    )}
                                  </>
                                ) : (
                                  <>
                                    <span className="mb-2">
                                      <i className="text-muted">
                                        {place.tiempo_inicio}
                                      </i>
                                    </span>
                                    <span className="mb-2">
                                      <i className="fa-solid fa-ban fa-2x text-danger"></i>
                                    </span>
                                    {loading.id === place.id &&
                                    loading.status ? (
                                      <Spinner />
                                    ) : (
                                      place.user_id === currentUser?.id && (
                                        <button
                                          onClick={() => endParking(place.id)}
                                          className="btn btn-warning btn-sm text-capitalize"
                                        >
                                          Terminar parqueo
                                        </button>
                                      )
                                    )}
                                  </>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
        {amount > 0 && (
          <div className="col-md-4">
            <div className="card">
              <div className="card-header">
                <h5 className="text-center">
                  Monto a pagar:
                  <span className="text-danger fw-bo">${amount}</span>
                </h5>
              </div>
              <div className="card-body">
                <Stripe amount={amount} setAmount={setAmount} />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
