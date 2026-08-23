// ---------------------------------------------------------------------------
// CAPACITY CONNECT — mock data layer (frontend only).
// A backend developer can replace every export here with real API calls.
// ---------------------------------------------------------------------------

export type Role = "trainee" | "trainer" | "admin";

export const currentUsers: Record<Role, { name: string; email: string; title: string; dept: string; id: string }> = {
  trainee: {
    id: "TRN-2291",
    name: "Yash Mishra",
    email: "yash.mishra@gov-capacity.in",
    title: "Junior Programme Officer",
    dept: "Department of Rural Development",
  },
  trainer: {
    id: "TRR-118",
    name: "Dr. Anjali Verma",
    email: "anjali.verma@gov-capacity.in",
    title: "Senior Faculty — Public Policy",
    dept: "National Institute of Administration",
  },
  admin: {
    id: "ADM-004",
    name: "R. Krishnan",
    email: "r.krishnan@gov-capacity.in",
    title: "Portal Administrator",
    dept: "Capacity Building Commission",
  },
};

export const courses = [
  {
    id: "C-101",
    code: "PPGOV-101",
    title: "Public Policy Formulation & Analysis",
    category: "Governance",
    trainer: "Dr. Anjali Verma",
    level: "Intermediate",
    duration: "24 hrs",
    modules: 8,
    enrolled: 412,
    rating: 4.7,
    progress: 72,
    status: "In Progress",
    published: true,
    description:
      "A structured programme covering the policy cycle, evidence-based decision making, stakeholder analysis and impact evaluation in the Indian administrative context.",
  },
  {
    id: "C-102",
    code: "DGOV-204",
    title: "Digital Governance & e-Office Systems",
    category: "Digital Skills",
    trainer: "Rakesh Nair",
    level: "Beginner",
    duration: "16 hrs",
    modules: 6,
    enrolled: 638,
    rating: 4.5,
    progress: 100,
    status: "Completed",
    published: true,
    description:
      "Hands-on training on e-Office workflows, digital file movement, DSC usage and citizen service delivery platforms.",
  },
  {
    id: "C-103",
    code: "FIN-311",
    title: "Public Financial Management",
    category: "Finance",
    trainer: "Sunita Rao",
    level: "Advanced",
    duration: "30 hrs",
    modules: 10,
    enrolled: 254,
    rating: 4.8,
    progress: 38,
    status: "In Progress",
    published: true,
    description:
      "Budget preparation, expenditure control, treasury operations, audit compliance and outcome budgeting for senior officers.",
  },
  {
    id: "C-104",
    code: "LEAD-150",
    title: "Leadership & Team Effectiveness",
    category: "Behavioural",
    trainer: "Dr. Anjali Verma",
    level: "Intermediate",
    duration: "12 hrs",
    modules: 5,
    enrolled: 521,
    rating: 4.6,
    progress: 0,
    status: "Not Started",
    published: true,
    description:
      "Building high-performing teams, situational leadership, delegation and conflict resolution for field administrators.",
  },
  {
    id: "C-105",
    code: "DATA-220",
    title: "Data Analytics for Decision Makers",
    category: "Digital Skills",
    trainer: "Rakesh Nair",
    level: "Intermediate",
    duration: "20 hrs",
    modules: 7,
    enrolled: 389,
    rating: 4.4,
    progress: 15,
    status: "In Progress",
    published: false,
    description:
      "Reading dashboards, interpreting indicators, basic statistics and using data to prioritise scheme interventions.",
  },
  {
    id: "C-106",
    code: "RTI-090",
    title: "RTI, Grievance Redressal & Citizen Charter",
    category: "Governance",
    trainer: "Meera Iyer",
    level: "Beginner",
    duration: "10 hrs",
    modules: 4,
    enrolled: 712,
    rating: 4.3,
    progress: 0,
    status: "Not Started",
    published: true,
    description:
      "Statutory timelines, appeal handling, CPGRAMS workflows and drafting citizen-friendly responses.",
  },
];

