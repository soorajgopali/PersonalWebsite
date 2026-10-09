export const personalInfo = {
  name: "Suraj Gopali",
  firstName: "Suraj",
  title: ".NET Developer",
  tagline: "Designing reliable web applications, APIs, and business systems that help teams move faster and work smarter.",
  summary:
    "I’m a .NET developer focused on building reliable web applications and backend systems that support real business operations. With experience in ASP.NET Core, C#, Entity Framework, SQL Server, AngularJS, and REST APIs, I create maintainable solutions for service management, insurance platforms, and internal business tools. I enjoy turning complex requirements into practical, high-performing software that is easy to extend, secure, and maintain.",
  location: "Kathmandu, Nepal",
  email: "surajgopali100@gmail.com",
  phone: "+977 9819258423",
  github: "https://github.com/soorajgopali",
  linkedin: null,
  cvPath: "/Suraj_GopaliCV.pdf",
  availableForWork: true,
  // Replace this image with your actual profile photo
  // To use your own photo: place it at public/images/profile.jpg
  profileImage: "/images/profile.jpg",
};

export interface Experience {
  id: string;
  company: string;
  location: string;
  period: string;
  projects: Project[];
}

export interface Project {
  name: string;
  description: string;
  responsibilities: string[];
  technologies: string[];
  github?: string;
  demo?: string;
  featured?: boolean;
}

export const experiences: Experience[] = [
  {
    id: "neo-assure",
    company: "Neo Assure",
    location: "Lalitpur, Nepal",
    period: "2024 — Present",
    projects: [
      {
        name: "Beemagojima",
        description: "Online insurance platform for motor and travel policies built to support streamlined customer transactions.",
        responsibilities: [
          "Developed backend services using ASP.NET Core and Entity Framework for core insurance workflows",
          "Integrated RESTful APIs to support secure client-server communication and policy operations",
        ],
        technologies: ["ASP.NET Core", "C#", "Entity Framework", "SQL Server", "AngularJS", "REST APIs"],
      },
      {
        name: "Neo CRM Service",
        description: "CRM platform for service center operations, job tracking, and business process management.",
        responsibilities: [
          "Implemented job tracking and quotation workflows to improve service center operations",
          "Built filtering and search features to make customer and job data easier to manage",
          "Designed RESTful APIs and database logic to support efficient operational workflows",
        ],
        technologies: ["ASP.NET Core", "C#", "Entity Framework", "SQL Server", "REST APIs"],
      },
      {
        name: "NeoAssure B2B Portal",
        description: "Policy management portal built with CQRS architecture for insurance operations across multiple product lines.",
        responsibilities: [
          "Developed a scalable policy management portal using CQRS patterns for modular business logic",
          "Implemented insurance modules for policy workflows across multiple coverage types",
        ],
        technologies: ["ASP.NET Core", "C#", "Entity Framework", "SQL Server", "REST APIs", "CQRS"],
      },
    ],
  },
];

export const personalProjects: Project[] = [
  {
    name: "EMart",
    description:
      "A dynamic football jersey e-commerce website built to deliver a smooth product browsing and purchasing experience.",
    responsibilities: [
      "Built a responsive e-commerce platform using .NET and jQuery for product browsing and ordering",
      "Designed an engaging storefront experience to make product discovery and purchase simpler for users",
    ],
    technologies: [".NET", "jQuery", "HTML", "CSS", "SQL"],
    github: "https://github.com/soorajgopali/EMart",
    featured: true,
  },
];

export interface SkillCategory {
  id: string;
  title: string;
  skills: Skill[];
}

export interface Skill {
  name: string;
  related?: string[];
}

export const skillCategories: SkillCategory[] = [
  {
    id: "languages",
    title: "Languages",
    skills: [
      { name: "C#", related: [".NET", "ASP.NET Core", "Entity Framework"] },
      { name: "SQL", related: ["SQL Server", "MySQL"] },
      { name: "JavaScript", related: ["jQuery", "AngularJS"] },
      { name: "HTML/CSS" },
      { name: "C/C++" },
    ],
  },
  {
    id: "frameworks",
    title: "Frameworks",
    skills: [
      { name: "ASP.NET Core", related: ["C#", "Entity Framework", "REST APIs"] },
      { name: "Entity Framework", related: ["C#", "SQL Server"] },
      { name: "AngularJS", related: ["JavaScript"] },
      { name: "jQuery", related: ["JavaScript"] },
    ],
  },
  {
    id: "databases",
    title: "Databases",
    skills: [
      { name: "SQL Server", related: ["C#", "Entity Framework"] },
      { name: "MySQL", related: ["SQL"] },
    ],
  },
  {
    id: "tools",
    title: "Tools",
    skills: [
      { name: "Git" },
      { name: "GitHub" },
      { name: "IIS" },
      { name: "Visual Studio" },
    ],
  },
];

export interface Education {
  id: string;
  institution: string;
  degree: string;
  period: string;
  grade?: string;
  location?: string;
}

export const education: Education[] = [
  {
    id: "everest",
    institution: "Everest Innovative College",
    degree: "Bachelor of Computer Application (BCA)",
    period: "2019 — 2023",
  },
];

export const navLinks = [
  { label: "Home", href: "#home" },
  { label: "About", href: "#about" },
  { label: "Skills", href: "#skills" },
  { label: "Experience", href: "#experience" },
  { label: "Projects", href: "#projects" },
  { label: "Education", href: "#education" },
  { label: "Contact", href: "#contact" },
];
