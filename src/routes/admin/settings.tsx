import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Settings2, Bell, Shield, Mail, Save } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";

export const Route = createFileRoute("/admin/settings")({
  head: () => ({
    meta: [{ title: "Settings — Administration · Capacity Connect" }],
  }),
  component: SettingsPage,
});

function SettingsPage() {
  // TODO: replace with real API data (useQuery / useMutation)
  const [orgName, setOrgName] = useState("Capacity Connect");
  const [supportEmail, setSupportEmail] = useState("");
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [approvalAlerts, setApprovalAlerts] = useState(true);
  const [twoFactor, setTwoFactor] = useState(false);
  const [publicRegistration, setPublicRegistration] = useState(false);

  function handleSave() {
    // TODO: call save mutation
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-xl font-bold">Settings</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage platform-wide preferences and configuration.
          </p>
        </div>
        <Button size="sm" className="gap-1.5" onClick={handleSave}>
          <Save className="size-4" />
          Save changes
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center gap-2">
            <Settings2 className="size-4 text-muted-foreground" />
            <CardTitle className="font-display text-sm font-bold">General</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-2 sm:max-w-sm">
            <Label htmlFor="orgName" className="text-xs">Organization name</Label>
            <Input
              id="orgName"
              value={orgName}
              onChange={(e) => setOrgName(e.target.value)}
            />
          </div>
          <div className="grid gap-2 sm:max-w-sm">
            <Label htmlFor="supportEmail" className="text-xs">Support email</Label>
            <Input
              id="supportEmail"
              type="email"
              placeholder="support@capacityconnect.gov.in"
              value={supportEmail}
              onChange={(e) => setSupportEmail(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center gap-2">
            <Bell className="size-4 text-muted-foreground" />
            <CardTitle className="font-display text-sm font-bold">Notifications</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Email notifications</p>
              <p className="text-xs text-muted-foreground">
                Receive updates about platform activity via email.
              </p>
            </div>
            <Switch checked={emailNotifications} onCheckedChange={setEmailNotifications} />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Approval alerts</p>
              <p className="text-xs text-muted-foreground">
                Get notified when new approval requests come in.
              </p>
            </div>
            <Switch checked={approvalAlerts} onCheckedChange={setApprovalAlerts} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center gap-2">
            <Shield className="size-4 text-muted-foreground" />
            <CardTitle className="font-display text-sm font-bold">Security &amp; access</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Require two-factor authentication</p>
              <p className="text-xs text-muted-foreground">
                Enforce 2FA for all admin accounts.
              </p>
            </div>
            <Switch checked={twoFactor} onCheckedChange={setTwoFactor} />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Allow public registration</p>
              <p className="text-xs text-muted-foreground">
                Let new trainees sign up without an invite.
              </p>
            </div>
            <Switch checked={publicRegistration} onCheckedChange={setPublicRegistration} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center gap-2">
            <Mail className="size-4 text-muted-foreground" />
            <CardTitle className="font-display text-sm font-bold">Email templates</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex h-[100px] items-center justify-center text-xs text-muted-foreground">
            No email templates configured yet
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
