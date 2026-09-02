import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Award, BookOpen, Building2, Check, Mail, Pencil, ShieldCheck, Upload, X } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/lib/supabaseClient";

export const Route = createFileRoute("/trainer/profile")({
  head: () => ({
    meta: [
      { title: "My Profile — Trainer · Capacity Connect" },
      {
        name: "description",
        content: "Trainer profile with specialization details, assigned courses, and professional credentials.",
      },
    ],
  }),
  component: TrainerProfile,
});

interface TrainerProfileData {
  id: string;
  name: string;
  email: string;
  role: string;
  dept: string | null;
  specialization?: string | null;
  bio?: string | null;
  status: string;
  joined_date: string;
  avatar_url?: string | null;
}

interface AssignedCourseRow {
  id: string;
  code: string;
  title: string;
  category: string;
}

function TrainerProfile() {
  const [profile, setProfile] = useState<TrainerProfileData | null>(null);
  const [assignedCourses, setAssignedCourses] = useState<AssignedCourseRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Edit state
  const [editing, setEditing] = useState(false);
  const [editName, setEditName] = useState("");
  const [editDept, setEditDept] = useState("");
  const [editSpecialization, setEditSpecialization] = useState("");
  const [editBio, setEditBio] = useState("");
  const [editAvatarUrl, setEditAvatarUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
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

      // 1. Fetch Trainer Profile
      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("id, name, email, role, dept, specialization, bio, status, joined_date, avatar_url")
        .eq("id", user.id)
        .maybeSingle();

      if (profileError || !profileData) {
        setError(profileError?.message ?? "Could not load trainer profile.");
        setLoading(false);
        return;
      }

      setProfile(profileData);
      setEditName(profileData.name);
      setEditDept(profileData.dept ?? "");
      setEditSpecialization(profileData.specialization ?? "");
      setEditBio(profileData.bio ?? "");
      setEditAvatarUrl(profileData.avatar_url ?? null);

      // 2. Fetch Courses Assigned to this Trainer
      const { data: courseData, error: courseError } = await supabase
        .from("courses")
        .select("id, code, title, category")
        .eq("trainer_id", user.id)
        .order("code");

      if (!courseError) {
        setAssignedCourses(courseData ?? []);
      }

      setLoading(false);
    };

    load();
  }, []);

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);
      setError(null);

      if (!event.target.files || event.target.files.length === 0) {
        return;
      }

      const file = event.target.files[0];
      if (!file) return;
      const fileExt = file.name.split(".").pop();
      const filePath = `trainer-${profile?.id}-${Math.random()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      const { data } = supabase.storage.from("avatars").getPublicUrl(filePath);
      setEditAvatarUrl(data.publicUrl);
    } catch (err: any) {
      setError(err.message ?? "Error uploading avatar. Ensure 'avatars' storage bucket exists.");
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    if (!profile || !editName.trim()) return;
    setSaving(true);
    setError(null);

    const updatedFields = {
      name: editName.trim(),
      dept: editDept.trim() || null,
      specialization: editSpecialization.trim() || null,
      bio: editBio.trim() || null,
      avatar_url: editAvatarUrl,
    };

    // 1. Update profiles table in database
    const { data, error: updateError } = await supabase
      .from("profiles")
      .update(updatedFields)
      .eq("id", profile.id)
      .select("id, name, email, role, dept, specialization, bio, status, joined_date, avatar_url")
      .maybeSingle();

    if (updateError) {
      setError(updateError.message);
      setSaving(false);
      return;
    }

    // 2. Sync changes with Supabase Auth metadata for app-wide persistence
    await supabase.auth.updateUser({
      data: {
        name: editName.trim(),
        avatar_url: editAvatarUrl,
        dept: editDept.trim() || null,
      },
    });

    setSaving(false);

    if (data) {
      setProfile(data);
    } else {
      setProfile((prev) => (prev ? { ...prev, ...updatedFields } : prev));
    }

    setEditing(false);
  };

  const handleCancelEdit = () => {
    if (profile) {
      setEditName(profile.name);
      setEditDept(profile.dept ?? "");
      setEditSpecialization(profile.specialization ?? "");
      setEditBio(profile.bio ?? "");
      setEditAvatarUrl(profile.avatar_url ?? null);
    }
    setEditing(false);
  };

  if (loading) {
    return <p className="text-sm text-muted-foreground">Loading trainer profile…</p>;
  }

  if (!profile) {
    return <p className="text-sm text-destructive">{error ?? "Profile not found."}</p>;
  }

  const currentAvatar = editing ? editAvatarUrl : profile.avatar_url;

  return (
    <div className="space-y-6">
      {/* Profile Header Card */}
      <Card className="cc-glow-card overflow-hidden border-border/70 bg-card/70 backdrop-blur">
        <CardContent className="flex flex-col gap-6 p-6 md:flex-row md:items-center">
          
          {/* Avatar Container */}
          <div className="relative group">
            <div className="flex size-20 overflow-hidden items-center justify-center rounded-2xl bg-primary/15 font-display text-2xl font-bold text-primary border border-border/60">
              {currentAvatar ? (
                <img src={currentAvatar} alt={profile.name} className="h-full w-full object-cover" />
              ) : (
                profile.name
                  .split(" ")
                  .map((part) => part[0])
                  .join("")
                  .slice(0, 2)
              )}
            </div>

            {/* Avatar upload overlay when editing */}
            {editing && (
              <label
                htmlFor="avatar-upload"
                className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 rounded-2xl cursor-pointer text-white opacity-90 transition-opacity hover:opacity-100"
              >
                <Upload className="size-5 mb-0.5" />
                <span className="text-[10px] font-medium">{uploading ? "..." : "Upload"}</span>
                <input
                  id="avatar-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarUpload}
                  disabled={uploading}
                  className="hidden"
                />
              </label>
            )}
          </div>

          <div className="flex-1 space-y-1.5">
            <Badge variant="secondary" className="rounded-full uppercase tracking-widest">
              Trainer Portal
            </Badge>

            {editing ? (
              <div className="space-y-2 pt-1 max-w-sm">
                <input
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  placeholder="Full name"
                  className="w-full rounded-xl border border-border/70 bg-background/50 p-2.5 text-sm outline-none transition-colors focus:border-primary/60 focus:ring-2 focus:ring-primary/15"
                />
                <input
                  value={editDept}
                  onChange={(e) => setEditDept(e.target.value)}
                  placeholder="Department / Wing"
                  className="w-full rounded-xl border border-border/70 bg-background/50 p-2.5 text-sm outline-none transition-colors focus:border-primary/60 focus:ring-2 focus:ring-primary/15"
                />
                <input
                  value={editSpecialization}
                  onChange={(e) => setEditSpecialization(e.target.value)}
                  placeholder="Area of Specialization (e.g. Public Policy, Digital Governance)"
                  className="w-full rounded-xl border border-border/70 bg-background/50 p-2.5 text-sm outline-none transition-colors focus:border-primary/60 focus:ring-2 focus:ring-primary/15"
                />
              </div>
            ) : (
              <>
                <h1 className="font-display text-2xl font-bold md:text-3xl">{profile.name}</h1>
                <p className="text-sm text-muted-foreground">
                  {profile.role ? profile.role.charAt(0).toUpperCase() + profile.role.slice(1) : "Trainer"}
                  {profile.dept ? ` · ${profile.dept}` : ""}
                  {profile.specialization ? ` (${profile.specialization})` : ""}
                </p>
              </>
            )}

            <div className="flex flex-wrap gap-4 pt-1 text-xs text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <Mail className="size-3.5" /> {profile.email}
              </span>
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="size-3.5" /> Trainer ID {profile.id.slice(0, 8)}
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
                disabled={saving || uploading || !editName.trim()}
                className="cc-btn-glass gap-2 rounded-full"
              >
                <Check className="size-4" /> {saving ? "Saving…" : "Save"}
              </Button>
              <Button variant="outline" onClick={handleCancelEdit} disabled={saving || uploading} className="gap-2 rounded-full">
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

      {/* Bio & Details Section */}
      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="cc-glow-card border-border/70 bg-card/70 backdrop-blur lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-base">Trainer Bio & Credentials</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            {editing ? (
              <div className="space-y-1">
                <label className="text-xs font-semibold text-muted-foreground">Professional Bio</label>
                <textarea
                  value={editBio}
                  onChange={(e) => setEditBio(e.target.value)}
                  rows={4}
                  placeholder="Share a brief overview of your background, experience, and training philosophy..."
                  className="w-full rounded-xl border border-border/70 bg-background/50 p-2.5 text-sm outline-none transition-colors focus:border-primary/60 focus:ring-2 focus:ring-primary/15"
                />
              </div>
            ) : (
              <p className="text-muted-foreground leading-relaxed">
                {profile.bio || "No professional biography added yet. Click 'Edit Profile' to add your background and qualifications."}
              </p>
            )}
          </CardContent>
        </Card>

        {/* Assigned Courses Overview */}
        <Card className="cc-glow-card border-border/70 bg-card/70 backdrop-blur lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base">Assigned Courses ({assignedCourses.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {assignedCourses.length === 0 ? (
              <p className="text-xs text-muted-foreground">
                No courses are currently assigned to you. Contact administration to map courses to your profile.
              </p>
            ) : (
              <div className="grid gap-3 md:grid-cols-2">
                {assignedCourses.map((course) => (
                  <div key={course.id} className="cc-glow-card rounded-xl border border-border/70 p-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <Badge variant="secondary" className="rounded-full uppercase tracking-wider text-[10px]">
                        {course.code}
                      </Badge>
                      <span className="text-xs text-muted-foreground">{course.category}</span>
                    </div>
                    <p className="font-display text-sm font-semibold">{course.title}</p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
