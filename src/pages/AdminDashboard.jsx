import React, { useEffect, useState, useContext } from "react";
import api from "../api/axios";
import { AuthContext } from "../context/AuthContext";
import "../styles/main.css";

export default function AdminDashboard() {
  const { token, logout, username } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [cars, setCars] = useState([]);

  useEffect(() => {
    api.get("/admin/users").then(res => setUsers(res.data));
    api.get("/admin/cars").then(res => setCars(res.data));
  }, [token]);

  const unparkCar = async (carId) => {
    try {
      await api.post(`/admin/cars/unpark/${carId}`);
      const res = await api.get("/admin/cars");
      setCars(res.data);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to unpark car");
    }
  };

  return (
    <div className="dashboard">
      <nav className="navbar">
        <div className="nav-content">
          <h1 className="nav-title">ParkSafe Admin</h1>
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
          <h3 className="card-title">All Users</h3>
          <div className="car-list">
            {users.map(user => (
              <div key={user.id} className="car-item">
                <div className="car-info">
                  <span className="car-plate">{user.username}</span>
                  <span className="status-badge status-unparked">{user.email}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
  <h3 className="card-title">All Cars</h3>
  <div className="car-list">
    {cars.map(car => (
      <div key={car.id} className="car-item">
        <div className="car-info">
          <span className="car-plate">{car.plateNumber}</span>
          <span className={`status-badge ${car.parked ? 'status-parked' : 'status-unparked'}`}>
            {car.parked ? "Parked" : "Unparked"}
          </span>
          <span className="status-badge status-unparked">
            Driver: {car.driverUsername} ({car.driverEmail})
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