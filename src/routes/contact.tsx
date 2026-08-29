import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { supabase } from "@/lib/supabaseClient";
import {
  ArrowRight,
  Mail,
  Phone,
  MapPin,
  Clock,
  CheckCircle2,
  Loader2,
  MessageSquare,
} from "lucide-react";
import "../landing.css";
import { BrandIcon } from "@/components/brand-logo";
import { useScrollReveal } from "@/hooks/use-scroll-reveal";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — Capacity Connect" },
      {
        name: "description",
        content:
          "Get in touch with the Capacity Connect team for support, onboarding or general queries.",
      },
    ],
  }),
  component: Contact,
});

const contactPoints = [
  {
    icon: Mail,
    title: "Email",
    detail: "support@capacityconnect.gov.in",
    sub: "General queries and technical support",
  },
  {
    icon: Phone,
    title: "Phone",
    detail: "1800-XXX-XXXX",
    sub: "Monday to Friday, 9:30 AM – 6:00 PM IST",
  },
  {
    icon: MapPin,
    title: "Office",
    detail: "New Delhi, India",
    sub: "Capacity Building Commission",
  },
  {
    icon: Clock,
    title: "Response time",
    detail: "Within 2 working days",
    sub: "For onboarding and access requests",
  },
];

function Contact() {
  useScrollReveal();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    subject: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.from("contact_messages").insert([
      {
        full_name: formData.fullName,
        email: formData.email,
        subject: formData.subject,
        message: formData.message,
      },
    ]);

    setLoading(false);

    if (error) {
      alert(`Failed to send message: ${error.message}`);
    } else {
      setSubmitted(true);
      setFormData({ fullName: "", email: "", subject: "", message: "" });
    }
  };

  return (
    <div className="ccl">
      {/* ---------- HEADER ---------- */}
      <header>
        <nav>
          <Link to="/" className="brand">
            <BrandIcon size={30} className="rounded-md" />
            <span className="brand-name">
              CAPACITY <span>CONNECT</span>
            </span>
          </Link>

          <div className="nav-links">
            <Link to="/">Home</Link>
            <Link to="/about">About</Link>
            <Link to="/" hash="how-it-works">How it works</Link>
            <a className="active" href="#top">Contact</a>
          </div>

          <div className="nav-cta">
            <Link to="/login" className="btn-ghost">Login</Link>
            <Link to="/login" className="btn btn-primary">
              Enter portal <ArrowRight size={15} />
            </Link>
          </div>
        </nav>
      </header>

      {/* ---------- HERO ---------- */}
      <section className="page-hero" id="top">
        <div className="wrap">
          <div className="eyebrow">
            <MessageSquare size={13} /> Get in touch
          </div>
          <h1 className="cc-hero-in">We're here to help</h1>
          <p className="cc-hero-in cc-delay-1">
            Reach out for onboarding support, technical issues, or general questions about
            Capacity Connect.
          </p>
        </div>
      </section>

      {/* ---------- CONTACT DETAILS + FORM ---------- */}
      <section>
        <div className="wrap">
          <div className="contact-grid">
            {/* Contact info cards */}
            <div className="contact-points">
              {contactPoints.map((c) => (
                <div className="contact-point reveal" data-reveal key={c.title}>
                  <div className="cp-icon">
                    <c.icon size={17} />
                  </div>
                  <div>
                    <h3>{c.title}</h3>
                    <p className="cp-detail">{c.detail}</p>
                    <p className="cp-sub">{c.sub}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Contact form */}
            <div className="contact-form-card reveal" data-reveal>
              <h2>Send us a message</h2>
              <p>Fill in the form below and our team will get back to you shortly.</p>

              {submitted ? (
                <div className="success-panel" style={{ padding: "36px 0 16px" }}>
                  <div className="check">
                    <CheckCircle2 size={28} />
                  </div>
                  <h3 style={{ fontSize: 17, fontWeight: 700 }}>Message sent!</h3>
                  <p style={{ fontSize: 12.5, color: "var(--ink-soft)", maxWidth: 280 }}>
                    Thank you for contacting us. We have received your query and will reply shortly.
                  </p>
                  <button className="btn btn-ghost" style={{ border: "1px solid var(--line)", marginTop: 8 }} onClick={() => setSubmitted(false)}>
                    Send another message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} style={{ marginTop: 22 }}>
                  <div className="field-row">
                    <div className="field" style={{ marginTop: 0 }}>
                      <label htmlFor="name">Full name</label>
                      <input
                        id="name"
                        type="text"
                        required
                        value={formData.fullName}
                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                        placeholder="Shivansh Singh"
                      />
                    </div>
                    <div className="field" style={{ marginTop: 0 }}>
                      <label htmlFor="email">Email address</label>
                      <input
                        id="email"
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="shivansh@example.com"
                      />
                    </div>
                  </div>

                  <div className="field">
                    <label htmlFor="subject">Subject</label>
                    <input
                      id="subject"
                      type="text"
                      required
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      placeholder="What is this about?"
                    />
                  </div>

                  <div className="field">
                    <label htmlFor="message">Message</label>
                    <textarea
                      id="message"
                      rows={5}
                      required
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Tell us how we can help"
                      style={{ resize: "none" }}
                    />
                  </div>

                  <button type="submit" disabled={loading} className="btn btn-primary btn-lg" style={{ marginTop: 20 }}>
                    {loading ? (
                      <Loader2 size={16} className="spin" />
                    ) : (
                      <>
                        Send message <ArrowRight size={16} />
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      <footer>
        <div className="wrap" style={{ textAlign: "center", padding: "20px 0" }}>
          <p style={{ fontSize: 12, color: "var(--muted-label)" }}>
            Capacity Connect · Demonstration interface with sample data
          </p>
        </div>
      </footer>
    </div>
  );
}
