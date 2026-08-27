import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import {
  ArrowRight,
  Mail,
  Phone,
  MapPin,
  Clock,
  CheckCircle2,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { BrandIcon } from "@/components/brand-logo";

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
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    subject: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Submit Handler -> Stores data into Supabase contact_messages table
  const handleSubmit = async (e: React.FormEvent) => {
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
    <div className="min-h-screen bg-background">
      {/* ---------- HEADER ---------- */}
      <header className="border-b">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
          <Link to="/" className="flex items-center gap-2.5">
            <BrandIcon size={36} className="rounded-md bg-primary p-1.5" />
            <div>
              <p className="font-display text-sm font-bold tracking-tight">CAPACITY CONNECT</p>
              <p className="text-[11px] text-muted-foreground">Capacity Building Commission</p>
            </div>
          </Link>

          <nav className="hidden items-center gap-7 text-sm font-medium text-muted-foreground md:flex">
            <Link to="/" className="hover:text-foreground">Home</Link>
            <Link to="/about" className="hover:text-foreground">About</Link>
            <Link to="/" hash="how-it-works" className="hover:text-foreground">How it works</Link>
            <a href="#" className="border-b-2 border-primary pb-1 text-foreground">Contact</a>
          </nav>

          <div className="flex items-center gap-3">
            <Button asChild variant="outline" size="sm">
              <Link to="/trainee">Login</Link>
            </Button>
            <Button asChild size="sm">
              <Link to="/trainee">
                Enter portal <ArrowRight className="ml-1 size-4" />
              </Link>
            </Button>
          </div>
        </div>
      </header>

      {/* ---------- HERO ---------- */}
      <section className="brand-gradient relative overflow-hidden">
        <div className="pointer-events-none absolute -left-32 -top-32 size-96 rounded-full bg-cyan-400/15 blur-[100px]" />
        <div className="pointer-events-none absolute -right-20 top-0 size-96 rounded-full bg-cyan-400/15 blur-[120px]" />

        <div className="relative mx-auto max-w-4xl px-5 py-20 text-center text-navy-foreground">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-navy-foreground/70">
            Get in touch
          </p>
          <h1 className="mt-4 font-display text-3xl font-bold leading-tight md:text-4xl">
            We're here to help
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-sm text-navy-foreground/80 md:text-base">
            Reach out for onboarding support, technical issues, or general questions about
            Capacity Connect.
          </p>
        </div>
      </section>

      {/* ---------- CONTACT DETAILS + FORM ---------- */}
      <section className="mx-auto max-w-6xl px-5 py-16">
        <div className="grid gap-10 md:grid-cols-[1fr_1.2fr]">
          {/* Contact info cards */}
          <div className="grid gap-5 sm:grid-cols-2 md:grid-cols-1">
            {contactPoints.map((c) => (
              <Card key={c.title}>
                <CardContent className="flex gap-4 p-6">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-md bg-accent/15">
                    <c.icon className="size-5 text-accent" />
                  </div>
                  <div>
                    <h3 className="font-display text-sm font-semibold">{c.title}</h3>
                    <p className="mt-1 text-sm text-foreground">{c.detail}</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">{c.sub}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Contact form */}
          <Card>
            <CardContent className="p-6">
              <h2 className="font-display text-lg font-semibold">Send us a message</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Fill in the form below and our team will get back to you shortly.
              </p>

              {submitted ? (
                <div className="my-8 flex flex-col items-center justify-center text-center space-y-3">
                  <CheckCircle2 className="size-12 text-emerald-500" />
                  <h3 className="font-display text-lg font-bold">Message Sent!</h3>
                  <p className="text-xs text-muted-foreground max-w-xs">
                    Thank you for contacting us. We have received your query and will reply shortly.
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSubmitted(false)}
                    className="mt-4"
                  >
                    Send another message
                  </Button>
                </div>
              ) : (
                <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <Label htmlFor="name" className="text-xs">Full name</Label>
                      <Input
                        id="name"
                        type="text"
                        required
                        value={formData.fullName}
                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                        placeholder="Shivansh Singh"
                        className="mt-1.5"
                      />
                    </div>
                    <div>
                      <Label htmlFor="email" className="text-xs">Email address</Label>
                      <Input
                        id="email"
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="shivansh@example.com"
                        className="mt-1.5"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="subject" className="text-xs">Subject</Label>
                    <Input
                      id="subject"
                      type="text"
                      required
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      placeholder="What is this about?"
                      className="mt-1.5"
                    />
                  </div>

                  <div>
                    <Label htmlFor="message" className="text-xs">Message</Label>
                    <Textarea
                      id="message"
                      rows={5}
                      required
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Tell us how we can help"
                      className="mt-1.5 resize-none"
                    />
                  </div>

                  <Button type="submit" disabled={loading} className="w-full sm:w-auto">
                    {loading ? (
                      <>
                        <Loader2 className="mr-1.5 size-4 animate-spin" /> Sending...
                      </>
                    ) : (
                      <>
                        Send message <ArrowRight className="ml-1.5 size-4" />
                      </>
                    )}
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>
        </div>
      </section>

      <footer className="border-t py-8">
        <p className="text-center text-xs text-muted-foreground">
          Capacity Connect · Demonstration interface with sample data
        </p>
      </footer>
    </div>
  );
}
