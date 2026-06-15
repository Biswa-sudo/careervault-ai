import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await api.post(
        "/auth/login",
        {
          phoneNumber,
          password
        }
      );
      
      if (response.data && response.data.success) {
        login(
          response.data.data.accessToken,
          response.data.data.user
        );
        navigate("/dashboard");
      } else {
        throw new Error(response.data?.message || "Login failed");
      }

    } catch (error) {
      setError(error.response?.data?.message || error.message || "Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '50px auto', padding: '20px', background: '#fff', borderRadius: '8px', boxShadow: '0 0 10px rgba(0,0,0,0.1)', fontFamily: 'Arial, sans-serif' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '20px', color: '#1f2937' }}>CareerVault AI Login</h2>

      {error && <div style={{ color: '#991b1b', fontSize: '14px', background: '#fee2e2', padding: '10px', borderRadius: '4px', marginBottom: '15px' }}>{error}</div>}

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', fontSize: '14px' }}>Phone Number</label>
          <input
            type="tel"
            placeholder="9876543210"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            required
            style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
          />
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', fontSize: '14px' }}>Password</label>
          <input
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
            required
            style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
          />
        </div>

        <button 
          type="submit"
          disabled={loading}
          style={{ width: '100%', padding: '12px', background: '#1f2937', color: '#fff', border: 'none', borderRadius: '4px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer' }}
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>

      <p style={{ textAlign: 'center', marginTop: '15px', fontSize: '14px' }}>
        Don't have an account? <Link to="/signup" style={{ color: '#2563eb', textDecoration: 'none' }}>Sign Up</Link>
      </p>
    </div>
  );
}