import type { Profile } from "@garden/content-schema";

export const PRODUCTION_ORIGIN = "https://www.salmanasif.pro";

export function siteOrigin(site?: URL | string | null) {
  try {
    return new URL(site || PRODUCTION_ORIGIN).origin;
  } catch {
    return PRODUCTION_ORIGIN;
  }
}

export function absoluteUrl(path: string, origin: string) {
  return new URL(path, origin).href;
}

export function ogImageUrl(origin: string) {
  return absoluteUrl("/og.jpg", origin);
}

export function personImageUrl(origin: string) {
  return absoluteUrl("/portrait.jpg", origin);
}

function normalizePath(pathname: string) {
  const path = pathname.replace(/\/$/, "") || "/";
  return path.startsWith("/") ? path : `/${path}`;
}

function personId(origin: string) {
  return `${origin}/#person`;
}

function pageType(
  pathname: string,
  article?: boolean,
):
  | "ProfilePage"
  | "AboutPage"
  | "ContactPage"
  | "CollectionPage"
  | "CreativeWork"
  | "BlogPosting"
  | "WebPage" {
  const path = normalizePath(pathname);
  if (article || /^\/writing\/.+/.test(path)) return "BlogPosting";
  if (/^\/work\/.+/.test(path)) return "CreativeWork";
  if (path === "/") return "ProfilePage";
  if (path === "/about") return "AboutPage";
  if (path === "/contact") return "ContactPage";
  if (path === "/work" || path === "/writing") return "CollectionPage";
  return "WebPage";
}

function breadcrumbs(
  origin: string,
  pathname: string,
  leaf: string,
  article?: boolean,
) {
  const path = normalizePath(pathname);
  const items: { name: string; path: string }[] = [{ name: "Home", path: "/" }];
  if (path.startsWith("/work")) items.push({ name: "Work", path: "/work" });
  if (path.startsWith("/writing") || article)
    items.push({ name: "Writing", path: "/writing" });
  if (path !== "/" && path !== "/work" && path !== "/writing")
    items.push({ name: leaf, path });
  if (items.length < 2) return null;
  return {
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path, origin),
    })),
  };
}

export function schemaGraph(input: {
  origin: string;
  pathname: string;
  title: string;
  description: string;
  profile: Profile;
  article?: boolean;
  post?: {
    headline: string;
    description: string;
    datePublished: string;
    path: string;
  };
  work?: { name: string; description: string; path: string };
}): { "@context": string; "@graph": Record<string, unknown>[] } {
  const origin = siteOrigin(input.origin);
  const path = normalizePath(input.pathname);
  const url = absoluteUrl(path, origin);
  const type = pageType(path, input.article);
  const person = personId(origin);
  const image = personImageUrl(origin);
  const shareImage = ogImageUrl(origin);
  const nodes: Record<string, unknown>[] = [
    {
      "@type": "WebSite",
      "@id": `${origin}/#website`,
      url: `${origin}/`,
      name: input.profile.name,
      description: input.profile.intro,
      inLanguage: "en",
      publisher: { "@id": person },
    },
    {
      "@type": "Person",
      "@id": person,
      name: input.profile.fullName,
      alternateName: input.profile.name,
      jobTitle: input.profile.role,
      email: input.profile.email,
      url: `${origin}/`,
      image: {
        "@type": "ImageObject",
        url: image,
      },
      address: {
        "@type": "PostalAddress",
        addressLocality: "Al Khobar",
        addressCountry: "SA",
      },
      sameAs: [input.profile.github, input.profile.linkedin],
    },
  ];
  if (type === "BlogPosting" && input.post) {
    nodes.push({
      "@type": "BlogPosting",
      "@id": `${url}#article`,
      headline: input.post.headline,
      description: input.post.description,
      datePublished: input.post.datePublished,
      dateModified: input.post.datePublished,
      image: shareImage,
      author: { "@id": person },
      mainEntityOfPage: absoluteUrl(input.post.path, origin),
      url: absoluteUrl(input.post.path, origin),
    });
  } else if (type === "CreativeWork" && input.work) {
    nodes.push({
      "@type": "CreativeWork",
      "@id": `${url}#work`,
      name: input.work.name,
      description: input.work.description,
      url: absoluteUrl(input.work.path, origin),
      author: { "@id": person },
      image: shareImage,
    });
  } else {
    nodes.push({
      "@type": type,
      "@id": `${url}#page`,
      url,
      name: input.title,
      description: input.description,
      isPartOf: { "@id": `${origin}/#website` },
      about: { "@id": person },
      ...(type === "ProfilePage" ? { mainEntity: { "@id": person } } : {}),
    });
  }
  const trail = breadcrumbs(origin, path, input.title, input.article);
  if (trail) nodes.push(trail);
  return { "@context": "https://schema.org", "@graph": nodes };
}

export function robotsTxt(origin: string) {
  const sitemap = absoluteUrl("/sitemap.xml", origin);
  return [
    "User-agent: *",
    "Allow: /",
    "",
    "User-agent: GPTBot",
    "Allow: /",
    "",
    "User-agent: ChatGPT-User",
    "Allow: /",
    "",
    "User-agent: PerplexityBot",
    "Allow: /",
    "",
    `Sitemap: ${sitemap}`,
    "",
  ].join("\n");
}
