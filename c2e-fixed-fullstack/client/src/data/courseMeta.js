// ======================================================================
// DEPARTMENT THEMES
// ======================================================================
//
// Shared visual configuration for department cards.
//
// ======================================================================

const DEFAULT_THEME = Object.freeze({
  iconGradient: "from-indigo-600 to-pink-700",
  badgeBg: "bg-amber-400",
  badgeText: "text-slate-900",
});


export const DEPARTMENT_THEMES = Object.freeze({
  "Computer Science": DEFAULT_THEME,

  "Mechanical Engineering": DEFAULT_THEME,

  "Civil Engineering": DEFAULT_THEME,

  "Electronics and Communication": DEFAULT_THEME,

  "Non-Technical": DEFAULT_THEME,
});


// ======================================================================
// DEPARTMENT THEME HELPER
// ======================================================================

export const getDepartmentTheme = (department) => {
  return (
    DEPARTMENT_THEMES[department] ||
    DEFAULT_THEME
  );
};


// ======================================================================
// COURSE META FACTORY
// ======================================================================
//
// Keeps the repeated visual properties consistent across courses.
//
// ======================================================================

const createCourseMeta = ({
  badge = "Featured",
  duration = "8 Weeks",
  level = "Beginner",
  type = "Theory & Lab",
  topics = [],
} = {}) => ({
  badge,
  badgeBg: "bg-amber-400",
  badgeText: "text-slate-900",
  iconGradient: "from-indigo-600 to-pink-700",
  duration,
  level,
  type,
  topics,
});


// ======================================================================
// COURSE METADATA
// ======================================================================

