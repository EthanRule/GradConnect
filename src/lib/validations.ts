import { z } from "zod"

export const MAJOR_OPTIONS = [
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
] as const

export type Major = (typeof MAJOR_OPTIONS)[number]

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
] as const

export const profileSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  bio: z.string().max(500).optional(),
  major: z.string().min(1, "Major is required"),
  skills: z.array(z.string()).max(20),
  linkedin: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  github: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  twitter: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  website: z.string().url("Must be a valid URL").optional().or(z.literal("")),
})

export const groupSchema = z.object({
  name: z.string().min(1, "Group name is required").max(100),
  description: z.string().max(500).optional(),
  initialProjectIdea: z
    .string()
    .min(10, "Please describe your project idea (min 10 characters)")
    .max(1000),
  projectType: z.string().optional(),
  platform: z.enum(["DISCORD", "SLACK", "MICROSOFT_TEAMS", "WHATSAPP", "TELEGRAM"]),
  platformLink: z.string().url("Must be a valid URL").optional().or(z.literal("")),
})

export const ideaSchema = z.object({
  title: z.string().min(1, "Title is required").max(150),
  description: z.string().min(10, "Please describe the idea").max(1000),
})

export const signUpSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  email: z.string().email("Invalid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(100),
})

export const signInSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
})
