import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Award, Building2, Check, Mail, Medal, Pencil, ShieldCheck, X } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { supabase } from "@/lib/supabaseClient";

export const Route = createFileRoute("/trainee/profile")({
  head: () => ({
    meta: [
      { title: "My Profile — Trainee · Capacity Connect" },
      {
        name: "description",
        content: "Trainee profile with department details, competency levels, certificates and achievements.",
      },
      { property: "og:title", content: "Trainee Profile — Capacity Connect" },
      {
        property: "og:description",
        content: "Officer credentials, competency levels and verified certificates in one view.",
      },
    ],
  }),
  component: TraineeProfile,
});

interface Profile {
  id: string;
  name: string;
  email: string;
  role: string;
  dept: string | null;
  status: string;
  joined_date: string;
}

interface Achievement {
  id: string;
  title: string;
  earned: boolean;
  points: number;
}

interface CompetencyRow {
  category: string;
  value: number; // 0-100
}

interface CertificateRow {
  id: string;
  course_id: string;
  grade: string | null;
  issued_date: string;
}

function TraineeProfile() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [competency, setCompetency] = useState<CompetencyRow[]>([]);
  const [certificates, setCertificates] = useState<CertificateRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Edit state
  const [editing, setEditing] = useState(false);
  const [editName, setEditName] = useState("");
  const [editDept, setEditDept] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setError("Not signed in.");
        setLoading(false);
        return;
      }

      // Profile
      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("id, name, email, role, dept, status, joined_date")
        .eq("id", user.id)
        .single();

      if (profileError || !profileData) {
        setError(profileError?.message ?? "Could not load profile.");
        setLoading(false);
        return;
      }
      setProfile(profileData);
      setEditName(profileData.name);
      setEditDept(profileData.dept ?? "");

      // Achievements
      const { data: achievementData } = await supabase
        .from("achievements")
        .select("id, title, earned, points")
        .eq("trainee_id", user.id)
        .order("points", { ascending: false });
      setAchievements(achievementData ?? []);

      // Certificates — intentionally left to populate later
      const { data: certData } = await supabase
        .from("certificates")
        .select("id, course_id, grade, issued_date")
        .eq("trainee_id", user.id);
      setCertificates(certData ?? []);

      // Competency: enrollments -> courses (category) -> course_modules (done)
      const { data: enrollments } = await supabase
        .from("enrollments")
        .select("course_id")
        .eq("trainee_id", user.id);

      const courseIds = [...new Set((enrollments ?? []).map((e) => e.course_id).filter(Boolean))];

      if (courseIds.length > 0) {
        const { data: courseData } = await supabase
          .from("courses")
          .select("id, category")
          .in("id", courseIds);

        const { data: moduleData } = await supabase
          .from("course_modules")
          .select("course_id, done")
          .in("course_id", courseIds);

        const categoryTotals: Record<string, { total: number; done: number }> = {};
        for (const course of courseData ?? []) {
          const category = course.category ?? "General";
          if (!categoryTotals[category]) categoryTotals[category] = { total: 0, done: 0 };
        }
        for (const mod of moduleData ?? []) {
          const course = courseData?.find((c) => c.id === mod.course_id);
          const category = course?.category ?? "General";
          if (!categoryTotals[category]) categoryTotals[category] = { total: 0, done: 0 };
          categoryTotals[category].total += 1;
          if (mod.done) categoryTotals[category].done += 1;
        }

        const rows: CompetencyRow[] = Object.entries(categoryTotals).map(([category, { total, done }]) => ({
          category,
          value: total > 0 ? Math.round((done / total) * 100) : 0,
        }));
        setCompetency(rows);
      } else {
        setCompetency([]);
      }

      setLoading(false);
    };

    load();
  }, []);

  const handleSave = async () => {
    if (!profile || !editName.trim()) return;
    setSaving(true);
    setError(null);

    const { data, error: updateError } = await supabase
      .from("profiles")
      .update({ name: editName.trim(), dept: editDept.trim() || null })
      .eq("id", profile.id)
      .select("id, name, email, role, dept, status, joined_date")
      .single();

    setSaving(false);

    if (updateError) {
      setError(updateError.message);
      return;
    }

    if (data) setProfile(data);
    setEditing(false);
  };

  const handleCancelEdit = () => {
    if (profile) {
      setEditName(profile.name);
      setEditDept(profile.dept ?? "");
    }
    setEditing(false);
  };

  if (loading) {
    return <p className="text-sm text-muted-foreground">Loading profile…</p>;
  }

  if (!profile) {
    return <p className="text-sm text-destructive">{error ?? "Profile not found."}</p>;
  }

  return (
    <div className="space-y-6">
      <Card className="cc-glow-card overflow-hidden border-border/70 bg-card/70 backdrop-blur">
        <CardContent className="flex flex-col gap-6 p-6 md:flex-row md:items-center">
          <div className="flex size-20 items-center justify-center rounded-2xl bg-primary/15 font-display text-2xl font-bold text-primary">
            {profile.name
              .split(" ")
              .map((part) => part[0])
              .join("")
              .slice(0, 2)}
          </div>

          <div className="flex-1 space-y-1.5">
            <Badge variant="secondary" className="rounded-full uppercase tracking-widest">
              Trainee Portal
            </Badge>

            {editing ? (
              <div className="space-y-2 pt-1">
                <input
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  placeholder="Full name"
                  className="w-full max-w-sm rounded-xl border border-border/70 bg-background/50 p-2.5 text-sm outline-none transition-colors focus:border-primary/60 focus:ring-2 focus:ring-primary/15"
                />
                <input
                  value={editDept}
                  onChange={(e) => setEditDept(e.target.value)}
                  placeholder="Department"
                  className="w-full max-w-sm rounded-xl border border-border/70 bg-background/50 p-2.5 text-sm outline-none transition-colors focus:border-primary/60 focus:ring-2 focus:ring-primary/15"
                />
              </div>
            ) : (
              <>
                <h1 className="font-display text-2xl font-bold md:text-3xl">{profile.name}</h1>
                <p className="text-sm text-muted-foreground">
                  {profile.role.charAt(0).toUpperCase() + profile.role.slice(1)}
                  {profile.dept ? ` · ${profile.dept}` : ""}
                </p>
              </>
            )}

            <div className="flex flex-wrap gap-4 pt-1 text-xs text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <Mail className="size-3.5" /> {profile.email}
              </span>
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="size-3.5" /> ID {profile.id.slice(0, 8)}
              </span>
              <span className="flex items-center gap-1.5">
                <Building2 className="size-3.5" /> Government of India
              </span>
            </div>

            {error && <p className="pt-1 text-xs text-destructive">{error}</p>}
          </div>

          {editing ? (
            <div className="flex gap-2">
              <Button
                onClick={handleSave}
                disabled={saving || !editName.trim()}
                className="cc-btn-glass gap-2 rounded-full"
              >
                <Check className="size-4" /> {saving ? "Saving…" : "Save"}
              </Button>
              <Button variant="outline" onClick={handleCancelEdit} disabled={saving} className="gap-2 rounded-full">
                <X className="size-4" /> Cancel
              </Button>
            </div>
          ) : (
            <Button onClick={() => setEditing(true)} className="cc-btn-glass gap-2 rounded-full">
              <Pencil className="size-4" /> Edit Profile
            </Button>
          )}
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="cc-glow-card border-border/70 bg-card/70 backdrop-blur lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">Competency Levels</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {competency.length === 0 && (
              <p className="text-xs text-muted-foreground">
                No competency data yet — enroll in a course to start tracking progress.
              </p>
            )}
            {competency.map((skill) => (
              <div key={skill.category} className="space-y-1.5">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">{skill.category}</span>
                  <span className="text-muted-foreground">{skill.value}%</span>
                </div>
                <Progress value={skill.value} className="h-2" />
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="cc-glow-card border-border/70 bg-card/70 backdrop-blur">
          <CardHeader>
            <CardTitle className="text-base">Achievements</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {achievements.length === 0 && (
              <p className="text-xs text-muted-foreground">No achievements earned yet.</p>
            )}
            {achievements.slice(0, 5).map((achievement) => (
              <div key={achievement.id} className="flex items-start gap-3">
                <Medal
                  className={achievement.earned ? "mt-0.5 size-4 text-warning" : "mt-0.5 size-4 text-muted-foreground/50"}
                />
                <div className="min-w-0">
                  <p className="text-sm font-semibold">{achievement.title}</p>
                  <p className="text-xs text-muted-foreground">{achievement.points} pts</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card className="cc-glow-card border-border/70 bg-card/70 backdrop-blur">
        <CardHeader>
          <CardTitle className="text-base">Verified Certificates</CardTitle>
        </CardHeader>
        <CardContent>
          {certificates.length === 0 ? (
            <p className="text-xs text-muted-foreground">
              No certificates issued yet. They'll appear here once a course is completed and verified.
            </p>
          ) : (
            <div className="grid gap-4 md:grid-cols-3">
              {certificates.map((certificate) => (
                <div key={certificate.id} className="cc-glow-card rounded-xl border border-border/70 p-4">
                  <Award className="size-5 text-primary" />
                  <p className="mt-1 text-xs text-muted-foreground">
                    Issued {new Date(certificate.issued_date).toLocaleDateString("en-IN", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </p>
                  {certificate.grade && (
                    <Badge variant="secondary" className="mt-3 rounded-full">
                      Grade {certificate.grade}
                    </Badge>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
