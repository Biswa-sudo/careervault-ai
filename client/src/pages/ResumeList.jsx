import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  getResumes,
  getResumePreview,
  deleteResume,
  downloadResumePdf,
} from "../api/resumeApi";
import { useNavigate } from "react-router-dom";

export default function ResumeList() {
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadResumes = async () => {
      try {
        const response = await getResumes();
        setResumes(response.data || []);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    loadResumes();
  }, []);

  if (loading) {
    return (
      <div className="container mt-5">
        <h3>Loading resumes...</h3>
      </div>
    );
  }

  const handlePreview = async (resumeId) => {
  try {
    const response = await getResumePreview(
      resumeId
    );

    console.log(response);

    alert(
      "Preview API working. Check console."
    );
  } catch (error) {
    console.error(error);
    alert("Preview failed");
  }
};

const handleDelete = async (
  resumeId
) => {
  const confirmed = window.confirm(
    "Are you sure you want to delete this resume?"
  );

  if (!confirmed) {
    return;
  }

  try {
    await deleteResume(resumeId);

    setResumes((prev) =>
      prev.filter(
        (resume) =>
          resume.id !== resumeId
      )
    );

    alert("Resume deleted!");
  } catch (error) {
    console.error(error);
    alert("Delete failed");
  }
};

const handleDownloadPdf = async (
  resumeId,
  title
) => {
  try {
    const pdfBlob =
      await downloadResumePdf(
        resumeId
      );

    const url =
      window.URL.createObjectURL(
        pdfBlob
      );

    const link =
      document.createElement("a");

    link.href = url;

    link.download =
      `${title}.pdf`;

    document.body.appendChild(
      link
    );

    link.click();

    link.remove();

    window.URL.revokeObjectURL(
      url
    );
  } catch (error) {
    console.error(error);
    alert(
      "PDF download failed"
    );
  }
};

  return (
    <div className="container mt-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1>My Resumes</h1>
         <p className="text-muted">
  Resumes Used: {resumes.length} / 5
</p>
        </div>

       {resumes.length >= 5 ? (
  <button
    className="btn btn-secondary"
    disabled
  >
    Resume Limit Reached
  </button>
) : (
  <Link
    to="/resumes/new"
    className="btn btn-primary"
  >
    Create Resume
  </Link>
)}
      </div>

      {resumes.length === 0 ? (
        <div className="alert alert-info">
          No resumes found.
        </div>
      ) : (
        <div className="row">
          {resumes.map((resume) => (
            <div
              key={resume.id}
              className="col-md-6 mb-4"
            >
              <div className="card h-100">
                <div className="card-body">
                  <h5>{resume.title}</h5>

                  <p className="mb-1">
                    <strong>Name:</strong>{" "}
                    {resume.resumeData?.name || "N/A"}
                  </p>

                  <p className="mb-1">
                    <strong>Template:</strong>{" "}
                    {resume.templateId}
                  </p>

                  <p className="mb-3">
                    <strong>Updated:</strong>{" "}
                    {new Date(
                      resume.updatedAt
                    ).toLocaleDateString()}
                  </p>

                  <div className="d-flex gap-2">
              <button
  className="btn btn-outline-primary btn-sm"
  onClick={() =>
    navigate(
      `/resumes/${resume.id}/preview`
    )
  }
>
  Preview
</button>

                   <button
  className="btn btn-outline-secondary btn-sm"
  onClick={() =>
    navigate(`/resumes/${resume.id}`)
  }
>
  Edit
</button>
<button
  className="btn btn-outline-danger btn-sm"
  onClick={() =>
    handleDelete(resume.id)
  }
>
  Delete
</button>
<button
  className="btn btn-success btn-sm"
  onClick={() =>
    handleDownloadPdf(
      resume.id,
      resume.title
    )
  }
>
  PDF
</button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}