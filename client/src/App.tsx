import { Navigate, Route, Routes, Link } from "react-router-dom";
import LandingPage from "@/pages/LandingPage";
import AuthPage from "@/pages/AuthPage";
import DashboardPage from "@/pages/DashboardPage";
import { getToken } from "@/lib/auth";

function RequireAuth({ children }: { children: JSX.Element }) {
  const token = getToken();
  if (!token) {
    return <Navigate to="/auth" replace />;
  }
  return children;
}

function NotFound() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="container-x flex min-h-screen flex-col items-center justify-center gap-4 text-center">
        <p className="section-kicker">Tech9Labs</p>
        <h1 className="section-title premium-gradient-text">Page not found</h1>
        <p className="max-w-lg text-muted-foreground">
          The page you are looking for does not exist. Head back to the landing
          page to explore Tech9Labs.
        </p>
        <Link to="/" className="primary-button">
          Back to Home
        </Link>
      </div>
    </div>
  );
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/auth" element={<AuthPage />} />
      <Route
        path="/dashboard"
        element={
          <RequireAuth>
            <DashboardPage />
          </RequireAuth>
        }
      />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