export const COURSE_META = Object.freeze({

  // --------------------------------------------------------------------
  // ELECTRONICS & COMMUNICATION
  // --------------------------------------------------------------------

  "Wireless and Communication System Software": createCourseMeta({
    badge: "Advanced Track",
    duration: "12 Weeks",
    level: "Professional",
    type: "Hands-on Lab",
    topics: [
      "5G & LTE Protocol Stack Design",
      "MATLAB & Python System Simulation",
      "Software-Defined Radio (SDR)",
    ],
  }),

  "Embedded Systems and IoT Software": createCourseMeta({
    badge: "Intermediate Track",
    duration: "10 Weeks",
    level: "Intermediate",
    type: "Hands-on Project",
    topics: [
      "IoT Sensor Networks",
      "Embedded C Programming",
      "PCB Design & Prototyping",
      "Real-time Operating Systems (RTOS)",
    ],
  }),

  "Industrial Automation and Robotic Software": createCourseMeta({
    badge: "Advanced Track",
    duration: "12 Weeks",
    level: "Advanced",
    type: "Hands-on Lab",
    topics: [
      "PLC Programming (Ladder Logic)",
      "ROS (Robot Operating System)",
      "SCADA Systems",
      "Industrial IoT Integration",
    ],
  }),


  // --------------------------------------------------------------------
  // WEB DEVELOPMENT
  // --------------------------------------------------------------------

  "Web Development": createCourseMeta({
    badge: "Foundational",
    duration: "8 Weeks",
    level: "Beginner",
    type: "Hands-on Lab",
    topics: [
      "HTML, CSS, JavaScript",
      "React.js",
      "RESTful APIs",
      "Deployment",
    ],
  }),

  "MERN Stack Development": createCourseMeta({
    badge: "Full Stack",
    duration: "12 Weeks",
    level: "Intermediate",
    type: "Project-Based",
    topics: [
      "MongoDB",
      "Express.js",
      "React.js",
      "Node.js",
    ],
  }),

  // Keep this only if this is actually a separate MongoDB course title.
  "MERN Stack Development (MERN)": createCourseMeta({
    badge: "Full Stack",
    duration: "12 Weeks",
    level: "Intermediate",
    type: "Project-Based",
    topics: [
      "MongoDB",
      "Express.js",
      "React.js",
      "Node.js",
    ],
  }),


  // --------------------------------------------------------------------
  // AI / MACHINE LEARNING
  // --------------------------------------------------------------------

  "AI Agents (Agentic AI)": createCourseMeta({
    badge: "Cutting Edge",
    duration: "10 Weeks",
    level: "Advanced",
    type: "Research Lab",
    topics: [
      "Agent Frameworks",
      "LLM Orchestration",
      "Planning & Execution",
      "Multi-agent Systems",
    ],
  }),

  "Machine Learning": createCourseMeta({
    badge: "Popular",
    duration: "10 Weeks",
    level: "Intermediate",
    type: "Hands-on Lab",
    topics: [
      "Supervised Learning",
      "Neural Networks",
      "Scikit-learn",
      "Model Deployment",
    ],
  }),


  // --------------------------------------------------------------------
  // PYTHON
  // --------------------------------------------------------------------

  "Full Stack Python Development": createCourseMeta({
    badge: "Full Stack",
    duration: "12 Weeks",
    level: "Intermediate",
    type: "Project-Based",
    topics: [
      "Flask/Django",
      "SQLAlchemy",
      "React/Vue",
      "Docker & CI/CD",
    ],
  }),

  "Python Full Stack (Flask & Django)": createCourseMeta({
    badge: "Full Stack",
    duration: "12 Weeks",
    level: "Intermediate",
    type: "Project-Based",
    topics: [
      "Flask & Django",
      "SQL & ORM",
      "React Frontend",
      "Deployment & DevOps",
    ],
  }),


  // --------------------------------------------------------------------
  // DATA
  // --------------------------------------------------------------------

  "Data Science": createCourseMeta({
    badge: "Popular",
    duration: "10 Weeks",
    level: "Intermediate",
    type: "Hands-on Lab",
    topics: [
      "Pandas & NumPy",
      "Data Visualization",
      "Statistics",
      "ML Pipelines",
    ],
  }),


  // --------------------------------------------------------------------
  // DEVOPS
  // --------------------------------------------------------------------

  "DevOps": createCourseMeta({
    badge: "DevOps",
    duration: "10 Weeks",
    level: "Intermediate",
    type: "Hands-on Lab",
    topics: [
      "CI/CD Pipeline (Jenkins)",
      "Docker Containerization",
      "Kubernetes Orchestration",
      "Infrastructure as Code",
    ],
  }),


  // --------------------------------------------------------------------
  // CLOUD
  // --------------------------------------------------------------------

  "Cloud Computing": createCourseMeta({
    badge: "Cloud",
    duration: "8 Weeks",
    level: "Intermediate",
    type: "Hands-on Lab",
    topics: [
      "AWS/Azure/GCP Fundamentals",
      "Serverless Architecture",
      "Cloud Security",
      "Cost Optimization",
    ],
  }),


  // --------------------------------------------------------------------
  // NON-TECHNICAL
  // --------------------------------------------------------------------

  "Aptitude and Soft Skills Program": createCourseMeta({
    badge: "Popular",
    duration: "6 Weeks",
    level: "All Levels",
    type: "Workshop",
    topics: [
      "Quantitative Aptitude",
      "Logical Reasoning",
      "Communication Skills",
      "Interview Preparation",
      "Resume & Portfolio",
    ],
  }),
});


// ======================================================================
// DEFAULT COURSE META
// ======================================================================

export const defaultMeta = createCourseMeta({
  badge: "Featured",
  duration: "8 Weeks",
  level: "Beginner",
  type: "Theory & Lab",
  topics: [],
});


// ======================================================================
// COURSE META HELPER
// ======================================================================

export const getCourseMeta = (title) => {
  if (!title) {
    return defaultMeta;
  }

  return COURSE_META[title] || defaultMeta;
};


// ======================================================================
// OPTIONAL: CHECK WHETHER CUSTOM META EXISTS
// ======================================================================

export const hasCourseMeta = (title) => {
  return Boolean(title && COURSE_META[title]);
};