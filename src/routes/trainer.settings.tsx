import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Bell, Lock, Moon, Shield, Check, Loader2, Mail } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/lib/supabaseClient";

export const Route = createFileRoute("/trainer/settings")({
  head: () => ({
    meta: [
      { title: "Settings — Trainer Portal · Capacity Connect" },
      {
        name: "description",
        content: "Manage your trainer account settings, notification preferences, and security options.",
      },
    ],
  }),
  component: TrainerSettingsPage,
});

function TrainerSettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Settings states
  const [emailNotifs, setEmailNotifs] = useState(true);
  const [smsNotifs, setSmsNotifs] = useState(false);
  const [courseAlerts, setCourseAlerts] = useState(true);

  // Password states
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    // Load existing settings if stored in user metadata or profiles table
    const loadSettings = async () => {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (user?.user_metadata) {
        setEmailNotifs(user.user_metadata.email_notifs ?? true);
        setSmsNotifs(user.user_metadata.sms_notifs ?? false);
        setCourseAlerts(user.user_metadata.course_alerts ?? true);
      }
      setLoading(false);
    };

    loadSettings();
  }, []);

  const handleSavePreferences = async () => {
    setSaving(true);
    setMessage(null);

    const { error } = await supabase.auth.updateUser({
      data: {
        email_notifs: emailNotifs,
        sms_notifs: smsNotifs,
        course_alerts: courseAlerts,
      },
    });

    setSaving(false);

    if (error) {
      setMessage({ type: "error", text: error.message });
    } else {
      setMessage({ type: "success", text: "Preferences updated successfully." });
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordMessage(null);

    if (!newPassword || newPassword.length < 6) {
      setPasswordMessage({ type: "error", text: "New password must be at least 6 characters long." });
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordMessage({ type: "error", text: "New passwords do not match." });
      return;
    }

    setPasswordLoading(true);

    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    setPasswordLoading(false);

    if (error) {
      setPasswordMessage({ type: "error", text: error.message });
    } else {
      setPasswordMessage({ type: "success", text: "Password updated successfully." });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    }
  };

  if (loading) {
    return (
      <div className="flex h-[200px] items-center justify-center gap-2 text-sm text-muted-foreground">
        <Loader2 className="size-4 animate-spin" />
        Loading settings...
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <header className="space-y-1">
        <Badge variant="secondary" className="rounded-full uppercase tracking-widest">
          Trainer Portal
        </Badge>
        <h1 className="font-display text-3xl font-bold md:text-4xl">Account Settings</h1>
        <p className="text-muted-foreground">
          Manage your notification preferences, security configuration, and workspace preferences.
        </p>
      </header>

      {/* Notification Preferences */}
      <Card className="cc-glow-card border-border/70 bg-card/70 backdrop-blur">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Bell className="size-5 text-primary" />
            <CardTitle className="text-lg">Notification Preferences</CardTitle>
          </div>
          <CardDescription>Choose how you want to receive alerts regarding course updates and submissions.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <label className="flex items-center justify-between cursor-pointer">
              <div className="space-y-0.5">
                <p className="text-sm font-medium">Email Notifications</p>
                <p className="text-xs text-muted-foreground">Receive updates via your registered government/official email.</p>
              </div>
              <input
                type="checkbox"
                checked={emailNotifs}
                onChange={(e) => setEmailNotifs(e.target.checked)}
                className="size-4 rounded border-border text-primary focus:ring-primary/20"
              />
            </label>

            <label className="flex items-center justify-between cursor-pointer">
              <div className="space-y-0.5">
                <p className="text-sm font-medium">SMS Notifications</p>
                <p className="text-xs text-muted-foreground">Receive critical alerts via text message.</p>
              </div>
              <input
                type="checkbox"
                checked={smsNotifs}
                onChange={(e) => setSmsNotifs(e.target.checked)}
                className="size-4 rounded border-border text-primary focus:ring-primary/20"
              />
            </label>

            <label className="flex items-center justify-between cursor-pointer">
              <div className="space-y-0.5">
                <p className="text-sm font-medium">Course Submission & Trainee Alerts</p>
                <p className="text-xs text-muted-foreground">Get notified when a trainee enrolls or completes assignments.</p>
              </div>
              <input
                type="checkbox"
                checked={courseAlerts}
                onChange={(e) => setCourseAlerts(e.target.checked)}
                className="size-4 rounded border-border text-primary focus:ring-primary/20"
              />
            </label>
          </div>

          {message && (
            <p className={`text-xs ${message.type === "success" ? "text-emerald-500" : "text-destructive"}`}>
              {message.text}
            </p>
          )}

          <Button
            onClick={handleSavePreferences}
            disabled={saving}
            className="cc-btn-glass gap-2 rounded-full"
          >
            {saving ? <Loader2 className="size-4 animate-spin" /> : <Check className="size-4" />}
            Save Preferences
          </Button>
        </CardContent>
      </Card>

      {/* Security & Password */}
      <Card className="cc-glow-card border-border/70 bg-card/70 backdrop-blur">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Lock className="size-5 text-primary" />
            <CardTitle className="text-lg">Security & Password</CardTitle>
          </div>
          <CardDescription>Update your password to keep your trainer credentials secure.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleUpdatePassword} className="space-y-4 max-w-md">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground">New Password</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="At least 6 characters"
                className="w-full rounded-xl border border-border/70 bg-background/50 p-2.5 text-sm outline-none transition-colors focus:border-primary/60 focus:ring-2 focus:ring-primary/15"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground">Confirm New Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-type new password"
                className="w-full rounded-xl border border-border/70 bg-background/50 p-2.5 text-sm outline-none transition-colors focus:border-primary/60 focus:ring-2 focus:ring-primary/15"
              />
            </div>

            {passwordMessage && (
              <p className={`text-xs ${passwordMessage.type === "success" ? "text-emerald-500" : "text-destructive"}`}>
                {passwordMessage.text}
              </p>
            )}

            <Button
              type="submit"
              disabled={passwordLoading}
              className="cc-btn-glass gap-2 rounded-full"
            >
              {passwordLoading ? <Loader2 className="size-4 animate-spin" /> : <Shield className="size-4" />}
              Update Password
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
