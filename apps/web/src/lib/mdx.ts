import { compile, run } from "@mdx-js/mdx";
import * as runtime from "react/jsx-runtime";
import { renderToStaticMarkup } from "react-dom/server";
import { createElement } from "react";
import remarkGfm from "remark-gfm";
import { rehypeShiki } from "@astrojs/markdown-remark";
import { validateMdxTree } from "@garden/content-schema/mdx-policy";
export { validateMdxTree };
export async function renderTrustedMdx(source: string) {
  // No expressions, imports, JSX, HTML or arbitrary component execution accepted.
  // Compilation happens in the trusted build process, never in a public request.
  const compiled = await compile(source, {
    outputFormat: "function-body",
    remarkPlugins: [remarkGfm, validateMdxTree],
    rehypePlugins: [[rehypeShiki, { theme: "github-dark" }]],
  });
  const { default: Content } = await run(String(compiled), {
    ...runtime,
    baseUrl: import.meta.url,
  });
  const html = renderToStaticMarkup(createElement(Content));
  let index = 0;
  const headings: { id: string; text: string }[] = [];
  const withIds = html.replace(/<h2>(.*?)<\/h2>/g, (_match, text: string) => {
    const id = `section-${++index}`;
    headings.push({ id, text: text.replace(/<[^>]+>/g, "") });
    return `<h2 id="${id}">${text}</h2>`;
  });
  return { html: withIds, headings };
}
