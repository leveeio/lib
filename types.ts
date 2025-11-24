export enum AppView {
  HOME = 'HOME',
  THOUGHT_INPUT = 'THOUGHT_INPUT',
  RECOMMENDATION = 'RECOMMENDATION',
  GALAXY = 'GALAXY',
  AUTHOR_DETAIL = 'AUTHOR_DETAIL',
  READING = 'READING'
}

export type Language = 'en' | 'zh';

export interface Book {
  title: string;
  author: string;
  year?: string;
  description: string;
  reason: string;
}

export interface Author {
  id: string;
  name: string;
  nameZh?: string; // Optional Chinese name for static data
  period: string; // e.g., "Romanticism", "Modernism"
  periodZh?: string;
  style: string;
  styleZh?: string;
  famousWork: string;
  famousWorkZh?: string;
  description?: string; // Short bio
  x: number; // For galaxy positioning
  y: number;
  z: number;
}

export interface GalaxyCluster {
  name: string;
  nameZh?: string;
  authors: Author[];
  color: string;
}

export interface GeneratedContent {
  title: string;
  content: string;
}
