import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PageHeader, Section, SimpleTable, StatCard } from "@/components/kit";
import { certificates, currentUsers, results } from "@/lib/mock-data";

export const Route = createFileRoute("/trainee/profile")({
  component: Profile,
});

function Profile() {
  const u = currentUsers.trainee;
  return (
    <>
      <PageHeader title="Profile" subtitle="Your service and learning record" />

      <Section title="" className="mb-6">
        <div className="flex flex-col items-start gap-5 sm:flex-row sm:items-center">
          <Avatar className="size-20">
            <AvatarFallback className="bg-primary text-xl text-primary-foreground">YM</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <h2 className="font-display text-xl font-bold">{u.name}</h2>
            <p className="text-sm text-muted-foreground">
              {u.title} · {u.dept}
            </p>
            <div className="mt-2 flex flex-wrap gap-2">
              <Badge variant="secondary">ID {u.id}</Badge>
              <Badge variant="secondary">Group B Officer</Badge>
              <Badge variant="secondary">Batch A</Badge>
            </div>
          </div>
          <Button variant="outline">Edit profile</Button>
        </div>
      </Section>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Courses enrolled" value={6} />
        <StatCard label="Completed" value={2} tone="success" />
        <StatCard label="Certificates" value={3} tone="info" />
        <StatCard label="Learning hours" value="64" tone="warning" />
      </div>

      <Tabs defaultValue="personal" className="mt-6">
        <TabsList>
          <TabsTrigger value="personal">Personal</TabsTrigger>
          <TabsTrigger value="service">Service details</TabsTrigger>
          <TabsTrigger value="record">Learning record</TabsTrigger>
        </TabsList>

        <TabsContent value="personal" className="mt-4">
          <Section title="Personal information">
            <div className="grid gap-4 sm:grid-cols-2">
              {[
                ["Full name", u.name],
                ["Email", u.email],
                ["Mobile", "+91 98xxx 41220"],
                ["Date of birth", "14 Mar 1994"],
                ["Gender", "Male"],
                ["State", "Uttar Pradesh"],
              ].map(([l, v]) => (
                <div key={l}>
                  <Label className="text-xs">{l}</Label>
                  <Input defaultValue={v} className="mt-1.5" />
                </div>
              ))}
            </div>
            <Button className="mt-5" onClick={() => toast.success("Profile updated")}>
              Save changes
            </Button>
          </Section>
        </TabsContent>

        <TabsContent value="service" className="mt-4">
          <Section title="Service details">
            <div className="grid gap-4 sm:grid-cols-2">
              {[
                ["Employee ID", "GOV-2019-44118"],
                ["Designation", u.title],
                ["Department", u.dept],
                ["Cadre", "State Civil Services"],
                ["Date of joining", "02 Jul 2019"],
                ["Reporting officer", "Smt. K. Ramesh"],
              ].map(([l, v]) => (
                <div key={l}>
                  <Label className="text-xs">{l}</Label>
                  <Input defaultValue={v} readOnly className="mt-1.5 bg-muted/50" />
                </div>
              ))}
            </div>
          </Section>
        </TabsContent>

        <TabsContent value="record" className="mt-4">
          <div className="grid gap-6 lg:grid-cols-2">
            <Section title="Assessments">
              <SimpleTable
                columns={["Assessment", "Score", "Status"]}
                rows={results.map((r) => ({
                  key: r.id,
                  cells: [r.assessment, `${r.score}%`, r.status],
                }))}
              />
            </Section>
            <Section title="Certificates">
              <SimpleTable
                columns={["Certificate", "Grade", "Issued"]}
                rows={certificates.map((c) => ({
                  key: c.id,
                  cells: [c.course, c.grade, c.issued],
                }))}
              />
            </Section>
          </div>
        </TabsContent>
      </Tabs>
    </>
  );
}
