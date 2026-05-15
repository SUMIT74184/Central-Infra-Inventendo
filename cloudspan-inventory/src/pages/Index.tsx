import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import LandingPage from "@/pages/LandingPage";

const getDefaultRoute = (role?: string) => {
  switch (role) {
    case "super_admin": return "/super-admin";
    case "admin": return "/admin";
    default: return "/dashboard";
  }
};

const Index = () => {
  const { isAuthenticated, user } = useAuth();

  if (isAuthenticated) {
    return <Navigate to={getDefaultRoute(user?.role)} replace />;
  }

  return <LandingPage />;
};

export default Index;
