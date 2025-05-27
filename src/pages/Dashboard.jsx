import React, { useState, useEffect, useContext } from "react";
import api from "../api/axios";
import { AuthContext } from "../context/AuthContext";
import "../styles/main.css";

export default function Dashboard() {
  const { token, username, logout } = useContext(AuthContext);
  const [cars, setCars] = useState([]);
  const [plateNumber, setPlateNumber] = useState("");

  useEffect(() => {
    if (token) {
      api.get("/cars/my").then(res => setCars(res.data));
    }
  }, [token]);

  const parkCar = async () => {
    try {
      await api.post("/cars/park", { plateNumber });
      setPlateNumber("");
      const res = await api.get("/cars/my");
      setCars(res.data);
    } catch {
      alert("Failed to park car");
    }
  };

  const unparkCar = async (carId) => {
    try {
      await api.post(`/cars/unpark/${carId}`);
      const res = await api.get("/cars/my");
      setCars(res.data);
    } catch {
      alert("Failed to unpark car");
    }
  };

  return (
    <div className="dashboard">
      <nav className="navbar">
        <div className="nav-content">
          <h1 className="nav-title">ParkSafe</h1>
          <div className="nav-user">
            <span>Welcome, {username}</span>
            <button onClick={logout} className="btn btn-primary">
              Logout
            </button>
          </div>
        </div>
      </nav>

      <main className="main-content">
        <div className="card">
          <h3 className="card-title">Park a Car</h3>
          <div className="park-form">
            <input
              value={plateNumber}
              onChange={e => setPlateNumber(e.target.value)}
              placeholder="Enter plate number"
              className="form-input park-input"
            />
            <button onClick={parkCar} className="btn btn-primary">
              Park
            </button>
          </div>
        </div>

        <div className="card">
          <h3 className="card-title">My Cars</h3>
          <div className="car-list">
            {cars.map(car => (
              <div key={car.id} className="car-item">
                <div className="car-info">
                  <span className="car-plate">{car.plateNumber}</span>
                  <span className={`status-badge ${car.parked ? 'status-parked' : 'status-unparked'}`}>
                    {car.parked ? "Parked" : "Unparked"}
                  </span>
                </div>
                {car.parked && (
                  <button onClick={() => unparkCar(car.id)} className="btn btn-primary">
                    Unpark
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}