export const courseModules = [
  { id: 1, title: "Introduction & Policy Landscape", duration: "2h 10m", type: "Video", done: true },
  { id: 2, title: "Problem Framing and Agenda Setting", duration: "1h 45m", type: "Video", done: true },
  { id: 3, title: "Stakeholder & Feasibility Analysis", duration: "2h 30m", type: "Reading", done: true },
  { id: 4, title: "Cost-Benefit and Impact Assessment", duration: "3h 05m", type: "Video", done: true },
  { id: 5, title: "Case Study: Rural Livelihood Mission", duration: "1h 20m", type: "Case Study", done: true },
  { id: 6, title: "Policy Drafting Workshop", duration: "2h 50m", type: "Workshop", done: false },
  { id: 7, title: "Monitoring & Evaluation Frameworks", duration: "2h 15m", type: "Video", done: false },
  { id: 8, title: "Final Assessment", duration: "45m", type: "Assessment", done: false },
];

export const resources = [
  { id: "R-1", title: "Policy Cycle Handbook (2025 Edition)", type: "PDF", size: "4.2 MB", course: "PPGOV-101", uploaded: "12 Aug 2026", downloads: 1284 },
  { id: "R-2", title: "e-Office Quick Reference Card", type: "PDF", size: "820 KB", course: "DGOV-204", uploaded: "04 Aug 2026", downloads: 2310 },
  { id: "R-3", title: "Budget Templates Workbook", type: "XLSX", size: "1.1 MB", course: "FIN-311", uploaded: "28 Jul 2026", downloads: 642 },
  { id: "R-4", title: "Session Recording — Stakeholder Mapping", type: "Video", size: "312 MB", course: "PPGOV-101", uploaded: "19 Jul 2026", downloads: 908 },
  { id: "R-5", title: "Leadership Self-Assessment Sheet", type: "DOCX", size: "540 KB", course: "LEAD-150", uploaded: "11 Jul 2026", downloads: 415 },
  { id: "R-6", title: "Analytics Dashboard Sample Dataset", type: "CSV", size: "2.7 MB", course: "DATA-220", uploaded: "02 Jul 2026", downloads: 288 },
];

export const quizQuestions = [
  {
    id: 1,
    question: "Which stage of the policy cycle immediately follows agenda setting?",
    options: ["Policy evaluation", "Policy formulation", "Policy termination", "Budget sanction"],
    answer: 1,
  },
  {
    id: 2,
    question: "A stakeholder with high interest but low influence is best managed by:",
    options: ["Manage closely", "Keep satisfied", "Keep informed", "Monitor with minimum effort"],
    answer: 2,
  },
  {
    id: 3,
    question: "Outcome budgeting primarily links expenditure to:",
    options: ["Departmental headcount", "Measurable results", "Annual inflation", "Audit objections"],
    answer: 1,
  },
  {
    id: 4,
    question: "Under the RTI Act, the standard time limit for providing information is:",
    options: ["15 days", "30 days", "45 days", "60 days"],
    answer: 1,
  },
  {
    id: 5,
    question: "Which tool is most appropriate for comparing costs against social benefits?",
    options: ["SWOT analysis", "Cost-benefit analysis", "Gantt chart", "RACI matrix"],
    answer: 1,
  },
];

export const results = [
  { id: "A-1", assessment: "Public Policy — Final Assessment", course: "PPGOV-101", date: "18 Aug 2026", score: 86, total: 100, status: "Passed" },
  { id: "A-2", assessment: "Digital Governance — Module Quiz 3", course: "DGOV-204", date: "02 Aug 2026", score: 92, total: 100, status: "Passed" },
  { id: "A-3", assessment: "Public Financial Management — Mid Term", course: "FIN-311", date: "24 Jul 2026", score: 58, total: 100, status: "Reattempt" },
  { id: "A-4", assessment: "RTI Fundamentals — Practice Test", course: "RTI-090", date: "15 Jul 2026", score: 74, total: 100, status: "Passed" },
];

export const certificates = [
  { id: "CERT-8841", course: "Digital Governance & e-Office Systems", code: "DGOV-204", issued: "05 Aug 2026", grade: "A", hours: 16 },
  { id: "CERT-8620", course: "RTI, Grievance Redressal & Citizen Charter", code: "RTI-090", issued: "20 Jul 2026", grade: "B+", hours: 10 },
  { id: "CERT-8410", course: "Foundation Course for Field Officers", code: "FND-001", issued: "12 Jun 2026", grade: "A+", hours: 40 },
];

