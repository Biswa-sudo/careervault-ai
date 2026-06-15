import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";

export default function Dashboard() {
  const { isAuthenticated, user } = useAuth();
  
  // Local state tracking for our MVP subscription & features
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [loadingPayment, setLoadingPayment] = useState(false);
  const [documents, setDocuments] = useState([]);
  const [uploadingDoc, setUploadingDoc] = useState(false);

  // AI Parser Frontend States
  const [parsingCv, setParsingCv] = useState(false);
  const [aiParsedData, setAiParsedData] = useState(null);
  const [savingCv, setSavingCv] = useState(false);

  // Sync with user context subscription status if available
  useEffect(() => {
    if (user && user.isSubscribed) {
      setIsSubscribed(true);
    }
  }, [user]);

  // Fast Payment Simulation Handler (Flips the subscription flag instantly)
  const handlePayment = async () => {
    setLoadingPayment(true);
    try {
      // Simulating network request for payment completion
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setIsSubscribed(true);
      alert("Payment of ₹99 Successful! Welcome to CareerVault Premium.");
    } catch (err) {
      alert("Payment failed. Please try again.");
    } finally {
      setLoadingPayment(false);
    }
  };

  // Real Network Upload to our AI Parsing Endpoint
  const handleCvAiParse = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setParsingCv(true);
    
    const formData = new FormData();
    formData.append("resumeFile", file);

    try {
      const response = await fetch("/api/v1/resumes/upload-parse", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Failed to parse document via AI engine.");
      }

      setAiParsedData(result.data);
      alert("Success! Gemini AI has parsed and mapped your document parameters.");
    } catch (err) {
      alert(`Error running parser: ${err.message}`);
    } finally {
      setParsingCv(false);
    }
  };

  // NEW FEATURE TASK 3.3: Submit Edited Data back to MySQL Table
  const handleSaveAndPublish = async () => {
    if (!aiParsedData) return;
    
    setSavingCv(true);
    // Grab phone number dynamically from user, fallback to dummy string if none exists
    const userPhone = user?.phoneNumber || "9876543210";

    try {
      const response = await fetch("/api/v1/resumes/save-public", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          phoneNumber: userPhone,
          resumeData: aiParsedData
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Failed to update database portfolio record.");
      }

      alert("🎉 Portfolio published live dynamically! Check your public phone link now.");
    } catch (err) {
      alert(`Database error: ${err.message}`);
    } finally {
      setSavingCv(false);
    }
  };

  // Document Vault Simulation Upload Handler
  const handleDocUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadingDoc(true);
    setTimeout(() => {
      setDocuments(prev => [...prev, { name: file.name, date: new Date().toLocaleDateString() }]);
      setUploadingDoc(false);
      alert(`${file.name} saved successfully in your personal vault!`);
    }, 1200);
  };

  // Generate the unique public URL based on user data
  const publicCvUrl = user?.phoneNumber 
    ? `${window.location.origin}/cv/${user.phoneNumber}`
    : `${window.location.origin}/cv/9876543210`;

  return (
    <div style={{ maxWidth: "900px", margin: "40px auto", padding: "20px", fontFamily: "Arial, sans-serif" }}>
      
      {/* HEADER SECTION */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "2px solid #eaeaea", paddingBottom: "20px", marginBottom: "30px" }}>
        <div>
          <h1 style={{ color: "#1f2937", margin: 0 }}>CareerVault AI Dashboard</h1>
          <p style={{ color: "#6b7280", margin: "5px 0 0 0" }}> Welcome back, {user?.name || "Professional"} </p>
        </div>
        <span style={{ padding: "6px 12px", borderRadius: "20px", fontSize: "14px", fontWeight: "bold", background: isSubscribed ? "#d1fae5" : "#fee2e2", color: isSubscribed ? "#065f46" : "#991b1b" }}>
          {isSubscribed ? "✨ Premium Active" : "❌ Unsubscribed"}
        </span>
      </div>

      {/* --- CONDITION 1: UNSUBSCRIBED LANDING PAYWALL --- */}
      {!isSubscribed ? (
        <div style={{ textAlign: "center", padding: "40px 20px", background: "#f9fafb", borderRadius: "12px", border: "1px solid #e5e7eb" }}>
          <h2 style={{ color: "#111827", fontSize: "28px", marginBottom: "10px" }}>Unlock Auto-AI CV Generation & Live Portfolios</h2>
          <p style={{ color: "#4b5563", fontSize: "16px", maxWidth: "600px", margin: "0 auto 30px auto", lineHeight: "1.6" }}>
            Upload your existing CV, let our AI completely extract your details into organized fields, select premium layouts, and get a custom digital webpage link based on your phone number instantly!
          </p>

          <div style={{ background: "#fff", maxWidth: "350px", margin: "0 auto", padding: "25px", borderRadius: "8px", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)", border: "2px solid #1f2937" }}>
            <h3 style={{ margin: "0 0 10px 0", color: "#1f2937" }}>Yearly Plan</h3>
            <div style={{ fontSize: "36px", fontWeight: "bold", color: "#111827", marginBottom: "15px" }}>
              ₹99 <span style={{ fontSize: "16px", fontWeight: "normal", color: "#6b7280" }}>/ year</span>
            </div>
            <ul style={{ textAlign: "left", paddingLeft: "20px", color: "#4b5563", fontSize: "14px", lineHeight: "2", marginBottom: "25px" }}>
              <li>⚡ AI Automatic CV Data Extraction</li>
              <li>🌐 Public Page Link via Phone Number</li>
              <li>📂 Secure Other Document Vault Storage</li>
              <li>🎨 Unlimited Template Interchanges</li>
            </ul>
            <button 
              onClick={handlePayment} 
              disabled={loadingPayment}
              style={{ width: "100%", padding: "12px", background: "#2563eb", color: "#fff", border: "none", borderRadius: "6px", fontSize: "16px", fontWeight: "bold", cursor: "pointer" }}
            >
              {loadingPayment ? "Processing Payment..." : "Subscribe Now (₹99)"}
            </button>
          </div>
        </div>
      ) : (
        
        /* --- CONDITION 2: PREMIUM SUBSCRIBED DASHBOARD VIEW --- */
        <div>
          {/* FEATURE A: PUBLIC PORTFOLIO LINK */}
          <div style={{ background: "#eff6ff", border: "1px solid #bfdbfe", padding: "20px", borderRadius: "8px", marginBottom: "25px" }}>
            <h3 style={{ margin: "0 0 5px 0", color: "#1e40af" }}>🌐 Your Live Public Portfolio Link</h3>
            <p style={{ color: "#1e3a8a", fontSize: "14px", margin: "0 0 12px 0" }}>Anyone browsing this URL will instantly see your primary verified CV layout.</p>
            <div style={{ display: "flex", gap: "10px" }}>
              <input 
                type="text" 
                readOnly 
                value={publicCvUrl} 
                style={{ flex: 1, padding: "10px", borderRadius: "4px", border: "1px solid #bfdbfe", background: "#fff" }}
              />
              <button 
                onClick={() => { navigator.clipboard.writeText(publicCvUrl); alert("Link copied to clipboard!"); }}
                style={{ padding: "10px 15px", background: "#1e40af", color: "#fff", border: "none", borderRadius: "4px", cursor: "pointer", fontWeight: "bold" }}
              >
                Copy Link
              </button>
            </div>
          </div>

          {/* FEATURE B: AI AUTOMATED CV PARSING SECTION */}
          <div style={{ background: "#fff", border: "1px solid #e5e7eb", padding: "25px", borderRadius: "8px", marginBottom: "25px" }}>
            <h3 style={{ margin: "0 0 10px 0", color: "#1f2937" }}>⚡ Fast AI CV Extraction Engine</h3>
            <p style={{ color: "#4b5563", fontSize: "14px", margin: "0 0 15px 0" }}>Upload an existing resume file. Gemini AI will instantly parse the contents into your design editor workspace.</p>
            <div style={{ border: "2px dashed #cbd5e1", padding: "30px", textAlign: "center", borderRadius: "6px", background: "#f8fafc", cursor: "pointer" }}>
              <input 
                type="file" 
                accept=".pdf,.doc,.docx" 
                onChange={handleCvAiParse} 
                disabled={parsingCv}
                style={{ display: "block", margin: "0 auto" }} 
              />
              <p style={{ margin: "10px 0 0 0", fontSize: "12px", color: "#64748b", fontWeight: "bold" }}>
                {parsingCv ? "⏳ Gemini AI is analyzing file elements..." : "Supports PDF or DOCX formats"}
              </p>
            </div>

            {/* LIVE DATA PREVIEW PORTLET IF PARSED WORKSPACE IS PRESENT */}
            {aiParsedData && (
              <div style={{ marginTop: "25px", padding: "20px", background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: "6px" }}>
                <h4 style={{ color: "#166534", margin: "0 0 15px 0" }}>✅ Verified AI Extracted Workspace Fields</h4>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px", fontSize: "14px", marginBottom: "15px" }}>
                  <div>
                    <strong>Name:</strong> 
                    <input type="text" value={aiParsedData.personalInfo.fullName} onChange={(e) => setAiParsedData({...aiParsedData, personalInfo: {...aiParsedData.personalInfo, fullName: e.target.value}})} style={{ width:"100%", padding:"6px", marginTop:"4px" }}/>
                  </div>
                  <div>
                    <strong>Designation:</strong> 
                    <input type="text" value={aiParsedData.personalInfo.designation} onChange={(e) => setAiParsedData({...aiParsedData, personalInfo: {...aiParsedData.personalInfo, designation: e.target.value}})} style={{ width:"100%", padding:"6px", marginTop:"4px" }}/>
                  </div>
                </div>
                <button 
                  onClick={handleSaveAndPublish}
                  disabled={savingCv}
                  style={{ padding: "10px 15px", background: "#166534", color: "#fff", border: "none", borderRadius: "4px", cursor: "pointer", fontWeight: "bold" }}
                >
                  {savingCv ? "Saving to Database..." : "Save & Publish Portfolio"}
                </button>
              </div>
            )}
          </div>

          {/* FEATURE C: SECURE DOCUMENT VAULT STORAGE */}
          <div style={{ background: "#fff", border: "1px solid #e5e7eb", padding: "25px", borderRadius: "8px" }}>
            <h3 style={{ margin: "0 0 5px 0", color: "#1f2937" }}>📂 Secure Personal Document Vault</h3>
            <p style={{ color: "#4b5563", fontSize: "14px", margin: "0 0 15px 0" }}>Save accompanying certificates, marksheets, or reference letters securely.</p>
            
            <div style={{ marginBottom: "20px" }}>
              <label style={{ display: "inline-block", padding: "8px 15px", background: "#4b4563", color: "#fff", borderRadius: "4px", cursor: "pointer", fontSize: "14px", fontWeight: "bold" }}>
                {uploadingDoc ? "Saving..." : "➕ Upload Other Document"}
                <input type="file" onChange={handleDocUpload} disabled={uploadingDoc} style={{ display: "none" }} />
              </label>
            </div>

            {/* Document Listing Render */}
            {documents.length === 0 ? (
              <p style={{ color: "#9ca3af", fontSize: "14px", fontStyle: "italic" }}>No other documents saved yet.</p>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {documents.map((doc, idx) => (
                  <div key={idx} style={{ display: "flex", justifyContent: "space-between", padding: "12px", background: "#f3f4f6", borderRadius: "4px", fontSize: "14px" }}>
                    <span style={{ fontWeight: "bold", color: "#374151" }}>📄 {doc.name}</span>
                    <span style={{ color: "#6b7280" }}>Uploaded on {doc.date}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      )}
    </div>
  );
}