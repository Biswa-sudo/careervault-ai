import { useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
// import { loginUser } from "../api/authApi";

export default function Login() {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await api.post(
        "/auth/login",
        {
          phoneNumber,
          password
        }
      );
console.log(response.data);
     login(
  response.data.data.accessToken,
  response.data.data.user
);

      navigate("/dashboard");

    } catch (error) {
      alert("Login failed");
    }
  };

  return (
    <div className="container mt-5">
      <h1>CareerVault AI Login</h1>

      <form onSubmit={handleSubmit}>
        <input
          className="form-control mb-3"
          placeholder="Phone Number"
value={phoneNumber}
onChange={(e) => setPhoneNumber(e.target.value)}
        />

        <input
          type="password"
          className="form-control mb-3"
          placeholder="Password"
          value={password}
          onChange={(e) =>
            setPassword(e.target.value)
          }
        />

        <button className="btn btn-primary" type="submit">
          Login
        </button>
      </form>
    </div>
  );
}