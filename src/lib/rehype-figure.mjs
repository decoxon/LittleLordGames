/**
 * Wrap standalone Markdown images in <figure>, and turn the image's optional
 * title into a <figcaption>. Authors add a caption with the Markdown title
 * syntax:  ![alt text](photo.jpg "This caption shows under the image")
 *
 * Runs in the rehype phase (after Astro has rewritten relative images to
 * optimized <img>), so captions work with the responsive image pipeline.
 * Dependency-free hast walk to avoid pulling in unist-util-visit.
 */
export default function rehypeFigure() {
  return (tree) => transform(tree);
}

function isBlankText(node) {
  return node.type === 'text' && /^\s*$/.test(node.value);
}

function transform(node) {
  if (!Array.isArray(node.children)) return;

  node.children = node.children.map((child) => {
    transform(child);

    if (child.type === 'element' && child.tagName === 'p') {
      const meaningful = child.children.filter((c) => !isBlankText(c));
      const isLoneImage =
        meaningful.length === 1 &&
        meaningful[0].type === 'element' &&
        meaningful[0].tagName === 'img';

      if (isLoneImage) {
        const img = meaningful[0];
        const caption = img.properties?.title;
        const figureChildren = [img];
        if (caption) {
          figureChildren.push({
            type: 'element',
            tagName: 'figcaption',
            properties: {},
            children: [{ type: 'text', value: String(caption) }],
          });
        }
        return {
          type: 'element',
          tagName: 'figure',
          properties: { className: ['post-figure'] },
          children: figureChildren,
        };
      }
    }
    return child;
  });
}
