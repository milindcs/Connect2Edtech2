/**
 * Master list of training programs, grouped by department.
 * Consumed by seed/seedCourses.js to populate the Course collection.
 *
 * `category` follows the existing technical / non-technical split used by
 * the old homepage sections; `department` is the new, finer-grained
 * grouping used for department pages and the homepage preview grids.
 */

const CS = 'Computer Science';
const MECH = 'Mechanical Engineering';
const CIVIL = 'Civil Engineering';
const EC = 'Electronics and Communication';
const NON_TECH = 'Non-Technical';

const technical = (title, department, description) => ({
  title,
  department,
  category: department === NON_TECH ? 'non-technical' : 'technical',
  description,
});

const coursesData = [
  // ---------------- Computer Science (CS) ----------------
  technical('Cybersecurity', CS, 'Learn to defend networks, systems, and data against real-world cyber threats.'),
  technical('Python Programming', CS, 'Build a strong foundation in Python for scripting, automation, and app development.'),
  technical('Java Programming', CS, 'Master core and advanced Java concepts used in enterprise-grade applications.'),
  technical('C++ Programming', CS, 'Develop strong programming fundamentals with high-performance C++ concepts.'),
  technical('JavaScript Programming', CS, 'Learn the language that powers modern, interactive web experiences.'),
  technical('MERN Stack Development', CS, 'Build full-stack web apps with MongoDB, Express, React, and Node.js.'),
  technical('MEAN Stack Development', CS, 'Build full-stack web apps with MongoDB, Express, Angular, and Node.js.'),
  technical('Full Stack Java Development', CS, 'Combine Java back-end skills with modern front-end frameworks.'),
  technical('Full Stack Python Development', CS, 'Combine Python back-end skills with modern front-end frameworks.'),
  technical('Python Full Stack (Flask & Django)', CS, 'Build complete web applications using Flask and Django frameworks.'),
  technical('Cloud Computing', CS, 'Understand cloud fundamentals, deployment models, and service architectures.'),
  technical('AWS Cloud', CS, 'Get hands-on with Amazon Web Services for scalable cloud deployments.'),
  technical('Microsoft Azure', CS, 'Learn to design, deploy, and manage solutions on Microsoft Azure.'),
  technical('Google Cloud Platform (GCP)', CS, 'Build and manage cloud-native applications on Google Cloud Platform.'),
  technical('DevOps', CS, 'Bridge development and operations with CI/CD pipelines and automation.'),
  technical('Docker', CS, 'Containerize applications for consistent, portable deployments.'),
  technical('Kubernetes', CS, 'Orchestrate, scale, and manage containerized applications with confidence.'),
  technical('Jenkins', CS, 'Automate build, test, and deployment pipelines with Jenkins.'),
  technical('Git & GitHub', CS, 'Master version control and collaborative workflows for every project.'),
  technical('Linux Administration', CS, 'Learn to install, configure, and manage Linux-based servers.'),
  technical('Data Structures and Algorithms (DSA)', CS, 'Sharpen problem-solving skills for coding interviews and beyond.'),
  technical('SQL & Database Management', CS, 'Design, query, and manage relational databases with confidence.'),
  technical('Big Data', CS, 'Process and analyze massive datasets with industry-standard big data tools.'),
  technical('Data Science', CS, 'Turn raw data into actionable insights using statistics and programming.'),
  technical('Machine Learning', CS, 'Build predictive models that learn from data and improve over time.'),
  technical('Deep Learning', CS, 'Explore neural networks that power modern AI breakthroughs.'),
  technical('Artificial Intelligence (AI)', CS, 'Understand the core concepts and applications shaping modern AI.'),
  technical('Generative AI', CS, 'Learn to build with models that create text, images, and more.'),
  technical('Prompt Engineering', CS, 'Craft effective prompts to get the best results from AI models.'),
  technical('AI Agents (Agentic AI)', CS, 'Design autonomous AI agents that plan, reason, and take action.'),
  technical('Retrieval-Augmented Generation (RAG)', CS, 'Combine LLMs with external knowledge sources for accurate answers.'),
  technical('Natural Language Processing (NLP)', CS, 'Teach machines to understand, process, and generate human language.'),
  technical('Computer Vision', CS, 'Enable machines to interpret and understand visual information.'),
  technical('API Development & Testing', CS, 'Design, build, and test robust APIs for real-world applications.'),
  technical('Software Testing (Manual & Automation)', CS, 'Learn manual and automated testing to deliver reliable software.'),
  technical('UI/UX Design', CS, 'Design intuitive, user-centered digital products and experiences.'),
  technical('Web Development', CS, 'Build responsive, modern websites from front-end to back-end.'),
  technical('Mobile App Development (Android/Flutter)', CS, 'Create cross-platform mobile apps with Android and Flutter.'),
  technical('Internet of Things (IoT)', CS, 'Connect and program smart devices for real-world IoT solutions.'),
  technical('Blockchain Development', CS, 'Learn to build decentralized applications and smart contracts.'),

  // ---------------- Mechanical Engineering ----------------
  technical('Mechanical Simulation and Analysis Software', MECH, 'Simulate and validate mechanical designs before they reach production.'),
  technical('Manufacturing and CAM Software', MECH, 'Master computer-aided manufacturing tools used in modern production.'),
  technical('HVAC and Energy System Software', MECH, 'Design and analyze efficient heating, ventilation, and energy systems.'),
  technical('Mechanical Design and CAD/CAE Training Program', MECH, 'Build industry-ready skills in mechanical design, CAD, and CAE tools.'),
  technical('Analytics and Industry 4.0 Tools', MECH, 'Apply data analytics and smart-manufacturing tools across the shop floor.'),

  // ---------------- Civil Engineering ----------------
  technical('Design and Drafting Software', CIVIL, 'Create precise architectural and civil drawings with industry-standard tools.'),
  technical('Estimation and Analytics Tools', CIVIL, 'Accurately estimate costs and analyze data for construction projects.'),
  technical('Environmental and Sustainability Program', CIVIL, 'Build sustainable, environmentally responsible engineering solutions.'),
  technical('Structural Analysis and Design Software', CIVIL, 'Analyze and design safe, efficient structural systems.'),
  technical('Construction Project Management Software', CIVIL, 'Plan, schedule, and manage construction projects end-to-end.'),
  technical('Surveying and GIS Software', CIVIL, 'Map, survey, and analyze land data using modern GIS tools.'),

  // ---------------- Non-Technical ----------------
  technical('Marketing Analyst Training', NON_TECH, 'Turn marketing data into strategies that drive real business growth.'),
  technical('HR Analytics Training', NON_TECH, 'Use people data to make smarter, evidence-based HR decisions.'),
  technical('Business Analytics Training', NON_TECH, 'Apply data-driven thinking to solve real business problems.'),
  technical('Supply Chain Management Training', NON_TECH, 'Understand end-to-end supply chain planning and operations.'),
  technical('Aptitude and Soft Skills Program', NON_TECH, 'Build the aptitude and soft skills employers look for most.'),

  // ---------------- Electronics and Communication (EC/ECE) ----------------
  technical('Signal and Data Analytics Software', EC, 'Analyze signals and data using industry-standard EC tools.'),
  technical('Industrial Automation and Robotic Software', EC, 'Design and program automation and robotics solutions for industry.'),
  technical('Embedded Systems and IoT Software', EC, 'Build embedded systems and connected IoT devices from the ground up.'),
  technical('Wireless and Communication System Software', EC, 'Design and simulate modern wireless and communication systems.'),
];

module.exports = { coursesData, DEPARTMENTS: [CS, MECH, CIVIL, EC, NON_TECH] };
