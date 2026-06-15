import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getResumePreview, downloadResumePdf } from "../api/resumeApi";

export default function ResumePreview() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [html, setHtml] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    const loadPreview = async () => {
      try {
        const response = await getResumePreview(id);
        const htmlContent = response.data || response;
        setHtml(htmlContent);
      } catch (error) {
        console.error("Error loading preview:", error);
        setError("Failed to load resume preview");
      } finally {
        setLoading(false);
      }
    };

    loadPreview();
  }, [id]);

  const handleDownloadPdf = async () => {
    setDownloading(true);
    try {
      const blob = await downloadResumePdf(id);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `resume-${id}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      alert("Failed to download PDF");
    } finally {
      setDownloading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ maxWidth: "900px", margin: "50px auto", padding: "20px", fontFamily: "Arial, sans-serif" }}>
        <p>Loading preview...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ maxWidth: "900px", margin: "50px auto", padding: "20px", fontFamily: "Arial, sans-serif" }}>
        <div style={{ background: "#fee2e2", border: "1px solid #fecaca", color: "#991b1b", padding: "15px", borderRadius: "4px", marginBottom: "20px" }}>
          {error}
        </div>
        <button 
          onClick={() => navigate("/dashboard")}
          style={{ padding: "10px 20px", background: "#2563eb", color: "#fff", border: "none", borderRadius: "4px", cursor: "pointer" }}
        >
          Back to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div style={{ fontFamily: "Arial, sans-serif" }}>
      {/* Controls */}
      <div style={{ position: "sticky", top: 0, background: "#fff", padding: "15px", borderBottom: "1px solid #e5e7eb", display: "flex", gap: "10px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
        <button 
          onClick={() => navigate(`/resumes/${id}`)}
          style={{ padding: "10px 20px", background: "#2563eb", color: "#fff", border: "none", borderRadius: "4px", cursor: "pointer" }}
        >
          ✏️ Edit
        </button>
        <button 
          onClick={handleDownloadPdf}
          disabled={downloading}
          style={{ padding: "10px 20px", background: "#16a34a", color: "#fff", border: "none", borderRadius: "4px", cursor: "pointer" }}
        >
          {downloading ? "Downloading..." : "📥 Download PDF"}
        </button>
        <button 
          onClick={() => navigate("/dashboard")}
          style={{ padding: "10px 20px", background: "#6b7280", color: "#fff", border: "none", borderRadius: "4px", cursor: "pointer", marginLeft: "auto" }}
        >
          Back
        </button>
      </div>

      {/* Resume Preview */}
      <div style={{ maxWidth: "900px", margin: "0 auto", padding: "20px" }}>
        <div dangerouslySetInnerHTML={{ __html: html }} />
      </div>
    </div>
  );
}