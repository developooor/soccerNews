import articlesData from "../../data/mocks/articles.json";
import teamsData from "../../data/mocks/teams.json";
import matchesData from "../../data/mocks/matches.json";
import standingsData from "../../data/mocks/standings.json";
import type {
  Article,
  Team,
  Match,
  Standing,
  Category,
  Conference,
} from "../../types/models";
const articles = articlesData as Article[],
  teams = teamsData as Team[],
  matches = matchesData as Match[],
  standings = standingsData as Standing[];
export async function getLatestArticles(limit = 20) {
  return articles
    .filter((a) => a.category !== "Guides")
    .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt))
    .slice(0, limit);
}
export async function getFeaturedArticles() {
  return articles.filter((a) => a.featured);
}
export async function getArticleBySlug(slug: string) {
  return articles.find((a) => a.slug === slug);
}
export async function getAllArticles() {
  return articles;
}
export async function getArticlesByCategory(category: Category) {
  return articles.filter((a) => a.category === category);
}
export async function getTeams() {
  return teams;
}
export async function getTeamBySlug(slug: string) {
  return teams.find((t) => t.slug === slug);
}
export async function getTeamById(id: string) {
  return teams.find((t) => t.id === id);
}
export async function getUpcomingMatches(competition?: "MLS" | "USMNT") {
  return matches
    .filter(
      (m) =>
        m.status === "scheduled" &&
        (!competition || m.competition.startsWith(competition)),
    )
    .sort((a, b) => a.date.localeCompare(b.date));
}
export async function getRecentResults(competition?: "MLS" | "USMNT") {
  return matches
    .filter(
      (m) =>
        m.status === "finished" &&
        (!competition || m.competition.startsWith(competition)),
    )
    .sort((a, b) => b.date.localeCompare(a.date));
}
export async function getStandings(conference: Conference) {
  return standings.filter((s) => s.conference === conference);
}

export const hasDemoContent =
  articles.some((article) => article.demo) ||
  matches.some((match) => match.demo);
