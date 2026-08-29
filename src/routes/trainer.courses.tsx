import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { BookOpen, Plus, Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { supabase } from "@/lib/supabaseClient";

export const Route = createFileRoute("/trainer/courses")({
  component: TrainerCourses,
});

export interface TrainerCourse {
  id: string;
  code: string;
  title: string;
  category: string;
  duration: string;
  modules_count: number;
  playlist_link: string;
}

function TrainerCourses() {
  const [courses, setCourses] = useState<TrainerCourse[]>([]);
  const [loading, setLoading] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Digital Marketing");
  const [code, setCode] = useState("");
  const [duration, setDuration] = useState("");
  const [modulesCount, setModulesCount] = useState("");
  const [playlistLink, setPlaylistLink] = useState("");

  const fetchTrainerCourses = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("courses")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      if (data) setCourses(data);
    } catch (err) {
      console.error("Error loading trainer courses:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrainerCourses();
  }, []);

  const handleCreateCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);

      const { error } = await supabase.from("courses").insert([
        {
          title,
          code,
          category,
          duration,
          modules_count: parseInt(modulesCount) || 0,
          playlist_link: playlistLink,
          published: true,
          trainer_id: null,
        },
      ]);

      if (error) throw error;

      setTitle("");
      setCode("");
      setDuration("");
      setModulesCount("");
      setPlaylistLink("");
      setOpenModal(false);
      fetchTrainerCourses();
    } catch (err: any) {
      alert("Failed to create course: " + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8 p-6">
      <header className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <Badge variant="secondary" className="mb-2 rounded-full uppercase tracking-widest">
            Trainer Workspace
          </Badge>
          <h1 className="font-display text-3xl font-bold">Manage Courses</h1>
          <p className="text-sm text-muted-foreground">
            Create, manage, and assign video playlist courses to capacity building portals.
          </p>
        </div>

        <Dialog open={openModal} onOpenChange={setOpenModal}>
          <DialogTrigger asChild>
            <Button className="gap-2 rounded-full">
              <Plus className="size-4" /> Add New Course
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg border-border/80 bg-background/95 backdrop-blur-xl">
            <DialogHeader>
              <DialogTitle className="font-display text-xl font-bold">Create Course</DialogTitle>
            </DialogHeader>

            <form onSubmit={handleCreateCourse} className="space-y-4 pt-2">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-muted-foreground">Course Title</label>
                <Input
                  required
                  placeholder="e.g. Digital Marketing for Beginners"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-muted-foreground">Course Code</label>
                  <Input
                    required
                    placeholder="e.g. DM-101"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-muted-foreground">Category</label>
                  <Input
                    required
                    placeholder="e.g. Digital Marketing"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-muted-foreground">Total Duration</label>
                  <Input
                    required
                    placeholder="e.g. 13 hours"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-muted-foreground">Videos Count</label>
                  <Input
                    type="number"
                    required
                    placeholder="e.g. 74"
                    value={modulesCount}
                    onChange={(e) => setModulesCount(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-muted-foreground">
                  YouTube Playlist Link
                </label>
                <Input
                  required
                  type="url"
                  placeholder="https://youtube.com/playlist?list=..."
                  value={playlistLink}
                  onChange={(e) => setPlaylistLink(e.target.value)}
                />
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <Button variant="outline" type="button" onClick={() => setOpenModal(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? <Loader2 className="size-4 animate-spin" /> : "Publish Course"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </header>

      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="size-8 animate-spin text-primary" />
        </div>
      ) : (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {courses.map((course) => (
            <Card key={course.id} className="border-border/70 bg-card/70 backdrop-blur">
              <CardContent className="space-y-4 p-5">
                <div className="flex justify-between items-start">
                  <Badge>{course.category}</Badge>
                  <span className="text-xs font-mono text-muted-foreground">{course.code}</span>
                </div>
                <div>
                  <h3 className="font-bold text-lg leading-snug">{course.title}</h3>
                  <p className="text-xs text-muted-foreground mt-1 truncate">
                    {course.playlist_link}
                  </p>
                </div>
                <div className="flex items-center gap-4 text-xs text-muted-foreground border-t pt-3">
                  <span className="flex items-center gap-1">
                    <BookOpen className="size-3.5" /> {course.modules_count} videos
                  </span>
                  <span>{course.duration}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
