import { expect, it } from 'vitest';
import { renderArticle } from './markdown.ts';

it('renders the supplied Markdown contract as semantic article HTML', () => {
  const html = renderArticle(
    '## A useful heading\n\nA **clear** explanation.\n\n- One\n- Two\n\n[Read more](https://example.com)',
  );
  expect(html).toContain('<h2>A useful heading</h2>');
  expect(html).toContain('<strong>clear</strong>');
  expect(html).toContain('<li>One</li>');
  expect(html).toContain('href="https://example.com"');
});
it('removes scripts, event handlers and unsafe link protocols', () => {
  const html = renderArticle(
    '<script>alert(1)</script>\n\n<a href="javascript:alert(1)" onclick="alert(1)">Read</a>',
  );
  expect(html).not.toMatch(/script|onclick|javascript:/i);
  expect(html).toContain('Read');
});
