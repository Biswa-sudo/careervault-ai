import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getResumes } from "../api/resumeApi";

export default function Dashboard() {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    
    loadResumes();
  }, [isAuthenticated, navigate]);

  const loadResumes = async () => {
    try {
      const response = await getResumes();
      setResumes(response.data || []);
    } catch (error) {
      console.error("Failed to load resumes:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const publicCvUrl = user?.phoneNumber 
    ? `${window.location.origin}/cv/${user.phoneNumber}`
    : null;

  return (
    <div style={{ maxWidth: "1000px", margin: "0 auto", padding: "20px", fontFamily: "Arial, sans-serif" }}>
      
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingBottom: "20px", borderBottom: "2px solid #e5e7eb", marginBottom: "30px" }}>
        <div>
          <h1 style={{ color: "#1f2937", margin: 0 }}>Dashboard</h1>
          <p style={{ color: "#6b7280", margin: "5px 0 0 0" }}>Welcome, {user?.name || "User"}</p>
        </div>
        <button 
          onClick={handleLogout}
          style={{ padding: "8px 16px", background: "#dc2626", color: "#fff", border: "none", borderRadius: "4px", cursor: "pointer", fontSize: "14px" }}
        >
          Logout
        </button>
      </div>

      {/* Public Portfolio Link */}
      {publicCvUrl && (
        <div style={{ background: "#eff6ff", border: "1px solid #bfdbfe", padding: "20px", borderRadius: "8px", marginBottom: "30px" }}>
          <h3 style={{ margin: "0 0 10px 0", color: "#1e40af" }}>🌐 Your Public Portfolio</h3>
          <p style={{ color: "#1e3a8a", fontSize: "14px", margin: "0 0 12px 0" }}>
            Share your primary resume with anyone using this link:
          </p>
          <div style={{ display: "flex", gap: "10px" }}>
            <input 
              type="text" 
              readOnly 
              value={publicCvUrl} 
              style={{ flex: 1, padding: "10px", borderRadius: "4px", border: "1px solid #bfdbfe", background: "#fff", fontFamily: "monospace", fontSize: "12px" }}
            />
            <button 
              onClick={() => { navigator.clipboard.writeText(publicCvUrl); alert("Link copied!"); }}
              style={{ padding: "10px 15px", background: "#1e40af", color: "#fff", border: "none", borderRadius: "4px", cursor: "pointer", whiteSpace: "nowrap" }}
            >
              Copy Link
            </button>
          </div>
        </div>
      )}

      {/* Create New Resume Button */}
      <div style={{ marginBottom: "30px" }}>
        <Link 
          to="/resumes/new"
          style={{ padding: "12px 24px", background: "#2563eb", color: "#fff", border: "none", borderRadius: "4px", cursor: "pointer", fontSize: "16px", fontWeight: "bold", textDecoration: "none", display: "inline-block" }}
        >
          + Create New Resume
        </Link>
      </div>

      {/* Resumes List */}
      <div>
        <h2 style={{ color: "#1f2937", marginBottom: "15px" }}>My Resumes</h2>
        
        {loading ? (
          <p style={{ color: "#6b7280" }}>Loading resumes...</p>
        ) : resumes.length === 0 ? (
          <div style={{ background: "#f3f4f6", padding: "30px", borderRadius: "8px", textAlign: "center" }}>
            <p style={{ color: "#6b7280", margin: 0 }}>No resumes yet. Create one to get started!</p>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "20px" }}>
            {resumes.map((resume) => (
              <div key={resume.id} style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: "8px", padding: "20px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
                <h3 style={{ margin: "0 0 10px 0", color: "#1f2937" }}>{resume.title}</h3>
                <p style={{ color: "#6b7280", fontSize: "14px", margin: "0 0 15px 0" }}>
                  Created: {new Date(resume.createdAt).toLocaleDateString()}
                </p>
                <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                  <Link 
                    to={`/resumes/${resume.id}/preview`}
                    style={{ padding: "6px 12px", background: "#1e40af", color: "#fff", border: "none", borderRadius: "4px", cursor: "pointer", fontSize: "12px", textDecoration: "none" }}
                  >
                    👁️ Preview
                  </Link>
                  <Link 
                    to={`/resumes/${resume.id}`}
                    style={{ padding: "6px 12px", background: "#2563eb", color: "#fff", border: "none", borderRadius: "4px", cursor: "pointer", fontSize: "12px", textDecoration: "none" }}
                  >
                    ✏️ Edit
                  </Link>
                  <button 
                    onClick={() => handleDownloadPdf(resume.id)}
                    style={{ padding: "6px 12px", background: "#16a34a", color: "#fff", border: "none", borderRadius: "4px", cursor: "pointer", fontSize: "12px" }}
                  >
                    📥 PDF
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  async function handleDownloadPdf(resumeId) {
    try {
      const { downloadResumePdf } = await import("../api/resumeApi");
      const blob = await downloadResumePdf(resumeId);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `resume-${resumeId}.pdf`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      alert("Failed to download PDF");
    }
  }
}
