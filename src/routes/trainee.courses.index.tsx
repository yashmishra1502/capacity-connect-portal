import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PageHeader, StatusBadge } from "@/components/kit";
import { courses } from "@/lib/mock-data";

export const Route = createFileRoute("/trainee/courses/")({
  component: TraineeCourses,
});

function TraineeCourses() {
  const [q, setQ] = useState("");
  const [tab, setTab] = useState("all");
  const [cat, setCat] = useState("all");

  const list = courses.filter((c) => {
    const matchQ = (c.title + c.code + c.trainer).toLowerCase().includes(q.toLowerCase());
    const matchTab =
      tab === "all" ||
      (tab === "progress" && c.status === "In Progress") ||
      (tab === "completed" && c.status === "Completed") ||
      (tab === "new" && c.status === "Not Started");
    const matchCat = cat === "all" || c.category === cat;
    return matchQ && matchTab && matchCat;
  });

  return (
    <>
      <PageHeader title="My Courses" subtitle="All programmes you are enrolled in" />

      <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <Tabs value={tab} onValueChange={setTab}>
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="progress">In Progress</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
            <TabsTrigger value="new">Not Started</TabsTrigger>
          </TabsList>
        </Tabs>
        <div className="flex gap-2">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search courses"
              className="w-full pl-9 md:w-56"
            />
          </div>
          <Select value={cat} onValueChange={setCat}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All categories</SelectItem>
              <SelectItem value="Governance">Governance</SelectItem>
              <SelectItem value="Digital Skills">Digital Skills</SelectItem>
              <SelectItem value="Finance">Finance</SelectItem>
              <SelectItem value="Behavioural">Behavioural</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {list.map((c) => (
          <Card key={c.id} className="flex flex-col">
            <CardContent className="flex flex-1 flex-col p-5">
              <div className="flex items-start justify-between gap-2">
                <Badge variant="secondary" className="text-[10px]">
                  {c.category}
                </Badge>
                <StatusBadge status={c.status} />
              </div>
              <h3 className="mt-3 font-display text-base font-semibold leading-snug">{c.title}</h3>
              <p className="mt-1 text-xs text-muted-foreground">
                {c.code} · {c.trainer}
              </p>
              <p className="mt-2 line-clamp-2 flex-1 text-xs text-muted-foreground">{c.description}</p>
              <div className="mt-3 flex items-center gap-3 text-[11px] text-muted-foreground">
                <span>{c.duration}</span>
                <span>{c.modules} modules</span>
                <span>★ {c.rating}</span>
              </div>
              <div className="mt-3 flex items-center gap-2">
                <Progress value={c.progress} className="h-1.5" />
                <span className="w-9 text-right text-[11px] tabular-nums">{c.progress}%</span>
              </div>
              <Button asChild size="sm" className="mt-4">
                <Link to="/trainee/courses/$courseId" params={{ courseId: c.id }}>
                  {c.progress === 0 ? "Start course" : "Continue"}
                </Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
      {list.length === 0 && (
        <p className="py-16 text-center text-sm text-muted-foreground">No courses found.</p>
      )}
    </>
  );
}
