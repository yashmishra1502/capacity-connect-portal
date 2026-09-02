import * as React from "react";
import { createFileRoute } from "@tanstack/react-router";
import { supabase } from "@/lib/supabaseClient"; // adjust based on your supabase client path
import { 
  FolderDown, 
  Plus, 
  Trash2, 
  Edit3, 
  FileText, 
  FileSpreadsheet, 
  Video, 
  File, 
  Search,
  X
} from "lucide-react";

export const Route = createFileRoute("/trainer/resources")({
  component: TrainerResourcesPage,
});

interface Resource {
  id: string;
  title: string;
  type: string;
  size: string;
  course_id: string | null;
  uploaded_date: string;
  downloads: number;
  file_url: string;
}

function TrainerResourcesPage() {
  const [resources, setResources] = React.useState<Resource[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [searchQuery, setSearchQuery] = React.useState("");
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [editingResource, setEditingResource] = React.useState<Resource | null>(null);

  // Form states
  const [title, setTitle] = React.useState("");
  const [type, setType] = React.useState("PDF");
  const [size, setSize] = React.useState("1.2 MB");
  const [fileUrl, setFileUrl] = React.useState("");
  const [submitting, setSubmitting] = React.useState(false);

  // Fetch resources on mount
  const fetchResources = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("resources")
      .select("*")
      .order("uploaded_date", { ascending: false });

    if (error) {
      console.error("Error fetching resources:", error);
    } else {
      setResources(data || []);
    }
    setLoading(false);
  };

  React.useEffect(() => {
    fetchResources();
  }, []);

  // Handle Create or Update
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    if (editingResource) {
      // Update existing resource
      const { error } = await supabase
        .from("resources")
        .update({ title, type, size, file_url: fileUrl })
        .eq("id", editingResource.id);

      if (error) {
        alert("Failed to update resource: " + error.message);
      } else {
        setEditingResource(null);
        resetForm();
        fetchResources();
        setIsModalOpen(false);
      }
    } else {
      // Insert new resource
      const { error } = await supabase.from("resources").insert([
        {
          title,
          type,
          size,
          file_url: fileUrl,
          downloads: 0,
          uploaded_date: new Date().toISOString().split("T")[0],
        },
      ]);

      if (error) {
        alert("Failed to upload resource: " + error.message);
      } else {
        resetForm();
        fetchResources();
        setIsModalOpen(false);
      }
    }
    setSubmitting(false);
  };

  // Handle Delete
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this resource?")) return;

    const { error } = await supabase.from("resources").delete().eq("id", id);
    if (error) {
      alert("Failed to delete: " + error.message);
    } else {
      setResources((prev) => prev.filter((r) => r.id !== id));
    }
  };

  // Open Edit Modal
  const handleEditClick = (resource: Resource) => {
    setEditingResource(resource);
    setTitle(resource.title);
    setType(resource.type);
    setSize(resource.size);
    setFileUrl(resource.file_url);
    setIsModalOpen(true);
  };

  const resetForm = () => {
    setTitle("");
    setType("PDF");
    setSize("1.0 MB");
    setFileUrl("");
    setEditingResource(null);
  };

  // Filter resources based on search
  const filteredResources = resources.filter((r) =>
    r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getFileIcon = (fileType: string) => {
    switch (fileType.toUpperCase()) {
      case "PDF": return <FileText className="text-red-500" size={18} />;
      case "XLSX": case "CSV": return <FileSpreadsheet className="text-emerald-500" size={18} />;
      case "VIDEO": return <Video className="text-blue-500" size={18} />;
      default: return <File className="text-gray-500" size={18} />;
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Resource Library</h1>
          <p className="text-sm text-muted-foreground">
            Manage course materials, handbooks, and downloadable assets.
          </p>
        </div>
        <button
          onClick={() => { resetForm(); setIsModalOpen(true); }}
          className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
        >
          <Plus size={16} /> Upload Resource
        </button>
      </div>

      {/* Search Bar & Stats */}
      <div className="flex items-center justify-between gap-4 bg-card border rounded-xl p-4 shadow-sm">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-2.5 text-muted-foreground" size={16} />
          <input
            type="text"
            placeholder="Search resources by title or type..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm bg-background border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <div className="text-sm text-muted-foreground">
          Total Resources: <span className="font-semibold text-foreground">{resources.length}</span>
        </div>
      </div>

      {/* Table Section */}
      <div className="border rounded-xl bg-card shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-muted-foreground">Loading library...</div>
        ) : filteredResources.length === 0 ? (
          <div className="p-12 text-center text-muted-foreground">
            <FolderDown className="mx-auto h-10 w-10 opacity-40 mb-2" />
            <p>No resources found.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="border-b bg-muted/50 text-muted-foreground font-medium">
                  <th className="p-4">Title</th>
                  <th className="p-4">Type</th>
                  <th className="p-4">Size</th>
                  <th className="p-4">Downloads</th>
                  <th className="p-4">Uploaded Date</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filteredResources.map((res) => (
                  <tr key={res.id} className="hover:bg-muted/30 transition-colors">
                    <td className="p-4 font-medium flex items-center gap-3">
                      {getFileIcon(res.type)}
                      <a 
                        href={res.file_url} 
                        target="_blank" 
                        rel="noreferrer" 
                        className="hover:underline text-primary font-semibold"
                      >
                        {res.title}
                      </a>
                    </td>
                    <td className="p-4">
                      <span className="px-2.5 py-1 rounded-md text-xs font-semibold bg-secondary text-secondary-foreground">
                        {res.type}
                      </span>
                    </td>
                    <td className="p-4 text-muted-foreground">{res.size}</td>
                    <td className="p-4 text-muted-foreground">{res.downloads}</td>
                    <td className="p-4 text-muted-foreground">{res.uploaded_date}</td>
                    <td className="p-4 text-right space-x-2">
                      <button
                        onClick={() => handleEditClick(res)}
                        className="p-1.5 hover:bg-secondary rounded-md text-muted-foreground hover:text-foreground transition-colors"
                        title="Edit Resource"
                      >
                        <Edit3 size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(res.id)}
                        className="p-1.5 hover:bg-red-50 hover:text-red-600 rounded-md text-muted-foreground transition-colors"
                        title="Delete Resource"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal for Add / Edit */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-card border rounded-2xl w-full max-w-lg shadow-xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-center px-6 py-4 border-b">
              <h3 className="font-semibold text-lg">
                {editingResource ? "Edit Resource" : "Upload New Resource"}
              </h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-muted-foreground hover:text-foreground"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                  Resource Title
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g., Advanced Policy Guide"
                  className="w-full px-3 py-2 text-sm bg-background border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                    File Type
                  </label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-background border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="PDF">PDF</option>
                    <option value="XLSX">XLSX</option>
                    <option value="DOCX">DOCX</option>
                    <option value="VIDEO">Video</option>
                    <option value="CSV">CSV</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                    File Size
                  </label>
                  <input
                    type="text"
                    required
                    value={size}
                    onChange={(e) => setSize(e.target.value)}
                    placeholder="e.g., 2.4 MB"
                    className="w-full px-3 py-2 text-sm bg-background border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                  File URL / Link
                </label>
                <input
                  type="url"
                  required
                  value={fileUrl}
                  onChange={(e) => setFileUrl(e.target.value)}
                  placeholder="https://example.com/files/resource.pdf"
                  className="w-full px-3 py-2 text-sm bg-background border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-sm border rounded-lg hover:bg-muted font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 text-sm bg-primary text-primary-foreground rounded-lg font-medium hover:opacity-90 disabled:opacity-50"
                >
                  {submitting ? "Saving..." : editingResource ? "Update Resource" : "Upload"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
