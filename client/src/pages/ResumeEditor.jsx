import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  getResumeById,
  updateResume,
  createResume,
} from "../api/resumeApi";

import { sampleCandidates } from "../data/sampleCandidates";
import { templates } from "../data/templates";

export default function ResumeEditor() {
  const { id } = useParams();
const isEditMode = Boolean(id);
  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState("");
const [name, setName] = useState("");
const [skills, setSkills] = useState("");

const [selectedCandidate, setSelectedCandidate] =
  useState("developer");

const [selectedTemplate, setSelectedTemplate] =
  useState("modern");

  useEffect(() => {
    const loadResume = async () => {
      try {
        const response = await getResumeById(id);

        console.log("RESUME:", response);

        setResume(response.data);
        setTitle(response.data.title || "");

setName(
  response.data.resumeData?.name || ""
);

setSkills(
  response.data.resumeData?.skills?.join(
    ", "
  ) || ""
);

setSelectedTemplate(
  response.data.templateId || "modern"
);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    if (isEditMode) {
  loadResume();
} else {
  const candidate =
    sampleCandidates[0];

  setTitle(
    `${candidate.title} Resume`
  );

  setName(candidate.name);

  setSkills(
    candidate.skills.join(", ")
  );

  setLoading(false);
}
  }, [id]);

  if (loading) {
    return (
      <div className="container mt-5">
        <h3>Loading Resume...</h3>
      </div>
    );
  }

  if (!resume && id) {
    return (
      <div className="container mt-5">
        <h3>Resume not found</h3>
      </div>
    );
  }

  const handleCandidateChange = (candidateId) => {
  setSelectedCandidate(candidateId);

  const candidate = sampleCandidates.find(
    (c) => c.id === candidateId
  );

  if (!candidate) return;

  setTitle(`${candidate.title} Resume`);
  setName(candidate.name);
  setSkills(candidate.skills.join(", "));
};

  const handleSave = async () => {
  try {
    const payload = {
      title,
      templateId: selectedTemplate,
      resumeData: {
        name,
        skills: skills
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
      },
    };

    if (isEditMode) {
      await updateResume(
        resume.id,
        payload
      );

      alert("Resume updated!");
    } else {
      await createResume(payload);

      alert("Resume created!");
    }
  } catch (error) {
  console.error("CREATE ERROR:", error);

  if (error.response) {
    console.log("SERVER RESPONSE:", error.response.data);
  }

  alert("Save failed");
}
};

  return (
    <div className="container mt-5">
      <h1>
  {isEditMode
    ? "Edit Resume"
    : "Create Resume"}
</h1>

      {(!isEditMode || resume) ? (
  <div className="card mt-4">
          <div className="card-body">
            <h4>
  {isEditMode
    ? resume.title
    : "New Resume"}
</h4>

<div className="mb-3">
  <label className="form-label">
    Candidate
  </label>

  <select
    className="form-select"
    value={selectedCandidate}
    onChange={(e) =>
      handleCandidateChange(
        e.target.value
      )
    }
  >
    {sampleCandidates.map(
      (candidate) => (
        <option
          key={candidate.id}
          value={candidate.id}
        >
          {candidate.name}
        </option>
      )
    )}
  </select>
</div>

<div className="mb-3">
  <label className="form-label">
    Template
  </label>

  <select
    className="form-select"
    value={selectedTemplate}
    onChange={(e) =>
      setSelectedTemplate(
        e.target.value
      )
    }
  >
    {templates.map((template) => (
      <option
        key={template.id}
        value={template.id}
      >
        {template.name}
      </option>
    ))}
  </select>
</div>

<div className="mb-3">
  <label className="form-label">
    Resume Title
  </label>

  <input
    className="form-control"
    value={title}
    onChange={(e) =>
      setTitle(e.target.value)
    }
  />
</div>

<div className="mb-3">
  <label className="form-label">
    Candidate Name
  </label>

  <input
    className="form-control"
    value={name}
    onChange={(e) =>
      setName(e.target.value)
    }
  />
</div>

<div className="mb-3">
  <label className="form-label">
    Skills
  </label>

  <textarea
    className="form-control"
    rows="4"
    value={skills}
    onChange={(e) =>
      setSkills(e.target.value)
    }
  />
</div>

<button
  className="btn btn-primary"
  onClick={handleSave}
>
  {isEditMode
    ? "Save Changes"
    : "Create Resume"}
</button>         </div>
        </div>
      ) : (
        <div className="alert alert-info">
          Create New Resume
        </div>
      )}
    </div>
  );
}