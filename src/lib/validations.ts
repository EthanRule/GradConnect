import { z } from "zod";

export const FIELD_OPTIONS = [
  // ── Trades & Vocational ──────────────────────────────────────────────────
  "Auto / Diesel Mechanics",
  "Aviation / Avionics",
  "Carpentry / Woodworking",
  "CNC Machining",
  "Construction Management",
  "Cosmetology / Esthetics",
  "Culinary Arts / Food Service",
  "Cybersecurity (Vocational)",
  "Electrical Trade",
  "HVAC / Refrigeration",
  "Masonry / Concrete",
  "Network / IT Support",
  "Plumbing",
  "Solar / Renewable Energy Tech",
  "Welding / Fabrication",
  // ── Academic / Professional ──────────────────────────────────────────────
  "Accounting",
  "Aerospace Engineering",
  "Architecture",
  "Biology",
  "Business Administration",
  "Chemical Engineering",
  "Chemistry",
  "Civil Engineering",
  "Communications",
  "Computer Engineering",
  "Computer Science",
  "Criminal Justice",
  "Data Science",
  "Economics",
  "Education",
  "Electrical Engineering",
  "Environmental Science",
  "Finance",
  "Graphic Design",
  "Health Sciences",
  "History",
  "Human Resources",
  "Information Technology",
  "Journalism",
  "Kinesiology",
  "Law",
  "Liberal Arts",
  "Marketing",
  "Mathematics",
  "Mechanical Engineering",
  "Medicine / Pre-Med",
  "Nursing",
  "Philosophy",
  "Physics",
  "Political Science",
  "Psychology",
  "Public Health",
  "Social Work",
  "Sociology",
  "Software Engineering",
  "Statistics",
  "Supply Chain / Logistics",
  "UX / Product Design",
  "Other",
] as const;

/** @deprecated use FIELD_OPTIONS */
export const MAJOR_OPTIONS = FIELD_OPTIONS;

export type FieldOption = (typeof FIELD_OPTIONS)[number];
/** @deprecated use FieldOption */
export type Major = FieldOption;

export const AI_USAGE_OPTIONS = [
  { value: "AI", label: "AI — We lean heavily on AI tools" },
  { value: "AI_HYBRID", label: "AI Hybrid — Mix of AI and manual work" },
  { value: "NO_AI", label: "No AI — Building it ourselves" },
] as const;

export type AiUsage = (typeof AI_USAGE_OPTIONS)[number]["value"];

export const PROJECT_TYPES = [
  "SaaS",
  "Mobile App",
  "AI Tool",
  "Marketplace",
  "Social Platform",
  "E-commerce",
  "Developer Tool",
  "Hardware / IoT",
  "Non-profit / Social Good",
  "Other",
] as const;

export const profileSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  bio: z.string().max(500).optional(),
  major: z.string().min(1, "Field / trade is required"),
  skills: z.array(z.string()).max(20),
  linkedin: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  github: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  twitter: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  website: z.string().url("Must be a valid URL").optional().or(z.literal("")),
});

export const groupSchema = z.object({
  name: z.string().min(1, "Group name is required").max(100),
  description: z.string().max(500).optional(),
  initialProjectIdea: z
    .string()
    .min(10, "Please describe your project idea (min 10 characters)")
    .max(1000),
  projectType: z.string().optional(),
  platform: z.enum([
    "DISCORD",
    "SLACK",
    "MICROSOFT_TEAMS",
    "WHATSAPP",
    "TELEGRAM",
  ]),
  platformLink: z
    .string()
    .url("Must be a valid URL")
    .optional()
    .or(z.literal("")),
  lookingForMajors: z.array(z.string()).max(20).optional(),
  aiUsage: z.enum(["AI", "AI_HYBRID", "NO_AI"]).optional(),
  githubRepo: z
    .string()
    .url("Must be a valid URL")
    .optional()
    .or(z.literal("")),
});

export const ideaSchema = z.object({
  title: z.string().min(1, "Title is required").max(150),
  description: z.string().min(10, "Please describe the idea").max(1000),
});

export const signUpSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  email: z.string().email("Invalid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(100),
});

export const signInSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});
