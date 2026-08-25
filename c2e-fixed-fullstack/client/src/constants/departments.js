// ======================================================================
// DEPARTMENTS
// ======================================================================
//
// Single source of truth for departments used throughout Connect2EdTech.
//
// IMPORTANT:
// `value` MUST exactly match the `department` enum stored in:
// server/models/Course.js
//
// `slug` is used for frontend routing.
// `label` is used for UI display.
// `value` is used when communicating with the backend/API.
//
// ======================================================================

export const DEPARTMENTS = Object.freeze([
  {
    slug: "computer-science",
    value: "Computer Science",
    label: "Computer Science",

    eyebrow: "Full Stack Web Development",

    subtitle:
      "Industry-relevant programming, cloud, AI, and full-stack courses to build future-ready developers.",
  },

  {
    slug: "mechanical-engineering",
    value: "Mechanical Engineering",
    label: "Mechanical Engineering",

    eyebrow: "Design, Simulation & Manufacturing",

    subtitle:
      "Industry-grade CAD, CAE, manufacturing, and Industry 4.0 training programs.",
  },

  {
    slug: "civil-engineering",
    value: "Civil Engineering",
    label: "Civil Engineering",

    eyebrow: "Design, Drafting & Construction",

    subtitle:
      "Structural, estimation, GIS, and construction management software training.",
  },

  {
    slug: "electronics-communication",
    value: "Electronics and Communication",
    label: "Electronics & Communication",

    eyebrow: "Signals, Automation & Embedded Systems",

    subtitle:
      "Hands-on training in embedded systems, automation, robotics, and communication systems.",
  },

  {
    slug: "non-technical",
    value: "Non-Technical",
    label: "Non-Technical",

    eyebrow: "Data Science & Analytics",

    subtitle:
      "Analyst, HR, marketing, and supply-chain training for career-ready, non-technical roles.",
  },
]);


// ======================================================================
// DEPARTMENT LOOKUP
// ======================================================================

export const getDepartmentBySlug = (slug) => {
  if (!slug) {
    return undefined;
  }

  return DEPARTMENTS.find(
    (department) => department.slug === slug
  );
};


// ======================================================================
// TECHNICAL DEPARTMENTS
// ======================================================================
//
// Non-Technical has its own dedicated catalog.
//
// ======================================================================

export const TECHNICAL_DEPARTMENTS = Object.freeze(
  DEPARTMENTS.filter(
    (department) => department.slug !== "non-technical"
  )
);


// ======================================================================
// NON-TECHNICAL DEPARTMENT
// ======================================================================

export const NON_TECHNICAL_DEPARTMENT =
  getDepartmentBySlug("non-technical");


// ======================================================================
// DEPARTMENT VALUES
// ======================================================================
//
// Useful when populating dropdowns or validating API data.
//
// ======================================================================

export const DEPARTMENT_VALUES = Object.freeze(
  DEPARTMENTS.map(
    (department) => department.value
  )
);


// ======================================================================
// DEPARTMENT SLUGS
// ======================================================================

export const DEPARTMENT_SLUGS = Object.freeze(
  DEPARTMENTS.map(
    (department) => department.slug
  )
);


// ======================================================================
// VALIDATION HELPERS
// ======================================================================

export const isValidDepartmentSlug = (slug) => {
  return Boolean(
    getDepartmentBySlug(slug)
  );
};


export const isValidDepartmentValue = (value) => {
  return DEPARTMENT_VALUES.includes(value);
};