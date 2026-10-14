export const brand = "Soccer USA News";
export const absolute = (path: string, site: URL) => new URL(path, site).href;
export function breadcrumbs(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((i, n) => ({
      "@type": "ListItem",
      position: n + 1,
      name: i.name,
      item: i.url,
    })),
  };
}
