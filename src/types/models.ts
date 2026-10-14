export type Category = "MLS" | "USMNT" | "Guides";
export type Conference = "Eastern" | "Western";
export interface Team {
  id: string;
  slug: string;
  name: string;
  location: string;
  conference: Conference;
  abbreviation: string;
  color: string;
  description: string;
}
export interface Article {
  id: string;
  slug: string;
  title: string;
  category: Category;
  excerpt: string;
  author: string;
  publishedAt: string;
  updatedAt: string | null;
  readingTime: number;
  featured: boolean;
  image: string;
  imageAlt: string;
  teamIds: string[];
  intro: string;
  sections: {
    id: string;
    heading: string;
    text: string;
    subheading?: string;
    detail?: string;
  }[];
  sources: { label: string; url: string }[];
  demo: boolean;
}
export interface Match {
  id: string;
  homeTeamId: string;
  awayTeamId: string;
  date: string;
  status: "finished" | "scheduled";
  homeScore: number | null;
  awayScore: number | null;
  competition: string;
  demo: boolean;
}
export interface Standing {
  teamId: string;
  conference: Conference;
  position: number;
  played: number;
  wins: number;
  draws: number;
  losses: number;
  goalDifference: number;
  points: number;
}
