import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PageHeader, Section } from "@/components/kit";

export function SettingsPage({
  role,
  extra,
}: {
  role: string;
  extra?: { label: string; desc: string }[];
}) {
  const toggles = [
    { label: "Email notifications", desc: "Course updates, deadlines and announcements" },
    { label: "SMS alerts", desc: "Critical alerts such as assessment windows" },
    { label: "Weekly digest", desc: "Summary of your activity every Monday" },
    ...(extra ?? []),
  ];

  return (
    <>
      <PageHeader title="Settings" subtitle={`Preferences for your ${role} account`} />

      <Tabs defaultValue="general">
        <TabsList>
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="mt-4">
          <Section title="Display & language">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label className="text-xs">Language</Label>
                <Select defaultValue="en">
                  <SelectTrigger className="mt-1.5">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="hi">हिन्दी</SelectItem>
                    <SelectItem value="mr">मराठी</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-xs">Time zone</Label>
                <Select defaultValue="ist">
                  <SelectTrigger className="mt-1.5">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ist">India Standard Time (IST)</SelectItem>
                    <SelectItem value="utc">UTC</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <Separator className="my-5" />
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Compact layout</p>
                <p className="text-xs text-muted-foreground">Show denser tables and cards</p>
              </div>
              <Switch />
            </div>
            <Button className="mt-5" onClick={() => toast.success("Settings saved")}>
              Save preferences
            </Button>
          </Section>
        </TabsContent>

        <TabsContent value="notifications" className="mt-4">
          <Section title="Notification preferences">
            <div className="space-y-4">
              {toggles.map((t, i) => (
                <div key={t.label} className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">{t.label}</p>
                    <p className="text-xs text-muted-foreground">{t.desc}</p>
                  </div>
                  <Switch defaultChecked={i % 2 === 0} />
                </div>
              ))}
            </div>
          </Section>
        </TabsContent>

        <TabsContent value="security" className="mt-4">
          <Section title="Account security">
            <div className="grid max-w-md gap-4">
              <div>
                <Label className="text-xs">Current password</Label>
                <Input type="password" defaultValue="password" className="mt-1.5" />
              </div>
              <div>
                <Label className="text-xs">New password</Label>
                <Input type="password" placeholder="Enter new password" className="mt-1.5" />
              </div>
              <div>
                <Label className="text-xs">Confirm new password</Label>
                <Input type="password" placeholder="Re-enter new password" className="mt-1.5" />
              </div>
            </div>
            <Separator className="my-5" />
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Two-factor authentication</p>
                <p className="text-xs text-muted-foreground">OTP on registered mobile number</p>
              </div>
              <Switch defaultChecked />
            </div>
            <Button className="mt-5" onClick={() => toast.success("Password updated")}>
              Update password
            </Button>
          </Section>
        </TabsContent>
      </Tabs>
    </>
  );
}
