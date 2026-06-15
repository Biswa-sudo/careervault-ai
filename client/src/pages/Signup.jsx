import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';

export default function Signup() {
  // 1. Component States for Form Tracking
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // 2. Submit Handler to send payload to backend API
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const payload = { 
      name: fullName,
      email, 
      password, 
      phoneNumber 
    };

    try {
      // Use axios to make API request with proper URL
      const response = await api.post('/auth/signup', payload);

      if (response.data && response.data.success) {
        // Success! Account created, send them straight to login
        navigate('/login');
      } else {
        throw new Error(response.data?.message || "Something went wrong during signup.");
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Signup failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '50px auto', padding: '20px', background: '#fff', borderRadius: '8px', boxShadow: '0 0 10px rgba(0,0,0,0.1)', fontFamily: 'Arial, sans-serif' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '20px', color: '#1f2937' }}>Create CareerVault Account</h2>
      
      {error && <p style={{ color: 'red', fontSize: '14px', background: '#fee2e2', padding: '10px', borderRadius: '4px' }}>{error}</p>}

      <form onSubmit={handleSubmit}>
        {/* Full Name Input */}
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', fontSize: '14px' }}>Full Name</label>
          <input 
            type="text" 
            placeholder="John Doe" 
            value={fullName} 
            onChange={(e) => setFullName(e.target.value)} 
            required 
            style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
          />
        </div>

        {/* Email Input */}
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', fontSize: '14px' }}>Email Address</label>
          <input 
            type="email" 
            placeholder="john@example.com" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required 
            style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
          />
        </div>

        {/* Phone Number Input */}
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', fontSize: '14px' }}>Phone Number (Your Public CV URL ID)</label>
          <input 
            type="tel" 
            placeholder="e.g., 9876543210" 
            value={phoneNumber} 
            onChange={(e) => setPhoneNumber(e.target.value)} 
            required 
            style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
          />
        </div>

        {/* Password Input */}
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', fontSize: '14px' }}>Password</label>
          <input 
            type="password" 
            placeholder="••••••••" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required 
            style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
          />
        </div>

        {/* Submit Button */}
        <button 
          type="submit" 
          disabled={loading}
          style={{ width: '100%', padding: '12px', background: '#1f2937', color: '#fff', border: 'none', borderRadius: '4px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer' }}
        >
          {loading ? "Creating Account..." : "Register & Continue"}
        </button>
      </form>

      <p style={{ textAlign: 'center', marginTop: '15px', fontSize: '14px' }}>
        Already have an account? <Link to="/login" style={{ color: '#2563eb', textDecoration: 'none' }}>Log In</Link>
      </p>
    </div>
  );
}