import { createFileRoute } from "@tanstack/react-router";
import { Award, Building2, Mail, Medal, Pencil, ShieldCheck } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { achievements, certificates, currentUsers, skillRadar } from "@/lib/mock-data";

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

function TraineeProfile() {
  const user = currentUsers.trainee;

  return (
    <div className="space-y-6">
      <Card className="cc-glow-card overflow-hidden border-border/70 bg-card/70 backdrop-blur">
        <CardContent className="flex flex-col gap-6 p-6 md:flex-row md:items-center">
          <div className="flex size-20 items-center justify-center rounded-2xl bg-primary/15 font-display text-2xl font-bold text-primary">
            {user.name
              .split(" ")
              .map((part) => part[0])
              .join("")}
          </div>
          <div className="flex-1 space-y-1.5">
            <Badge variant="secondary" className="rounded-full uppercase tracking-widest">
              Trainee Portal
            </Badge>
            <h1 className="font-display text-2xl font-bold md:text-3xl">{user.name}</h1>
            <p className="text-sm text-muted-foreground">
              {user.title} · {user.dept}
            </p>
            <div className="flex flex-wrap gap-4 pt-1 text-xs text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <Mail className="size-3.5" /> {user.email}
              </span>
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="size-3.5" /> ID {user.id}
              </span>
              <span className="flex items-center gap-1.5">
                <Building2 className="size-3.5" /> Government of India
              </span>
            </div>
          </div>
          <Button className="cc-btn-glass gap-2 rounded-full">
            <Pencil className="size-4" /> Edit Profile
          </Button>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="cc-glow-card border-border/70 bg-card/70 backdrop-blur lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">Competency Levels</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {skillRadar.map((skill) => (
              <div key={skill.skill} className="space-y-1.5">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">{skill.skill}</span>
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
            {achievements.slice(0, 5).map((achievement) => (
              <div key={achievement.id} className="flex items-start gap-3">
                <Medal
                  className={achievement.earned ? "mt-0.5 size-4 text-warning" : "mt-0.5 size-4 text-muted-foreground/50"}
                />
                <div className="min-w-0">
                  <p className="text-sm font-semibold">{achievement.title}</p>
                  <p className="text-xs text-muted-foreground">{achievement.desc}</p>
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
        <CardContent className="grid gap-4 md:grid-cols-3">
          {certificates.map((certificate) => (
            <div
              key={certificate.id}
              className="cc-glow-card rounded-xl border border-border/70 p-4"
            >
              <Award className="size-5 text-primary" />
              <p className="mt-2 text-sm font-semibold leading-snug">{certificate.course}</p>
              <p className="mt-1 text-xs text-muted-foreground">
                {certificate.code} · Issued {certificate.issued}
              </p>
              <Badge variant="secondary" className="mt-3 rounded-full">
                Grade {certificate.grade}
              </Badge>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