export const achievements = [
  { id: 1, title: "Fast Starter", desc: "Completed first module within 24 hours", earned: true, points: 50 },
  { id: 2, title: "Perfect Score", desc: "Scored 100% in any assessment", earned: false, points: 150 },
  { id: 3, title: "Consistent Learner", desc: "7-day continuous learning streak", earned: true, points: 100 },
  { id: 4, title: "Certified Thrice", desc: "Earned 3 course certificates", earned: true, points: 200 },
  { id: 5, title: "Peer Mentor", desc: "Answered 10 discussion queries", earned: false, points: 120 },
  { id: 6, title: "Capacity Champion", desc: "Completed 100 learning hours", earned: false, points: 300 },
];

export const notifications = [
  { id: 1, title: "Assessment window opens tomorrow", body: "PPGOV-101 final assessment will be live from 09:00 IST.", time: "20 min ago", type: "Assessment", unread: true },
  { id: 2, title: "New resource uploaded", body: "Policy Cycle Handbook (2025 Edition) added to your course.", time: "2 hrs ago", type: "Resource", unread: true },
  { id: 3, title: "Certificate issued", body: "Your certificate for DGOV-204 is ready to download.", time: "Yesterday", type: "Certificate", unread: false },
  { id: 4, title: "Feedback requested", body: "Share your feedback for the Leadership workshop.", time: "2 days ago", type: "Feedback", unread: false },
  { id: 5, title: "Enrollment approved", body: "You have been enrolled into FIN-311 by the administrator.", time: "4 days ago", type: "Enrollment", unread: false },
];

export const weeklyProgress = [
  { week: "W1", hours: 4, score: 62 },
  { week: "W2", hours: 6, score: 68 },
  { week: "W3", hours: 5, score: 71 },
  { week: "W4", hours: 8, score: 77 },
  { week: "W5", hours: 7, score: 80 },
  { week: "W6", hours: 9, score: 86 },
];

export const skillRadar = [
  { skill: "Policy", value: 82 },
  { skill: "Digital", value: 74 },
  { skill: "Finance", value: 58 },
  { skill: "Leadership", value: 66 },
  { skill: "Analytics", value: 61 },
  { skill: "Compliance", value: 79 },
];

// --- Trainer -----------------------------------------------------------------

export const trainees = [
  { id: "TRN-2291", name: "Yash Mishra", dept: "Rural Development", course: "PPGOV-101", progress: 72, score: 86, status: "Active", attendance: 94 },
  { id: "TRN-2304", name: "Priya Sharma", dept: "Health & Family Welfare", course: "PPGOV-101", progress: 100, score: 91, status: "Completed", attendance: 98 },
  { id: "TRN-2318", name: "Imran Qureshi", dept: "Urban Affairs", course: "FIN-311", progress: 45, score: 64, status: "Active", attendance: 81 },
  { id: "TRN-2333", name: "Ananya Das", dept: "Education", course: "DGOV-204", progress: 88, score: 79, status: "Active", attendance: 90 },
  { id: "TRN-2347", name: "Vikram Singh", dept: "Revenue", course: "LEAD-150", progress: 12, score: 0, status: "At Risk", attendance: 52 },
  { id: "TRN-2359", name: "Fatima Sheikh", dept: "Social Justice", course: "DATA-220", progress: 63, score: 73, status: "Active", attendance: 87 },
  { id: "TRN-2371", name: "Rohit Patil", dept: "Agriculture", course: "PPGOV-101", progress: 30, score: 55, status: "At Risk", attendance: 68 },
  { id: "TRN-2388", name: "Sneha Kulkarni", dept: "Women & Child", course: "RTI-090", progress: 100, score: 95, status: "Completed", attendance: 100 },
];

export const cohortPerformance = [
  { batch: "Batch A", avg: 84, pass: 92 },
  { batch: "Batch B", avg: 76, pass: 85 },
  { batch: "Batch C", avg: 69, pass: 74 },
  { batch: "Batch D", avg: 81, pass: 89 },
];

export const participation = [
  { session: "Session 1", present: 46, absent: 4 },
  { session: "Session 2", present: 44, absent: 6 },
  { session: "Session 3", present: 48, absent: 2 },
  { session: "Session 4", present: 41, absent: 9 },
  { session: "Session 5", present: 45, absent: 5 },
];

