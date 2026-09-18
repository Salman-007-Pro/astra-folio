import { describe, expect, it } from "vitest";
import { seed } from "../../packages/content-schema/src/seed";
import {
  attachmentDisposition,
  absoluteResumeUrl,
  isPdfBytes,
  isPdfResponse,
  pdfFilename,
} from "../../apps/web/src/lib/cv-download";
import {
  PRODUCTION_ORIGIN,
  ogImageUrl,
  personImageUrl,
  schemaGraph,
  siteOrigin,
} from "../../apps/web/src/lib/seo";
import { renderSitemap, sitemapEntries } from "../../apps/web/src/lib/sitemap";

describe("site origin", () => {
  it("uses the production origin and never a ChatGPT Sites host", () => {
    expect(PRODUCTION_ORIGIN).toBe("https://www.salmanasif.pro");
    expect(siteOrigin("https://www.salmanasif.pro/")).toBe(
      "https://www.salmanasif.pro",
    );
    expect(ogImageUrl(PRODUCTION_ORIGIN)).toBe(
      "https://www.salmanasif.pro/og.jpg",
    );
    expect(personImageUrl(PRODUCTION_ORIGIN)).toBe(
      "https://www.salmanasif.pro/portrait.jpg",
    );
    expect(JSON.stringify(seed.site.url)).not.toMatch(/chatgpt\.site/i);
  });
});

describe("sitemap", () => {
  it("lists public pages with real lastmod values and skips /play", () => {
    const entries = sitemapEntries(seed);
    const locs = entries.map((entry) => entry.path);
    expect(locs).toContain("/");
    expect(locs).toContain("/cv");
    expect(locs).toContain("/work/cargobarn");
    expect(locs).toContain("/writing/html-before-webgl");
    expect(locs).not.toContain("/play");
    expect(locs).not.toContain("/404");
    const notes = entries.filter((entry) =>
      entry.path.startsWith("/writing/"),
    );
    expect(notes.every((entry) => entry.lastmod)).toBe(true);
    expect(entries.find((entry) => entry.path === "/work")?.lastmod).toBeUndefined();
    const xml = renderSitemap(entries, PRODUCTION_ORIGIN, {
      path: "/",
      loc: personImageUrl(PRODUCTION_ORIGIN),
    });
    expect(xml).toContain("<lastmod>");
    expect(xml).toContain("xmlns:image=");
    expect(xml).toContain(personImageUrl(PRODUCTION_ORIGIN));
    expect(xml).not.toContain("image:caption");
    expect(xml).not.toContain("/play");
  });
});

describe("schema graph", () => {
  const profile = seed.profile;
  const origin = PRODUCTION_ORIGIN;

  it("emits ProfilePage on the homepage with a Person image", () => {
    const graph = schemaGraph({
      origin,
      pathname: "/",
      title: "Salman Asif — Senior full-stack engineer",
      description: profile.intro,
      profile,
    });
    const types = graph["@graph"].map((node: { "@type": string }) => node["@type"]);
    expect(types).toContain("WebSite");
    expect(types).toContain("Person");
    expect(types).toContain("ProfilePage");
    const person = graph["@graph"].find(
      (node: { "@type": string; image?: { url?: string } }) =>
        node["@type"] === "Person",
    );
    expect(person?.image?.url).toBe(personImageUrl(origin));
    expect(person.sameAs).toEqual([profile.github, profile.linkedin]);
  });

  it("does not emit ProfilePage on articles and includes BlogPosting fields", () => {
    const graph = schemaGraph({
      origin,
      pathname: "/writing/html-before-webgl",
      title: "Note — Salman Asif",
      description: "excerpt",
      profile,
      article: true,
      post: {
        headline: "A 3D portfolio should still work without 3D.",
        description: "excerpt",
        datePublished: "2026-09-10",
        path: "/writing/html-before-webgl",
      },
    });
    const types = graph["@graph"].map((node: { "@type": string }) => node["@type"]);
    expect(types).toContain("BlogPosting");
    expect(types).toContain("BreadcrumbList");
    expect(types).not.toContain("ProfilePage");
    const post = graph["@graph"].find(
      (node: { "@type": string }) => node["@type"] === "BlogPosting",
    );
    expect(post.image).toBe(ogImageUrl(origin));
    expect(post.author["@id"]).toBe(`${origin}/#person`);
  });

  it("marks work case studies as CreativeWork", () => {
    const graph = schemaGraph({
      origin,
      pathname: "/work/cargobarn",
      title: "CargoBarn — Salman Asif",
      description: "outcome",
      profile,
      work: {
        name: "CargoBarn",
        description: "outcome",
        path: "/work/cargobarn",
      },
    });
    expect(
      graph["@graph"].some(
        (node: { "@type": string }) => node["@type"] === "CreativeWork",
      ),
    ).toBe(true);
  });
});

describe("CV download headers", () => {
  it("always saves a .pdf filename even when CMS omits the extension", () => {
    expect(pdfFilename("Muhammad Salman Asif CV")).toBe(
      "Muhammad Salman Asif CV.pdf",
    );
    expect(pdfFilename("Muhammad_Salman_Asif_CV.pdf")).toBe(
      "Muhammad_Salman_Asif_CV.pdf",
    );
    expect(pdfFilename("")).toBe("CV.pdf");
    const header = attachmentDisposition("Muhammad Salman Asif CV");
    expect(header).toContain('filename="Muhammad_Salman_Asif_CV.pdf"');
    expect(header).toContain(
      "filename*=UTF-8''Muhammad%20Salman%20Asif%20CV.pdf",
    );
    expect(isPdfResponse(200, "application/pdf")).toBe(true);
    expect(isPdfResponse(200, "text/html")).toBe(false);
    expect(isPdfBytes(Buffer.from("%PDF-1.7\n"))).toBe(true);
    expect(isPdfBytes(Buffer.from("<!DOCTYPE html>"))).toBe(false);
  });

  it("resolves CMS media links against the CMS origin", () => {
    expect(
      absoluteResumeUrl(
        "https://cms.salmanasif.pro/api/media/file/Muhammad_Salman_Asif_CV.pdf",
        "https://cms.salmanasif.pro",
      ),
    ).toBe(
      "https://cms.salmanasif.pro/api/media/file/Muhammad_Salman_Asif_CV.pdf",
    );
    expect(
      absoluteResumeUrl(
        "/api/media/file/Muhammad_Salman_Asif_CV.pdf",
        "https://cms.salmanasif.pro",
      ),
    ).toBe(
      "https://cms.salmanasif.pro/api/media/file/Muhammad_Salman_Asif_CV.pdf",
    );
    expect(absoluteResumeUrl("/api/media/file/cv.pdf", null)).toBeNull();
  });
});
