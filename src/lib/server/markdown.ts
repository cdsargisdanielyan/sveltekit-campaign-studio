import { marked } from 'marked';
import sanitizeHtml from 'sanitize-html';

export function renderArticle(markdown: string): string {
  return sanitizeHtml(marked.parse(markdown, { async: false }), {
    allowedTags: sanitizeHtml.defaults.allowedTags,
    allowedAttributes: { a: ['href', 'title'], code: ['class'] },
    allowedSchemes: ['http', 'https', 'mailto'],
    allowProtocolRelative: false,
  });
}