export const feedbackEntries = [
  { id: "F-1", trainee: "Priya Sharma", course: "PPGOV-101", rating: 5, comment: "Excellent case studies, very relevant to field work.", date: "18 Aug 2026" },
  { id: "F-2", trainee: "Imran Qureshi", course: "FIN-311", rating: 4, comment: "Content was strong but pace was slightly fast in module 6.", date: "14 Aug 2026" },
  { id: "F-3", trainee: "Ananya Das", course: "DGOV-204", rating: 5, comment: "Hands-on e-Office demo was the most useful part.", date: "09 Aug 2026" },
  { id: "F-4", trainee: "Rohit Patil", course: "PPGOV-101", rating: 3, comment: "Would prefer more regional language examples.", date: "01 Aug 2026" },
];

// --- Admin -------------------------------------------------------------------

export const adminStats = {
  users: 4826,
  trainers: 132,
  trainees: 4694,
  courses: 86,
  enrollments: 12408,
  assessments: 214,
  completionRate: 78,
  certificates: 3960,
  pendingApprovals: 17,
  activeToday: 1142,
};

export const enrollmentTrend = [
  { month: "Mar", enrollments: 820, completions: 540 },
  { month: "Apr", enrollments: 960, completions: 640 },
  { month: "May", enrollments: 1120, completions: 780 },
  { month: "Jun", enrollments: 1340, completions: 910 },
  { month: "Jul", enrollments: 1510, completions: 1130 },
  { month: "Aug", enrollments: 1720, completions: 1340 },
];

export const categoryDistribution = [
  { name: "Governance", value: 34 },
  { name: "Digital Skills", value: 26 },
  { name: "Finance", value: 18 },
  { name: "Behavioural", value: 14 },
  { name: "Legal", value: 8 },
];

export const recentActivity = [
  { id: 1, actor: "Priya Sharma", action: "completed", target: "PPGOV-101 Final Assessment", time: "12 min ago" },
  { id: 2, actor: "Dr. Anjali Verma", action: "published", target: "Leadership & Team Effectiveness", time: "48 min ago" },
  { id: 3, actor: "System", action: "issued 24 certificates for", target: "DGOV-204", time: "2 hrs ago" },
  { id: 4, actor: "Rakesh Nair", action: "uploaded", target: "Analytics Dataset v3", time: "4 hrs ago" },
  { id: 5, actor: "Admin", action: "approved trainer profile of", target: "Meera Iyer", time: "Yesterday" },
  { id: 6, actor: "Vikram Singh", action: "enrolled into", target: "LEAD-150", time: "Yesterday" },
];

export const users = [
  { id: "U-1001", name: "Yash Mishra", email: "yash.mishra@gov.in", role: "Trainee", dept: "Rural Development", status: "Active", joined: "12 Jan 2026" },
  { id: "U-1002", name: "Dr. Anjali Verma", email: "anjali.verma@gov.in", role: "Trainer", dept: "NIA Faculty", status: "Active", joined: "04 Mar 2025" },
  { id: "U-1003", name: "R. Krishnan", email: "r.krishnan@gov.in", role: "Admin", dept: "CBC", status: "Active", joined: "18 Nov 2024" },
  { id: "U-1004", name: "Priya Sharma", email: "priya.sharma@gov.in", role: "Trainee", dept: "Health", status: "Active", joined: "22 Feb 2026" },
  { id: "U-1005", name: "Rakesh Nair", email: "rakesh.nair@gov.in", role: "Trainer", dept: "Digital Cell", status: "Active", joined: "09 Sep 2025" },
  { id: "U-1006", name: "Vikram Singh", email: "vikram.singh@gov.in", role: "Trainee", dept: "Revenue", status: "Suspended", joined: "30 Apr 2026" },
  { id: "U-1007", name: "Meera Iyer", email: "meera.iyer@gov.in", role: "Trainer", dept: "Legal Affairs", status: "Pending", joined: "14 Aug 2026" },
  { id: "U-1008", name: "Fatima Sheikh", email: "fatima.sheikh@gov.in", role: "Trainee", dept: "Social Justice", status: "Active", joined: "07 May 2026" },
];

export const trainersList = [
  { id: "TRR-118", name: "Dr. Anjali Verma", expertise: "Public Policy, Leadership", courses: 6, trainees: 412, rating: 4.7, status: "Verified" },
  { id: "TRR-124", name: "Rakesh Nair", expertise: "Digital Governance, Analytics", courses: 4, trainees: 1027, rating: 4.5, status: "Verified" },
  { id: "TRR-131", name: "Sunita Rao", expertise: "Public Finance, Audit", courses: 3, trainees: 254, rating: 4.8, status: "Verified" },
  { id: "TRR-140", name: "Meera Iyer", expertise: "Law, RTI, Grievance", courses: 2, trainees: 712, rating: 4.3, status: "Pending" },
  { id: "TRR-152", name: "Arun Desai", expertise: "Project Management", courses: 1, trainees: 96, rating: 4.1, status: "Verified" },
];

