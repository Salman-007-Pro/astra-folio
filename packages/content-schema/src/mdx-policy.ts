export function validateMdxTree() {
  return (tree: any) => {
    function visit(node: any) {
      if (
        [
          "mdxjsEsm",
          "mdxFlowExpression",
          "mdxTextExpression",
          "mdxJsxFlowElement",
          "mdxJsxTextElement",
          "html",
        ].includes(node.type)
      )
        throw new Error(
          `Unsupported MDX syntax: ${node.type}. Markdown only; imports, expressions, JSX and raw HTML are not permitted.`,
        );
      if (node.type === "link" || node.type === "image") {
        if (!/^(https?:\/\/|mailto:|\/[^/]|#)/i.test(node.url))
          throw new Error("Unsafe content URL");
      }
      node.children?.forEach(visit);
    }
    visit(tree);
  };
}
