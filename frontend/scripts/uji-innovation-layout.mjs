import assert from 'node:assert/strict';
import { createElement as h } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { MemoryRouter } from 'react-router-dom';
import { createServer } from 'vite';
import { parseFragment } from 'parse5';

const server = await createServer({ appType: 'custom', logLevel: 'silent', server: { middlewareMode: true } });
try {
  const { default: LandingPage } = await server.ssrLoadModule('/src/pages/LandingPage.jsx');
  const html = renderToStaticMarkup(h(MemoryRouter, null, h(LandingPage, { initialPrestasi: [] })));
  const find = (node, predicate) => predicate(node) ? node : node.childNodes?.map(child => find(child, predicate)).find(Boolean);
  const attr = (node, name) => node.attrs?.find(attribute => attribute.name === name)?.value;
  const main = find(parseFragment(html), node => node.tagName === 'main');
  const sections = main.childNodes.filter(node => node.tagName === 'section');
  const innovation = sections.findIndex(node => attr(node, 'data-innovation-reveal') !== undefined);
  const about = sections.findIndex(node => attr(node, 'id') === 'tentang');
  const stela = sections.findIndex(node => attr(node, 'id') === 'stela');
  assert.ok(innovation > about, 'Innovation follows the main homepage content.');
  assert.equal(innovation + 1, stela, 'Innovation sits immediately before STELA, as in Figma.');
  console.log('Innovation layout: bottom content position before STELA passed.');
} finally {
  await server.close();
}
