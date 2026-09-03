import type { Role } from "@/lib/mock-data";

export type NavItem = { label: string; to: string; group: string };

export const navConfig: Record<Role, NavItem[]> = {
  trainee: [
    { label: "Dashboard", to: "/trainee", group: "Learning" },
    { label: "My Courses", to: "/trainee/courses", group: "Learning" },
    { label: "Course Details", to: "/trainee/courses/C-101", group: "Learning" },
    { label: "Learning Resources", to: "/trainee/resources", group: "Learning" },
    { label: "Progress", to: "/trainee/progress", group: "Learning" },
    { label: "Assessment", to: "/trainee/assessment", group: "Assessment" },
    { label: "Results", to: "/trainee/results", group: "Assessment" },
    { label: "Certificates", to: "/trainee/certificates", group: "Recognition" },
    { label: "Achievements", to: "/trainee/achievements", group: "Recognition" },
    { label: "Feedback", to: "/trainee/feedback", group: "Account" },
    { label: "Notifications", to: "/trainee/notifications", group: "Account" },
    { label: "Profile", to: "/trainee/profile", group: "Account" },
    { label: "Settings", to: "/trainee/settings", group: "Account" },
  ],
  trainer: [
    { label: "Dashboard", to: "/trainer", group: "Teaching" },
    { label: "My Courses", to: "/trainer/courses", group: "Teaching" },
    { label: "Create Course", to: "/trainer/courses/create", group: "Teaching" },
    { label: "Course Details", to: "/trainer/courses/C-101", group: "Teaching" },
    { label: "Resource Library", to: "/trainer/resources", group: "Content" },
    { label: "Upload Resource", to: "/trainer/resources/upload", group: "Content" },
    { label: "Question Builder", to: "/trainer/questions", group: "Content" },
    { label: "Certificates", to: "/trainer/certificate", group: "Content" },
    { label: "Enrolled Trainees", to: "/trainer/trainees", group: "Insights" },
    { label: "Performance", to: "/trainer/performance", group: "Insights" },
    { label: "Participation", to: "/trainer/participation", group: "Insights" },
    { label: "Feedback", to: "/trainer/feedback", group: "Account" },
    { label: "Notifications", to: "/trainer/notifications", group: "Account" },
    { label: "Profile", to: "/trainer/profile", group: "Account" },
    { label: "Settings", to: "/trainer/settings", group: "Account" },
  ],
  admin: [
    { label: "Dashboard", to: "/admin", group: "Overview" },

    { label: "Reports", to: "/admin/reports", group: "Overview" },

    { label: "Trainee Management", to: "/admin/trainees", group: "People" },
    { label: "Trainer Management", to: "/admin/trainers", group: "People" },

    { label: "Approvals", to: "/admin/approvals", group: "Governance" },

    { label: "Announcements", to: "/admin/announcements", group: "Governance" },
    { label: "Support", to: "/admin/support", group: "Governance" },

    { label: "Notifications", to: "/admin/notifications", group: "Account" },
    { label: "Settings", to: "/admin/settings", group: "Account" },
  ],
};

export const roleLabel: Record<Role, string> = {
  trainee: "Trainee Portal",
  trainer: "Trainer Portal",
  admin: "Administration",
};
