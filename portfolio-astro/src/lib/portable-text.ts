import { toHTML } from '@portabletext/to-html';
import type { PortableTextBlock } from '@portabletext/types';

/**
 * Renders Sanity Portable Text blocks to HTML string.
 * Handles custom types: inline images, code blocks, and link annotations.
 */
export function renderPortableText(blocks: PortableTextBlock[]): string {
  return toHTML(blocks, {
    components: {
      types: {
        image: ({ value }) => {
          const url = optimizeImageUrl(value?.asset?.url) || '';
          const alt = value?.alt || '';
          const caption = value?.caption || '';
          return `
            <figure class="body-figure">
              <img src="${url}" alt="${alt}" loading="lazy" />
              ${caption ? `<figcaption>${caption}</figcaption>` : ''}
            </figure>
          `;
        },
        codeBlock: ({ value }) => {
          const lang = value?.language || 'text';
          const code = value?.code || '';
          const filename = value?.filename || '';
          return `
            <div class="body-code-block">
              ${filename ? `<div class="code-filename">${filename}</div>` : ''}
              <pre><code class="language-${lang}">${escapeHtml(code)}</code></pre>
            </div>
          `;
        },
      },
      marks: {
        link: ({ children, value }) => {
          const href = value?.href || '#';
          const blank = value?.blank;
          const rel = blank ? ' rel="noreferrer"' : '';
          const target = blank ? ' target="_blank"' : '';
          return `<a href="${href}"${target}${rel}>${children}</a>`;
        },
      },
    },
  });
}

function optimizeImageUrl(url: string | undefined): string | undefined {
  if (!url) return undefined;

  try {
    const parsed = new URL(url);
    parsed.searchParams.set('auto', 'format');
    parsed.searchParams.set('fit', 'max');
    parsed.searchParams.set('w', '1600');
    parsed.searchParams.set('q', '75');
    return parsed.toString();
  } catch {
    return url;
  }
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
