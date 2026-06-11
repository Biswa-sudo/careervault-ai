import api from "./axios";

export const getResumes = async () => {
  const response = await api.get("/resumes");
  return response.data;
};  

export const getResumePreview = async (
  resumeId
) => {
  const response = await api.get(
    `/resumes/${resumeId}/preview`
  );

  return response.data;
};

export const getResumeById = async (
  resumeId
) => {
  const response = await api.get(
    `/resumes/${resumeId}`
  );

  return response.data;
};

export const updateResume = async (
  resumeId,
  payload
) => {
  const response = await api.patch(
    `/resumes/${resumeId}`,
    payload
  );

  return response.data;
};

export const createResume = async (
  payload
) => {
  const response = await api.post(
    "/resumes",
    payload
  );

  return response.data;
};

export const deleteResume = async (
  resumeId
) => {
  const response = await api.delete(
    `/resumes/${resumeId}`
  );

  return response.data;
};

export const downloadResumePdf = async (
  resumeId
) => {
  const response = await api.get(
    `/resumes/${resumeId}/pdf`,
    {
      responseType: "blob",
    }
  );

  return response.data;
};