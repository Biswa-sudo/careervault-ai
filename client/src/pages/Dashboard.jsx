import { useAuth } from "../context/AuthContext";

export default function Dashboard() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="container mt-5">
      <h1>Dashboard</h1>

      <p>
        Auth Status:
        {isAuthenticated ? " Logged In" : " Logged Out"}
      </p>
    </div>
  );
}