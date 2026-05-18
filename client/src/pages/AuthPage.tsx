import * as React from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, CheckCircle2, LockKeyhole, Sparkles } from "lucide-react";
import { apiRequest } from "@/lib/api";
import { setToken } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function AuthPage() {
  const [mode, setMode] = React.useState<"login" | "signup">("login");
  const [formData, setFormData] = React.useState({
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const navigate = useNavigate();

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");

    if (!formData.email.trim() || !formData.password.trim()) {
      setError("Email and password are required.");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    if (mode === "signup" && formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setIsLoading(true);

    try {
      const endpoint = mode === "signup" ? "/auth/register" : "/auth/login";
      const data = await apiRequest(
        endpoint,
        {
          method: "POST",
          body: {
            email: formData.email.trim().toLowerCase(),
            password: formData.password,
          },
        },
        false,
      );

      if (data?.token) {
        setToken(data.token);
        navigate("/dashboard");
      } else {
        setError("Authentication failed. Try again.");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Authentication failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen overflow-hidden">
      <div className="container-x flex min-h-screen flex-col justify-center gap-10 py-12 lg:grid lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
        <div className="max-w-xl">
          <Link
            to="/"
            className="mb-9 inline-flex items-center gap-3 text-foreground"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-fuchsia-600 via-pink-500 to-rose-400 text-sm font-bold text-white shadow-pink-glow">
              T9
            </div>
            <div>
              <p className="text-sm font-semibold">Tech9Labs</p>
              <p className="text-xs text-muted-foreground">
                Enterprise Technology
              </p>
            </div>
          </Link>

          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/70 bg-white/55 px-4 py-2 text-sm font-semibold text-primary shadow-glass-sm backdrop-blur-xl">
            <Sparkles className="size-4" />
            Tech9Labs Platform
          </div>
          <h1 className="section-title">
            {mode === "login" ? "Welcome back" : "Create your account"}
          </h1>
          <p className="mt-4 max-w-lg text-muted-foreground">
            Access your workspace to track operational entries, review
            submissions, and keep service activity moving.
          </p>

          <div className="mt-8 grid gap-3">
            {[
              "Fast access to work items and account activity",
              "Search across entries and contact submissions",
              "A focused dashboard for service operations",
            ].map((item) => (
              <div
                key={item}
                className="flex items-center gap-3 text-sm text-muted-foreground"
              >
                <CheckCircle2 className="size-4 shrink-0 text-primary" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-panel w-full max-w-xl justify-self-end p-4 md:p-5">
          <div className="rounded-lg border border-white/70 bg-white/65 p-6 shadow-glass backdrop-blur-2xl">
            <div className="mb-6 flex items-center justify-between gap-4">
              <div>
                <p className="text-sm text-muted-foreground">
                  {mode === "login" ? "Secure sign in" : "New workspace"}
                </p>
                <h2 className="mt-1 text-2xl font-semibold">
                  {mode === "login" ? "Enter your dashboard" : "Join Tech9Labs"}
                </h2>
              </div>
              <div className="flex size-12 items-center justify-center rounded-full bg-gradient-to-br from-fuchsia-600 to-pink-500 text-white shadow-pink-glow">
                <LockKeyhole className="size-5" />
              </div>
            </div>

            <form className="grid gap-4" onSubmit={handleSubmit}>
              <Input
                name="email"
                type="email"
                placeholder="Email address"
                value={formData.email}
                onChange={handleChange}
              />
              <Input
                name="password"
                type="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
              />
              {mode === "signup" && (
                <Input
                  name="confirmPassword"
                  type="password"
                  placeholder="Confirm password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                />
              )}
              {error && <p className="text-sm text-red-600">{error}</p>}
              <Button type="submit" disabled={isLoading}>
                {isLoading
                  ? "Please wait..."
                  : mode === "login"
                    ? "Sign in"
                    : "Create account"}
                <ArrowRight className="size-4" />
              </Button>
            </form>

            <div className="mt-5 flex flex-wrap items-center justify-between gap-3 text-sm text-muted-foreground">
              <button
                type="button"
                onClick={() => setMode(mode === "login" ? "signup" : "login")}
                className="font-semibold text-primary"
              >
                {mode === "login"
                  ? "Need an account?"
                  : "Already have an account?"}
              </button>
              <Link to="/" className="font-semibold text-primary">
                Back to home
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