export const approvals = [
  { id: "AP-01", type: "Trainer Registration", subject: "Meera Iyer", submitted: "14 Aug 2026", priority: "High" },
  { id: "AP-02", type: "Course Publication", subject: "Data Analytics for Decision Makers", submitted: "13 Aug 2026", priority: "Medium" },
  { id: "AP-03", type: "Resource Upload", subject: "Budget Templates Workbook v2", submitted: "12 Aug 2026", priority: "Low" },
  { id: "AP-04", type: "Enrollment Request", subject: "Batch D — 42 trainees for FIN-311", submitted: "11 Aug 2026", priority: "High" },
  { id: "AP-05", type: "Certificate Reissue", subject: "CERT-8410 — Ananya Das", submitted: "10 Aug 2026", priority: "Low" },
];

export const roles = [
  { id: "RL-1", name: "Trainee", users: 4694, permissions: ["View courses", "Attempt assessments", "Download certificates"] },
  { id: "RL-2", name: "Trainer", users: 132, permissions: ["Create courses", "Upload resources", "Grade assessments", "View trainees"] },
  { id: "RL-3", name: "Admin", users: 8, permissions: ["Full access", "Manage users", "Approve content", "Publish announcements"] },
  { id: "RL-4", name: "Reviewer", users: 14, permissions: ["Review content", "Approve resources"] },
];

export const enrollments = [
  { id: "EN-5501", trainee: "Yash Mishra", course: "PPGOV-101", batch: "Batch A", date: "01 Jul 2026", status: "Active" },
  { id: "EN-5502", trainee: "Priya Sharma", course: "PPGOV-101", batch: "Batch A", date: "01 Jul 2026", status: "Completed" },
  { id: "EN-5503", trainee: "Imran Qureshi", course: "FIN-311", batch: "Batch C", date: "10 Jul 2026", status: "Active" },
  { id: "EN-5504", trainee: "Vikram Singh", course: "LEAD-150", batch: "Batch D", date: "18 Jul 2026", status: "Dropped" },
  { id: "EN-5505", trainee: "Ananya Das", course: "DGOV-204", batch: "Batch B", date: "22 Jul 2026", status: "Active" },
  { id: "EN-5506", trainee: "Sneha Kulkarni", course: "RTI-090", batch: "Batch B", date: "28 Jul 2026", status: "Completed" },
];

export const assessmentsList = [
  { id: "AS-201", title: "Public Policy — Final Assessment", course: "PPGOV-101", questions: 40, attempts: 386, avg: 78, status: "Live" },
  { id: "AS-202", title: "Digital Governance — Module Quiz 3", course: "DGOV-204", questions: 20, attempts: 604, avg: 84, status: "Live" },
  { id: "AS-203", title: "PFM — Mid Term", course: "FIN-311", questions: 35, attempts: 212, avg: 66, status: "Closed" },
  { id: "AS-204", title: "Leadership — Scenario Test", course: "LEAD-150", questions: 25, attempts: 0, avg: 0, status: "Draft" },
];

export const contentApprovals = [
  { id: "CA-1", item: "Module 7 — M&E Frameworks", course: "PPGOV-101", author: "Dr. Anjali Verma", type: "Module", submitted: "16 Aug 2026", status: "Pending" },
  { id: "CA-2", item: "Analytics Dataset v3", course: "DATA-220", author: "Rakesh Nair", type: "Resource", submitted: "15 Aug 2026", status: "Pending" },
  { id: "CA-3", item: "Case Study — Smart City Audit", course: "FIN-311", author: "Sunita Rao", type: "Case Study", submitted: "12 Aug 2026", status: "Approved" },
  { id: "CA-4", item: "Quiz Bank — RTI Basics", course: "RTI-090", author: "Meera Iyer", type: "Assessment", submitted: "09 Aug 2026", status: "Rejected" },
];

