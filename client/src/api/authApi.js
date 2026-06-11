import api from "./axios";

export const loginUser = async (phoneNumber, password) => {
  const response = await api.post("/auth/login", {
    phoneNumber,
    password,
  });

  return response.data;
};

export const signupUser = async (payload) => {
  const response = await api.post("/auth/signup", payload);

  return response.data;
};