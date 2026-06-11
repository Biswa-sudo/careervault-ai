import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "../pages/Login";
import Signup from "../pages/Signup";
import Dashboard from "../pages/Dashboard";
import ResumeList from "../pages/ResumeList";
import ResumeEditor from "../pages/ResumeEditor";
import ProtectedRoute from "./ProtectedRoute";
import ResumePreview from "../pages/ResumePreview";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
<Route path="/login" element={<Login />} />
<Route path="/signup" element={<Signup />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/resumes"
          element={
            <ProtectedRoute>
              <ResumeList />
            </ProtectedRoute>
          }
        />
        <Route
  path="/resumes/:id/preview"
  element={
    <ProtectedRoute>
      <ResumePreview />
    </ProtectedRoute>
  }
/>
<Route
  path="/resumes/:id"
  element={
    <ProtectedRoute>
      <ResumeEditor />
    </ProtectedRoute>
  }
/>
        <Route
          path="/resumes/new"
          element={
            <ProtectedRoute>
              <ResumeEditor />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}   