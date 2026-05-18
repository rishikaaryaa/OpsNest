import * as React from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  CheckCircle2,
  Cloud,
  Code2,
  Headphones,
  Layers3,
  LockKeyhole,
  ServerCog,
  Sparkles,
  Workflow,
  type LucideIcon,
} from "lucide-react";
import { apiRequest } from "@/lib/api";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type Service = {
  title: string;
  description: string;
  icon: LucideIcon;
};

const services: Service[] = [
  {
    title: "Assessment and Consulting",
    description:
      "Architecture reviews, infrastructure assessments, and strategy roadmaps aligned to business goals.",
    icon: Workflow,
  },
  {
    title: "Infrastructure Solutions",
    description:
      "Modern data center, storage, and network systems for resilient operations.",
    icon: ServerCog,
  },
  {
    title: "Application Development",
    description:
      "Secure, high-performance applications that keep teams and customers moving.",
    icon: Code2,
  },
  {
    title: "Cyber Security",
    description:
      "Threat-ready security programs that protect critical data and continuity.",
    icon: LockKeyhole,
  },
  {
    title: "Managed Services",
    description:
      "Operational oversight, monitoring, and optimization across your technology stack.",
    icon: Headphones,
  },
  {
    title: "Cloud Infrastructure",
    description:
      "Cloud adoption and modernization services to accelerate innovation safely.",
    icon: Cloud,
  },
];

const highlights = [
  "Infrastructure roadmaps with executive clarity",
  "Security controls built for business continuity",
  "Cloud adoption with compliance in focus",
  "Managed services that keep delivery moving",
];

