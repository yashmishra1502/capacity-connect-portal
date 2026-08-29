import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import {
  Plus,
  Loader2,
  Search,
  ExternalLink,
  Trash2,
  Video,
  Play,
  FolderOpen,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
  trainer_id?: string | null;
  created_at?: string;
}

function getPlaylistId(url?: string): string {
  if (!url) return "";
  const match = url.match(/[?&]list=([^&]+)/);
  return match ? match[1] : url;
}

function TrainerCourses() {
  const [courses, setCourses] = useState<TrainerCourse[]>([]);
  const [loading, setLoading] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [previewCourse, setPreviewCourse] = useState<TrainerCourse | null>(null);

  // Form State
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [code, setCode] = useState("");
  const [duration, setDuration] = useState("");
  const [modulesCount, setModulesCount] = useState("");
  const [playlistLink, setPlaylistLink] = useState("");

  const fetchTrainerCourses = async () => {
    try {
      setLoading(true);

      // Get authenticated trainer user
      const { data: authData } = await supabase.auth.getUser();
      const currentUserId = authData.user?.id;

      if (!currentUserId) {
        setCourses([]);
        return;
      }

      // Fetch only courses created by this specific trainer
      const { data, error } = await supabase
        .from("courses")
        .select("*")
        .eq("trainer_id", currentUserId)
        .order("id", { ascending: false });

      if (error) throw error;
      setCourses(data || []);
    } catch (err) {
      console.error("Error fetching trainer courses:", err);
      setCourses([]);
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

      // Get current logged-in user ID to set as trainer_id
      const { data: authData, error: userError } = await supabase.auth.getUser();
      
      if (userError || !authData.user) {
        alert("Authentication required. Please log in as a trainer.");
        return;
      }

      const trainerId = authData.user.id;

      const payload = {
        title,
        code,
        category,
        duration,
        modules_count: parseInt(modulesCount) || 0,
        playlist_link: playlistLink,
        published: true,
        trainer_id: trainerId, // Writes current trainer ID into database
      };

      const { error } = await supabase.from("courses").insert([payload]);

      if (error) throw error;

      // Clear Form & Close Dialog
      setTitle("");
      setCode("");
      setCategory("");
      setDuration("");
      setModulesCount("");
      setPlaylistLink("");
      setOpenModal(false);

      // Refresh list
      await fetchTrainerCourses();
    } catch (err: any) {
      alert("Failed to create course: " + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteCourse = async (id: string) => {
    if (!confirm("Are you sure you want to delete this course?")) return;
    try {
      const { error } = await supabase.from("courses").delete().eq("id", id);
      if (error) throw error;
      setCourses((prev) => prev.filter((item) => item.id !== id));
    } catch (err: any) {
      alert("Failed to delete course: " + err.message);
    }
  };

  const filteredCourses = useMemo(() => {
    return courses.filter((c) => {
      const search = searchQuery.toLowerCase();
      return (
        c.title?.toLowerCase().includes(search) ||
        c.code?.toLowerCase().includes(search) ||
        c.category?.toLowerCase().includes(search)
      );
    });
  }, [courses, searchQuery]);

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <header className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <Badge variant="secondary" className="mb-2 rounded-full uppercase tracking-widest">
            Trainer Workspace
          </Badge>
          <h1 className="font-display text-3xl font-bold">My Courses</h1>
          <p className="text-sm text-muted-foreground">
            Manage your uploaded capacity building courses.
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
              <DialogTitle className="font-display text-xl font-bold">
                Upload New Course
              </DialogTitle>
            </DialogHeader>

            <form onSubmit={handleCreateCourse} className="space-y-4 pt-2">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-muted-foreground">Course Title</label>
                <Input
                  required
                  placeholder="Course Title"
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

              <div className="flex justify-end gap-3 pt-4">
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

      {/* Search Filter */}
      <Card className="border-border/70 bg-card/70 backdrop-blur">
        <CardContent className="p-4 flex flex-col sm:flex-row gap-4 justify-between items-center">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search my courses…"
              className="pl-9 h-10 rounded-xl"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <p className="text-xs text-muted-foreground">
            My Courses: <strong className="text-foreground">{filteredCourses.length}</strong>
          </p>
        </CardContent>
      </Card>

      {/* Courses Table */}
      <Card className="border-border/70 bg-card/70 backdrop-blur overflow-hidden">
        <CardContent className="p-0">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-16 gap-3 text-muted-foreground">
              <Loader2 className="size-8 animate-spin text-primary" />
              <p className="text-sm">Loading your courses...</p>
            </div>
          ) : filteredCourses.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 gap-3 text-muted-foreground">
              <FolderOpen className="size-10 stroke-1" />
              <p className="text-sm font-medium">You haven't uploaded any courses yet</p>
              <Button size="sm" variant="outline" onClick={() => setOpenModal(true)}>
                Upload Course
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader className="bg-muted/40">
                <TableRow>
                  <TableHead className="w-[100px]">Code</TableHead>
                  <TableHead>Course Title</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Videos</TableHead>
                  <TableHead>Playlist Link</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCourses.map((course) => (
                  <TableRow key={course.id} className="hover:bg-muted/30">
                    <TableCell className="font-mono text-xs font-bold text-primary">
                      {course.code || "—"}
                    </TableCell>
                    <TableCell className="font-medium max-w-xs truncate">
                      {course.title}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="rounded-full text-xs">
                        {course.category}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {course.duration || "—"}
                    </TableCell>
                    <TableCell className="text-xs font-semibold">
                      {course.modules_count || 0}
                    </TableCell>
                    <TableCell className="max-w-[200px] truncate text-xs text-muted-foreground">
                      {course.playlist_link ? (
                        <a
                          href={course.playlist_link}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center gap-1 hover:text-primary underline underline-offset-2"
                        >
                          <Video className="size-3" />
                          Open Link <ExternalLink className="size-3" />
                        </a>
                      ) : (
                        "—"
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          size="sm"
                          variant="secondary"
                          className="h-8 gap-1.5 rounded-full"
                          onClick={() => setPreviewCourse(course)}
                        >
                          <Play className="size-3.5" /> Preview
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-8 w-8 text-destructive hover:bg-destructive/10"
                          onClick={() => handleDeleteCourse(course.id)}
                        >
                          <Trash2 className="size-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Playlist Dialog Preview */}
      {previewCourse && (
        <Dialog open={!!previewCourse} onOpenChange={() => setPreviewCourse(null)}>
          <DialogContent className="max-w-4xl border-border/80 bg-background/95 backdrop-blur-xl">
            <DialogHeader className="border-b pb-4">
              <Badge className="w-fit rounded-full uppercase mb-2">
                {previewCourse.category}
              </Badge>
              <DialogTitle className="font-display text-xl font-bold">
                {previewCourse.title}
              </DialogTitle>
            </DialogHeader>

            <div className="mt-4 aspect-video w-full overflow-hidden rounded-xl bg-black shadow-2xl">
              <iframe
                className="h-full w-full"
                src={`https://www.youtube.com/embed/videoseries?list=${getPlaylistId(
                  previewCourse.playlist_link,
                )}`}
                title={previewCourse.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
