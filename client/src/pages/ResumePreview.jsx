import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getResumePreview } from "../api/resumeApi";

export default function ResumePreview() {
  const { id } = useParams();

  const [html, setHtml] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPreview = async () => {
      try {
        const response =
          await getResumePreview(id);

        setHtml(response);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    loadPreview();
  }, [id]);

  if (loading) {
    return (
      <div className="container mt-5">
        <h3>Loading Preview...</h3>
      </div>
    );
  }

  return (
    <div
      dangerouslySetInnerHTML={{
        __html: html,
      }}
    />
  );
}