export default function LandingPage() {
  const [formData, setFormData] = React.useState({
    name: "",
    email: "",
    message: "",
  });
  const [status, setStatus] = React.useState<{
    type: "success" | "error" | "";
    message: string;
  }>({ type: "", message: "" });
  const [isSending, setIsSending] = React.useState(false);

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setStatus({ type: "", message: "" });

    if (
      !formData.name.trim() ||
      !formData.email.trim() ||
      !formData.message.trim()
    ) {
      setStatus({
        type: "error",
        message: "Please complete all fields before submitting.",
      });
      return;
    }

    setIsSending(true);
    try {
      await apiRequest("/contact", {
        method: "POST",
        body: formData,
      });
      setStatus({
        type: "success",
        message: "Thanks! We will be in touch soon.",
      });
      setFormData({ name: "", email: "", message: "" });
    } catch (error) {
      setStatus({
        type: "error",
        message: error instanceof Error ? error.message : "Submission failed",
      });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="min-h-screen overflow-hidden">
      <header className="sticky top-0 z-30 border-b border-white/60 bg-white/55 backdrop-blur-2xl">
        <div className="container-x flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center gap-3 text-foreground">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-fuchsia-600 via-pink-500 to-rose-400 text-sm font-bold text-white shadow-pink-glow">
              T9
            </div>
            <div>
              <p className="text-sm font-semibold">Tech9Labs</p>
              <p className="text-xs text-muted-foreground">
                Enterprise Technology
              </p>
            </div>
          </Link>
          <nav className="hidden items-center gap-6 text-sm font-medium md:flex">
            <a href="#about" className="text-foreground hover:text-primary">
              About
            </a>
            <a href="#services" className="text-foreground hover:text-primary">
              Services
            </a>
            <a href="#contact" className="text-foreground hover:text-primary">
              Contact
            </a>
          </nav>
          <div className="flex items-center gap-3">
            <Link to="/auth" className="secondary-button">
              Sign In
            </Link>
            <Link to="/dashboard" className="primary-button hidden sm:inline-flex">
              Dashboard
              <ArrowRight className="size-4" />
            </Link>
          </div>
        </div>
      </header>

      <section className="px-0 py-10 md:py-14">
        <div className="container-x grid items-center gap-10 lg:grid-cols-[1.02fr_0.98fr]">
          <div className="max-w-3xl">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/70 bg-white/55 px-4 py-2 text-sm font-semibold text-primary shadow-glass-sm backdrop-blur-xl">
              <Sparkles className="size-4" />
              Helping your business grow
            </div>
            <h1 className="text-5xl font-semibold leading-tight md:text-7xl">
              Premium IT operations for{" "}
              <span className="premium-gradient-text">future-ready teams</span>
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-muted-foreground">
              Tech9Labs delivers enterprise infrastructure, cloud, security, and
              digital transformation services for organizations that need
              resilient systems and decisive execution.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link to="/auth" className="primary-button">
                Start with Tech9Labs
                <ArrowRight className="size-4" />
              </Link>
              <a href="#contact" className="secondary-button">
                Talk to Experts
              </a>
            </div>
            <div className="mt-10 grid gap-3 sm:grid-cols-3">
              {[
                ["6+", "Technology verticals"],
                ["24/7", "Operational focus"],
                ["End-to-End", "Delivery model"],
              ].map(([value, label]) => (
                <div key={label} className="glass-tile p-4">
                  <p className="text-2xl font-semibold text-foreground">
                    {value}
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">{label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-panel relative p-4 md:p-5">
            <div className="rounded-lg border border-white/70 bg-white/65 p-4 shadow-glass backdrop-blur-2xl">
              <div className="flex items-center justify-between border-b border-white/60 pb-4">
                <div className="flex items-center gap-3">
                  <div className="flex size-11 items-center justify-center rounded-full bg-gradient-to-br from-fuchsia-600 to-pink-500 text-white">
                    <Layers3 className="size-5" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold">Operations Hub</p>
                    <p className="text-xs text-muted-foreground">
                      Live service overview
                    </p>
                  </div>
                </div>
                <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
                  Stable
                </span>
              </div>

              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                <div className="glass-tile p-4">
                  <p className="text-sm text-muted-foreground">Cloud posture</p>
                  <p className="mt-3 text-3xl font-semibold">92%</p>
                  <div className="mt-4 h-2 rounded-full bg-pink-100">
                    <div className="h-full w-[92%] rounded-full bg-gradient-to-r from-fuchsia-600 to-pink-500" />
                  </div>
                </div>
                <div className="glass-tile p-4">
                  <p className="text-sm text-muted-foreground">Risk controls</p>
                  <p className="mt-3 text-3xl font-semibold">38</p>
                  <div className="mt-4 flex gap-1">
                    {Array.from({ length: 8 }).map((_, index) => (
                      <span
                        key={index}
                        className="h-8 flex-1 rounded-md bg-gradient-to-t from-pink-500/25 to-violet-500/60"
                      />
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-5 space-y-3">
                {highlights.map((item) => (
                  <div
                    key={item}
                    className="flex items-center gap-3 rounded-lg bg-white/55 px-4 py-3 text-sm text-muted-foreground"
                  >
                    <CheckCircle2 className="size-4 shrink-0 text-primary" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="about" className="section">
        <div className="container-x grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <p className="section-kicker">About Us</p>
            <h2 className="section-title mt-3">
              Business value through dependable technology
            </h2>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="card-surface">
              <h3 className="text-lg font-semibold">
                Customer-driven delivery
              </h3>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">
                We define, design, and deliver technology-enabled solutions
                aligned to your operating goals.
              </p>
            </div>
            <div className="card-surface">
              <h3 className="text-lg font-semibold">Deep domain expertise</h3>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">
                Infrastructure, cloud, security, and managed services handled
                with disciplined execution.
              </p>
            </div>
            <div className="card-surface md:col-span-2">
              <h3 className="text-xl font-semibold">
                Resilient infrastructure with measurable outcomes
              </h3>
              <p className="mt-3 max-w-3xl leading-7 text-muted-foreground">
                Our teams help organizations improve efficiency, reduce
                complexity, and ensure continuous availability through
                modernization, automation, and reliable support models.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="services" className="section">
        <div className="container-x">
          <div className="max-w-3xl">
            <p className="section-kicker">Services</p>
            <h2 className="section-title mt-3">
              Technology verticals that keep you ahead
            </h2>
            <p className="mt-4 text-muted-foreground">
              A comprehensive portfolio of consulting and infrastructure
              services designed to unlock new opportunities and outpace
              competitors.
            </p>
          </div>
          <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => {
              const Icon = service.icon;
              return (
                <div key={service.title} className="card-surface group">
                  <div className="mb-5 flex size-11 items-center justify-center rounded-lg bg-gradient-to-br from-fuchsia-600 to-pink-500 text-white shadow-pink-glow transition group-hover:-translate-y-0.5">
                    <Icon className="size-5" />
                  </div>
                  <h3 className="text-lg font-semibold">{service.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-muted-foreground">
                    {service.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section id="contact" className="section">
        <div className="container-x grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="card-surface">
            <p className="section-kicker">Contact Us</p>
            <h2 className="section-title mt-3">Talk to our experts</h2>
            <p className="mt-4 text-muted-foreground">
              Share your goals and our consultants will reach out with tailored
              recommendations.
            </p>
            <form className="mt-7 grid gap-4" onSubmit={handleSubmit}>
              <Input
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Your name"
              />
              <Input
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Work email"
                type="email"
              />
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Tell us about your goals"
                rows={4}
                className="min-h-[132px] w-full rounded-lg border border-white/70 bg-white/55 px-4 py-3 text-sm shadow-glass-sm backdrop-blur-xl placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              />
              {status.message && (
                <p
                  className={
                    status.type === "success"
                      ? "text-sm text-emerald-600"
                      : "text-sm text-red-600"
                  }
                >
                  {status.message}
                </p>
              )}
              <Button type="submit" disabled={isSending}>
                {isSending ? "Sending..." : "Submit"}
                <ArrowRight className="size-4" />
              </Button>
            </form>
          </div>
          <div className="grid gap-4">
            {[
              [
                "Headquarters",
                "423 DLF Prime Towers, Okhla Industrial Area, New Delhi - 110020",
              ],
              ["Singapore Office", "Hong Lim Complex, Upper Cross Street, Singapore 051531"],
              [
                "Reach us",
                "Phone: +91 9355504757 | Email: marketing@tech9labs.com",
              ],
            ].map(([title, detail]) => (
              <div key={title} className="card-surface">
                <h3 className="text-lg font-semibold">{title}</h3>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">
                  {detail}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="border-t border-white/60 bg-white/35 py-9 backdrop-blur-xl">
        <div className="container-x flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-semibold">Tech9Labs</p>
            <p className="text-xs text-muted-foreground">
              Modernizing enterprise infrastructure with Tech9Labs.
            </p>
          </div>
          <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
            <a href="#about">About</a>
            <a href="#services">Services</a>
            <a href="#contact">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
