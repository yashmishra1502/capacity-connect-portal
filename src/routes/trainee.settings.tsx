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

/* ---------------- page component ---------------- */

function TraineeSettingsPage() {
  const [loading, setLoading] = useState(true);
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);

  // Profile fields
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");

  // Password fields
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Notification toggles
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [courseUpdates, setCourseUpdates] = useState(true);

  // Messages
  const [profileMessage, setProfileMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [passwordMessage, setPasswordMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        setEmail(user.email ?? "");
        setFullName(user.user_metadata?.full_name ?? user.user_metadata?.name ?? "");
        setAvatarUrl(user.user_metadata?.avatar_url ?? "");
      }
      setLoading(false);
    };

    fetchUserData();
  }, []);

  // Handle Profile Update
  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingProfile(true);
    setProfileMessage(null);

    const { error } = await supabase.auth.updateUser({
      data: {
        full_name: fullName,
        avatar_url: avatarUrl,
      },
    });

    if (error) {
      setProfileMessage({ type: "error", text: error.message });
    } else {
      setProfileMessage({ type: "success", text: "Profile updated successfully!" });
    }
    setSavingProfile(false);
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
    setSavingPassword(false);
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
    <div className="space-y-8 max-w-4xl mx-auto">
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
        {/* 1. Profile Information */}
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
                  className={cn(
                    "p-3 rounded-xl text-xs font-medium border",
                    profileMessage.type === "success"
                      ? "border-success/30 bg-success/10 text-success"
                      : "border-destructive/30 bg-destructive/10 text-destructive"
                  )}
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
                  placeholder="John Doe"
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
                  Email address cannot be changed directly for security reasons.
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

        {/* 2. Security & Password */}
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
                  className={cn(
                    "p-3 rounded-xl text-xs font-medium border",
                    passwordMessage.type === "success"
                      ? "border-success/30 bg-success/10 text-success"
                      : "border-destructive/30 bg-destructive/10 text-destructive"
                  )}
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

        {/* 3. Notifications Configuration */}
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
                onCheckedChange={setEmailNotifications}
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
                onCheckedChange={setCourseUpdates}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
