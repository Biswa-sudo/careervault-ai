import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getResumeById,
  updateResume,
  createResume,
} from "../api/resumeApi";

import { sampleCandidates } from "../data/sampleCandidates";
import { templates } from "../data/templates";

export default function ResumeEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);
  
  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [title, setTitle] = useState("");
  const [personalInfo, setPersonalInfo] = useState({
    fullName: "",
    email: "",
    phone: "",
    location: "",
    linkedin: "",
    github: "",
  });

  const [skills, setSkills] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState("modern");

  useEffect(() => {
    const loadResume = async () => {
      try {
        if (isEditMode) {
          const response = await getResumeById(id);
          setResume(response.data);
          setTitle(response.data.title || "");
          
          const data = typeof response.data.resumeData === 'string' 
            ? JSON.parse(response.data.resumeData)
            : response.data.resumeData || {};
          
          setPersonalInfo({
            fullName: data.personalInfo?.fullName || "",
            email: data.personalInfo?.email || "",
            phone: data.personalInfo?.phone || "",
            location: data.personalInfo?.address || "",
            linkedin: data.personalInfo?.website || "",
            github: "",
          });

          setSkills(data.skills?.join(", ") || "");
          setSelectedTemplate(response.data.template_id || "modern");
        } else {
          // New resume - use sample data
          const candidate = sampleCandidates[0] || {};
          setTitle(candidate.title ? `${candidate.title} Resume` : "New Resume");
          setPersonalInfo({
            fullName: candidate.name || "",
            email: candidate.email || "",
            phone: candidate.phone || "",
            location: candidate.location || "",
            linkedin: "",
            github: "",
          });
          setSkills(candidate.skills?.join(", ") || "");
        }
      } catch (error) {
        console.error("Error loading resume:", error);
        alert("Failed to load resume");
      } finally {
        setLoading(false);
      }
    };

    loadResume();
  }, [id, isEditMode]);

  const handleSave = async () => {
    if (!title.trim() || !personalInfo.fullName.trim()) {
      alert("Please fill in title and name");
      return;
    }

    setSaving(true);
    try {
      const payload = {
        title,
        template_id: selectedTemplate,
        resume_data: JSON.stringify({
          personalInfo: {
            fullName: personalInfo.fullName,
            email: personalInfo.email,
            phone: personalInfo.phone,
            address: personalInfo.location,
            website: personalInfo.linkedin,
          },
          skills: skills
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean),
        }),
      };

      if (isEditMode) {
        await updateResume(resume.id, payload);
        alert("Resume updated!");
      } else {
        await createResume(payload);
        alert("Resume created!");
      }
      
      navigate("/dashboard");
    } catch (error) {
      console.error("Error saving resume:", error);
      alert(error.response?.data?.message || "Save failed");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div style={{ maxWidth: "800px", margin: "50px auto", padding: "20px", fontFamily: "Arial, sans-serif" }}>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto", padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h1 style={{ color: "#1f2937", marginBottom: "20px" }}>
        {isEditMode ? "Edit Resume" : "Create New Resume"}
      </h1>

      <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: "8px", padding: "25px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
        
        <div style={{ marginBottom: "20px" }}>
          <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold", fontSize: "14px" }}>Resume Title</label>
          <input
            type="text"
            placeholder="e.g., Senior Developer Resume"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={{ width: "100%", padding: "10px", borderRadius: "4px", border: "1px solid #ccc" }}
          />
        </div>

        <div style={{ marginBottom: "20px" }}>
          <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold", fontSize: "14px" }}>Template</label>
          <select
            value={selectedTemplate}
            onChange={(e) => setSelectedTemplate(e.target.value)}
            style={{ width: "100%", padding: "10px", borderRadius: "4px", border: "1px solid #ccc" }}
          >
            {templates.map((template) => (
              <option key={template.id} value={template.id}>
                {template.name}
              </option>
            ))}
          </select>
        </div>

        <div style={{ marginBottom: "20px" }}>
          <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold", fontSize: "14px" }}>Full Name</label>
          <input
            type="text"
            placeholder="Your Name"
            value={personalInfo.fullName}
            onChange={(e) => setPersonalInfo({ ...personalInfo, fullName: e.target.value })}
            style={{ width: "100%", padding: "10px", borderRadius: "4px", border: "1px solid #ccc" }}
          />
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px", marginBottom: "20px" }}>
          <div>
            <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold", fontSize: "14px" }}>Email</label>
            <input
              type="email"
              placeholder="your@email.com"
              value={personalInfo.email}
              onChange={(e) => setPersonalInfo({ ...personalInfo, email: e.target.value })}
              style={{ width: "100%", padding: "10px", borderRadius: "4px", border: "1px solid #ccc" }}
            />
          </div>

          <div>
            <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold", fontSize: "14px" }}>Phone</label>
            <input
              type="tel"
              placeholder="9876543210"
              value={personalInfo.phone}
              onChange={(e) => setPersonalInfo({ ...personalInfo, phone: e.target.value })}
              style={{ width: "100%", padding: "10px", borderRadius: "4px", border: "1px solid #ccc" }}
            />
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px", marginBottom: "20px" }}>
          <div>
            <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold", fontSize: "14px" }}>Location</label>
            <input
              type="text"
              placeholder="City, Country"
              value={personalInfo.location}
              onChange={(e) => setPersonalInfo({ ...personalInfo, location: e.target.value })}
              style={{ width: "100%", padding: "10px", borderRadius: "4px", border: "1px solid #ccc" }}
            />
          </div>

          <div>
            <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold", fontSize: "14px" }}>LinkedIn/Website</label>
            <input
              type="url"
              placeholder="https://linkedin.com/in/yourname"
              value={personalInfo.linkedin}
              onChange={(e) => setPersonalInfo({ ...personalInfo, linkedin: e.target.value })}
              style={{ width: "100%", padding: "10px", borderRadius: "4px", border: "1px solid #ccc" }}
            />
          </div>
        </div>

        <div style={{ marginBottom: "25px" }}>
          <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold", fontSize: "14px" }}>Skills (comma-separated)</label>
          <textarea
            placeholder="React, JavaScript, Node.js, MySQL, etc."
            rows="4"
            value={skills}
            onChange={(e) => setSkills(e.target.value)}
            style={{ width: "100%", padding: "10px", borderRadius: "4px", border: "1px solid #ccc", fontFamily: "monospace" }}
          />
        </div>

        <div style={{ display: "flex", gap: "10px" }}>
          <button
            onClick={handleSave}
            disabled={saving}
            style={{ padding: "12px 24px", background: "#2563eb", color: "#fff", border: "none", borderRadius: "4px", cursor: "pointer", fontSize: "16px", fontWeight: "bold" }}
          >
            {saving ? "Saving..." : isEditMode ? "Save Changes" : "Create Resume"}
          </button>
          <button
            onClick={() => navigate("/dashboard")}
            style={{ padding: "12px 24px", background: "#6b7280", color: "#fff", border: "none", borderRadius: "4px", cursor: "pointer", fontSize: "16px" }}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}