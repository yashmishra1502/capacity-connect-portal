import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  Bell,
  Check,
  KeyRound,
  Loader2,
  Lock,
  Save,
  Shield,
  User,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { supabase } from "@/lib/supabaseClient";

export const Route = createFileRoute("/trainee/settings")({
  head: () => ({
    meta: [
      { title: "Settings — Trainee · Capacity Connect" },
      {
        name: "description",
        content: "Manage your account settings, profile, and security preferences.",
      },
    ],
  }),
  component: TraineeSettingsPage,
});

function TraineeSettingsPage() {
  const [loading, setLoading] = useState(true);
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);

  const [userId, setUserId] = useState<string | null>(null);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [emailNotifications, setEmailNotifications] = useState(true);
  const [courseUpdates, setCourseUpdates] = useState(true);

  const [profileMessage, setProfileMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [passwordMessage, setPasswordMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchUserData = async () => {
      try {
        setLoading(true);
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
          if (authError) console.error("Auth error:", authError.message);
          return;
        }

        if (isMounted) {
          setUserId(user.id);
          setEmail(user.email ?? "");

          // 1. Check custom profiles table first
          const { data: profileRow } = await supabase
            .from("profiles")
            .select("full_name, name, avatar_url")
            .eq("id", user.id)
            .maybeSingle();

          // 2. Fall back to user_metadata if table row doesn't exist
          const meta = user.user_metadata || {};
          setFullName(profileRow?.full_name || profileRow?.name || meta.full_name || meta.name || "");
          setAvatarUrl(profileRow?.avatar_url || meta.avatar_url || "");
        }
      } catch (err) {
        console.error("Unexpected error fetching user:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchUserData();
    return () => {
      isMounted = false;
    };
  }, []);

  // Handle Profile Update (Syncs BOTH Auth metadata and DB profiles table)
  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingProfile(true);
    setProfileMessage(null);

    try {
      if (!userId) throw new Error("User session not found.");

      // 1. Update Auth Metadata
      const { error: authError } = await supabase.auth.updateUser({
        data: {
          full_name: fullName,
          name: fullName,
          avatar_url: avatarUrl,
        },
      });

      if (authError) throw authError;

      // 2. Upsert into Supabase Database `profiles` table
      const { error: dbError } = await supabase
        .from("profiles")
        .upsert({
          id: userId,
          full_name: fullName,
          name: fullName,
          avatar_url: avatarUrl,
          updated_at: new Date().toISOString(),
        }, { onConflict: "id" });

      if (dbError) {
        // If table doesn't exist yet, Auth update still succeeded
        console.warn("Database profiles table sync note:", dbError.message);
      }

      setProfileMessage({ type: "success", text: "Profile details updated successfully!" });
    } catch (err: any) {
      setProfileMessage({ type: "error", text: err.message || "Failed to update profile." });
    } finally {
      setSavingProfile(false);
    }
  };

  // Handle Password Update
  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordMessage(null);

    if (newPassword.length < 6) {
      setPasswordMessage({ type: "error", text: "Password must be at least 6 characters long." });
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordMessage({ type: "error", text: "Passwords do not match." });
      return;
    }

    setSavingPassword(true);

    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) {
        setPasswordMessage({ type: "error", text: error.message });
      } else {
        setPasswordMessage({ type: "success", text: "Password changed successfully!" });
        setNewPassword("");
        setConfirmPassword("");
      }
    } catch (err: any) {
      setPasswordMessage({ type: "error", text: err.message || "Failed to update password." });
    } finally {
      setSavingPassword(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-[300px] items-center justify-center gap-2 text-sm text-muted-foreground">
        <Loader2 className="size-5 animate-spin" />
        Loading settings...
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-4xl mx-auto pb-10">
      <header className="space-y-3">
        <Badge variant="secondary" className="rounded-full uppercase tracking-widest">
          Account Preferences
        </Badge>
        <h1 className="font-display text-3xl font-bold md:text-4xl">Settings</h1>
        <p className="max-w-2xl text-muted-foreground">
          Manage your account profile details, change security credentials, and configure notification preferences.
        </p>
      </header>

      <div className="space-y-6">
        {/* Profile Information */}
        <Card className="cc-glow-card border-border/70 bg-card/70 backdrop-blur">
          <CardHeader>
            <div className="flex items-center gap-2">
              <User className="size-5 text-primary" />
              <CardTitle className="text-xl">Profile Details</CardTitle>
            </div>
            <CardDescription>
              Update your basic user details linked to your account.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleUpdateProfile} className="space-y-4">
              {profileMessage && (
                <div
                  className={`p-3 rounded-xl text-xs font-medium border ${
                    profileMessage.type === "success"
                      ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-500"
                      : "border-destructive/30 bg-destructive/10 text-destructive"
                  }`}
                >
                  {profileMessage.text}
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                  id="fullName"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Enter your full name"
                  className="h-11 rounded-xl"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  disabled
                  className="h-11 rounded-xl bg-muted/50 cursor-not-allowed opacity-80"
                />
                <p className="text-[11px] text-muted-foreground">
                  Email address is managed by platform authentication.
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="avatarUrl">Avatar Image URL</Label>
                <Input
                  id="avatarUrl"
                  type="url"
                  value={avatarUrl}
                  onChange={(e) => setAvatarUrl(e.target.value)}
                  placeholder="https://example.com/avatar.jpg"
                  className="h-11 rounded-xl"
                />
              </div>

              <Button
                type="submit"
                disabled={savingProfile}
                className="gap-2 rounded-full"
              >
                {savingProfile ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <Save className="size-4" />
                )}
                Save Changes
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Security & Password */}
        <Card className="cc-glow-card border-border/70 bg-card/70 backdrop-blur">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Shield className="size-5 text-primary" />
              <CardTitle className="text-xl">Security & Password</CardTitle>
            </div>
            <CardDescription>
              Update your password to keep your account safe.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleUpdatePassword} className="space-y-4">
              {passwordMessage && (
                <div
                  className={`p-3 rounded-xl text-xs font-medium border ${
                    passwordMessage.type === "success"
                      ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-500"
                      : "border-destructive/30 bg-destructive/10 text-destructive"
                  }`}
                >
                  {passwordMessage.text}
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="newPassword">New Password</Label>
                <div className="relative">
                  <Input
                    id="newPassword"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new password"
                    className="h-11 rounded-xl pr-10"
                  />
                  <KeyRound className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm new password"
                    className="h-11 rounded-xl pr-10"
                  />
                  <Lock className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                </div>
              </div>

              <Button
                type="submit"
                disabled={savingPassword}
                variant="outline"
                className="gap-2 rounded-full border-border/70"
              >
                {savingPassword ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <Check className="size-4" />
                )}
                Update Password
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Notification Preferences */}
        <Card className="cc-glow-card border-border/70 bg-card/70 backdrop-blur">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Bell className="size-5 text-primary" />
              <CardTitle className="text-xl">Notification Preferences</CardTitle>
            </div>
            <CardDescription>
              Choose how you would like to be notified of updates.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-sm font-medium">Email Notifications</Label>
                <p className="text-xs text-muted-foreground">
                  Receive email updates for important account notifications.
                </p>
              </div>
              <Switch
                checked={emailNotifications}
                onCheckedChange={(val) => setEmailNotifications(Boolean(val))}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-sm font-medium">Course & Assessment Alerts</Label>
                <p className="text-xs text-muted-foreground">
                  Get notified when new course materials or assessment results are published.
                </p>
              </div>
              <Switch
                checked={courseUpdates}
                onCheckedChange={(val) => setCourseUpdates(Boolean(val))}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
