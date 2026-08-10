// Structured transcription of the printed CV (see PROJECT_HANDOFF.md for the
// source). Kept as a plain data module, not a content collection — this is
// one fixed page, not a repeatable content type.

export const contact = [
  { label: "Website", value: "www.Sorkhi.com", href: "https://www.sorkhi.com" },
  { label: "Phone", value: "+98 939 506 5181", href: "tel:+989395065181" },
  { label: "Mail", value: "SaSorkhi@gmail.com", href: "mailto:SaSorkhi@gmail.com" },
  { label: "Address", value: "Iran, Fars Province, Shiraz, Western AbuNasr St., 30 Falahat Lane" },
];

export type SocialPlatform =
  | "linkedin"
  | "behance"
  | "instagram"
  | "twitter"
  | "px500"
  | "dribbble";

export const social: { platform: SocialPlatform; handle: string; href: string }[] = [
  { platform: "linkedin", handle: "/Sorkhi", href: "https://www.linkedin.com/in/Sorkhi" },
  { platform: "px500", handle: "/Sorkhi", href: "https://500px.com/p/Sorkhi" },
  { platform: "behance", handle: "/Sorkhi", href: "https://www.behance.net/Sorkhi" },
  {
    platform: "instagram",
    handle: "/Sorkhi.Design",
    href: "https://www.instagram.com/Sorkhi.Design",
  },
  { platform: "dribbble", handle: "/Sorkhi", href: "https://dribbble.com/Sorkhi" },
  { platform: "twitter", handle: "/SaeidSorkhi", href: "https://twitter.com/SaeidSorkhi" },
];

export const education = [
  {
    degree: "M.A. in Visual Communication",
    school: "Tehran University of Art, Tehran, Iran",
    years: "2019–2023",
    detail: "CGPA 4.00/4.00 (18.08/20)",
    thesis: "Visual Culture and Identity of Everyday Urban Spaces – A Case Study of Tehran Cafes",
  },
  {
    degree: "B.S. in Architectural Design",
    school: "Shiraz University, Shiraz, Iran",
    years: "2014–2019",
    detail: "CGPA 3.46/4.00 (16.51/20)",
    thesis: "Renovation and Development Design of Cinema Farhang; Gerash",
  },
];

// Radar chart axes, in clockwise order starting at the top (matches the print CV).
export const specialities = [
  { label: "Research", value: 0.95 },
  { label: "Corporate Visual Identity Design", value: 0.85 },
  { label: "Logo Design", value: 0.9 },
  { label: "Layout Design", value: 0.6 },
  { label: "Poster Design", value: 0.7 },
  { label: "Computational Design", value: 0.35 },
  { label: "Data Visualization", value: 0.45 },
  { label: "Motion Graphics Design", value: 0.4 },
];

export const workBehavior = {
  type: "STABILIZER (SC)",
  traits: ["Conscientious", "Perceptive", "Calm"],
  source: "Crystal",
  summary:
    "Saeid is likely to seek order and stability over novelty or excitement. Methodical and " +
    "steady, he probably dislikes interruptions or distractions while at work and may be more " +
    "drawn to people who also value quality and high standards.",
};

export const hobbies = ["Cooking", "Photography", "Art Cinema", "Tech News", "Soccer"];

export const languages = [
  { name: "English", detail: "Professional working proficiency", level: 4.5, max: 5 },
  { name: "Persian", detail: "Native", level: 5, max: 5 },
];

export const ielts = { overall: 7, listening: 8, reading: 7.5, writing: 6.5, speaking: 6 };

// Soft-skills line/area chart, in print order.
export const softSkills = [
  { label: "Responsibility", value: 0.6 },
  { label: "Creativity", value: 0.85 },
  { label: "Teamwork", value: 0.55 },
  { label: "Communication", value: 0.3 },
  { label: "Logical Thinking", value: 0.85 },
];

export const workExperience = [
  { role: "Graphic Designer", org: "Freelancing", years: "2011–Present" },
  {
    role: "Graphic Designer and Motion Graphic Designer",
    org: "Ofoq Publishers",
    years: "Sept 2020–Apr 2022",
    detail: "Social Media, Visual Identity, Motion Graphic Design, Video Editing, UI Design",
  },
  {
    role: "Graphic Designer and Branding Consultant",
    org: "Agah Clinic",
    years: "Jan 2019–Mar 2020",
    detail:
      "Visual Corporate Identity Package, Social Media Branding, Workshop Posters, Stationery Design",
  },
  {
    role: "Motion Graphic Designer",
    org: "Cheshmeh Publication",
    years: "Sept 2019–Dec 2019",
    detail: "Motion Graphic Design, Social Media Visual Identity",
  },
  {
    role: "Media Assistant",
    org: "Student Cooperation Office",
    years: "Apr 2016–Jan 2017",
    detail: "Graphic Design, Videography",
  },
  { role: "Photojournalist", org: "7Berkeh Cultural Institute", years: "Jul 2012–Sept 2015" },
];

export const creativeStudios = [
  { role: "Art Director and Graphic Designer", org: "Bkhat Studio", years: "Apr 2017–Aug 2020" },
  {
    role: "Co-Founder and Graphic Designer",
    org: "ESM Graphic Studio",
    years: "Feb 2017–Aug 2020",
  },
];

export const membership = [
  {
    org: "Iranian Graphic Designers Society (IGDS)",
    sub: "International Council of Design (ico-D)",
    role: "Official Member",
    years: "Oct 2022–Present",
  },
  {
    org: "Gerash ICOMOS NGO (International Council on Monuments and Sites)",
    role: "Board Member & Head of Culture and Art Department",
    years: "Feb 2017–Feb 2019",
    extra: { role: "Active Member", years: "May 2014–Present" },
  },
  {
    org: "Nardeban Educational Development NGO",
    role: "Member of Founding Board",
    years: "Sep 2017–Present",
  },
];

export const tools = [
  "Adobe Photoshop",
  "Adobe Lightroom",
  "Adobe Illustrator",
  "AutoDesk AutoCAD",
  "Adobe Premiere Pro",
  "Microsoft Office",
  "Maxon Cinema 4D",
  "Figma",
  "Python Programming Language",
  "Adobe InDesign",
  "Tableau Software",
  "Adobe After Effects",
  "Webflow",
  "WordPress",
];

export const workshops = [
  {
    title: "Google UX Design Professional Certificate",
    org: "Google · Coursera",
    date: "May 2022",
  },
  {
    title: 'International Graphic Design Symposium in Shiraz — "On the Identity in Graphic Design"',
    org: "Lucerne University of Applied Sciences and Arts + Iran Graphic Design Academy",
    detail: "In the presence of Niklaus Troxler",
    date: "Apr 2018, Shiraz, Iran",
  },
  {
    title: "Methods and Statistics in Social Sciences Specialization (Basic Statistics)",
    org: "University of Amsterdam · Coursera",
    date: "May 2022",
  },
  {
    title: "Programming for Everybody (Getting Started with Python, Data Structures)",
    org: "University of Michigan · Coursera",
    date: "May 2022",
  },
  {
    title: "Introduction to Augmented Reality and ARCore",
    org: "Google · Coursera",
    date: "Aug 2022",
  },
  {
    title: "Seminar and Specialized Workshop on Persian Typeface Design Basics",
    org: "Reza Bakhtiarifard · Shiraz University International Division",
    date: "Jan–Feb 2019, Shiraz, Iran",
  },
];