export const announcements = [
  { id: "AN-1", title: "Annual Capacity Building Week — 12 to 18 September", audience: "All Users", date: "20 Aug 2026", status: "Published" },
  { id: "AN-2", title: "Scheduled maintenance on 30 August, 22:00–23:30 IST", audience: "All Users", date: "18 Aug 2026", status: "Published" },
  { id: "AN-3", title: "New competency framework rollout for trainers", audience: "Trainers", date: "11 Aug 2026", status: "Draft" },
];

export const competencyMap = [
  {
    skill: "Public Policy Analysis",
    demand: "High",
    coverage: 82,
    trainers: [
      { name: "Dr. Anjali Verma", match: 96, exp: "14 yrs", rating: 4.7 },
      { name: "Meera Iyer", match: 71, exp: "8 yrs", rating: 4.3 },
      { name: "Arun Desai", match: 54, exp: "6 yrs", rating: 4.1 },
    ],
  },
  {
    skill: "Digital Governance",
    demand: "High",
    coverage: 74,
    trainers: [
      { name: "Rakesh Nair", match: 94, exp: "11 yrs", rating: 4.5 },
      { name: "Arun Desai", match: 68, exp: "6 yrs", rating: 4.1 },
      { name: "Dr. Anjali Verma", match: 49, exp: "14 yrs", rating: 4.7 },
    ],
  },
  {
    skill: "Public Financial Management",
    demand: "Medium",
    coverage: 61,
    trainers: [
      { name: "Sunita Rao", match: 98, exp: "17 yrs", rating: 4.8 },
      { name: "Arun Desai", match: 57, exp: "6 yrs", rating: 4.1 },
    ],
  },
  {
    skill: "Data Analytics",
    demand: "High",
    coverage: 48,
    trainers: [
      { name: "Rakesh Nair", match: 89, exp: "11 yrs", rating: 4.5 },
      { name: "Sunita Rao", match: 62, exp: "17 yrs", rating: 4.8 },
    ],
  },
  {
    skill: "Legal & RTI Compliance",
    demand: "Medium",
    coverage: 69,
    trainers: [
      { name: "Meera Iyer", match: 95, exp: "8 yrs", rating: 4.3 },
      { name: "Dr. Anjali Verma", match: 58, exp: "14 yrs", rating: 4.7 },
    ],
  },
  {
    skill: "Leadership & Behavioural",
    demand: "Low",
    coverage: 88,
    trainers: [
      { name: "Dr. Anjali Verma", match: 91, exp: "14 yrs", rating: 4.7 },
      { name: "Arun Desai", match: 73, exp: "6 yrs", rating: 4.1 },
    ],
  },
];

export const trainerMatching = [
  { request: "FIN-311 — Batch E (Sept)", skill: "Public Financial Management", trainer: "Sunita Rao", match: 98, availability: "Available", location: "New Delhi" },
  { request: "DATA-220 — Batch B (Sept)", skill: "Data Analytics", trainer: "Rakesh Nair", match: 89, availability: "Partially Booked", location: "Bengaluru" },
  { request: "RTI-090 — Batch F (Oct)", skill: "Legal & RTI Compliance", trainer: "Meera Iyer", match: 95, availability: "Available", location: "Mumbai" },
  { request: "LEAD-150 — Batch D (Sept)", skill: "Leadership", trainer: "Dr. Anjali Verma", match: 91, availability: "Booked", location: "New Delhi" },
];

export const reports = [
  { id: "RP-1", name: "Monthly Enrollment Summary", period: "Aug 2026", format: "PDF", generated: "20 Aug 2026", size: "1.4 MB" },
  { id: "RP-2", name: "Course Completion Analysis", period: "Q2 2026", format: "XLSX", generated: "12 Aug 2026", size: "3.1 MB" },
  { id: "RP-3", name: "Trainer Utilisation Report", period: "Aug 2026", format: "PDF", generated: "08 Aug 2026", size: "980 KB" },
  { id: "RP-4", name: "Certificate Issuance Register", period: "FY 2026-27", format: "CSV", generated: "01 Aug 2026", size: "2.2 MB" },
];

export const departmentPerformance = [
  { dept: "Rural Dev.", completion: 84 },
  { dept: "Health", completion: 91 },
  { dept: "Education", completion: 77 },
  { dept: "Revenue", completion: 62 },
  { dept: "Urban", completion: 71 },
  { dept: "Agriculture", completion: 68 },
];
