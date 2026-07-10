export interface Profile {
  id: number;
  name: string;
  shortName: string;
  headerName: string;
  terminalPrompt: string;
  terminalUser: string;
  tagline: string;
  bio: string;
  about: string;
  corePrinciples: string;
  statusLabel: string;
  profileImage: string;
  aboutImage: string;
  github: string;
  linkedin: string;
  twitter: string;
  email: string;
  footerText: string;
  resumeUrl: string;
  resumeFile: string;
}

export interface Role {
  id: number;
  title: string;
  sortOrder: number;
}

export interface Project {
  id: number;
  title: string;
  category: string;
  description: string;
  longDescription: string;
  stack: string;
  terminalType: string;
  terminalDesc: string;
  terminalScript: string;
  tags: string;
  image: string;
  liveUrl: string;
  sourceUrl: string;
  gridSpan: string;
  featured: number;
  sortOrder: number;
  status: string;
}

export interface Skill {
  id: number;
  name: string;
  icon: string;
  percent: number;
  level: string;
  category: string;
  sortOrder: number;
}

export interface Education {
  id: number;
  institution: string;
  degree: string;
  field: string;
  startDate: string;
  endDate: string;
  description: string;
  sortOrder: number;
}

export interface Certificate {
  id: number;
  name: string;
  issuer: string;
  date: string;
  url: string;
  image: string;
  sortOrder: number;
}

export interface Review {
  id: number;
  clientName: string;
  company: string;
  rating: number;
  text: string;
  date: string;
  sortOrder: number;
}

export interface TerminalInfo {
  id: number;
  key: string;
  label: string;
  value: string;
  sortOrder: number;
}
