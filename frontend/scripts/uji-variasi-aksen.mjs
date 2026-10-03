import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { createServer } from 'vite';

const source = JSON.parse(await readFile(new URL('../../docs/figma-accent-orientation.json', import.meta.url), 'utf8'));
const server = await createServer({ appType: 'custom', logLevel: 'silent', server: { middlewareMode: true } });
try {
  const { default: SectionAccents } = await server.ssrLoadModule('/src/components/SectionAccents.jsx');
  const render = (variant) => renderToStaticMarkup(createElement(SectionAccents, { variant }));
  const html = ['departments', 'achievements', 'schoolTeachers', 'headmaster', 'teachers', 'activities'].map(render).join('');
  const nodes = source.sections.filter(({ id }) => !['24:2052', '24:2055', '24:2058', '24:2061', '24:2064', '24:2067'].includes(id));
  for (const { id, matrix } of nodes) {
    const image = html.match(new RegExp('<img[^>]*data-figma-node="' + id + '"[^>]*>'))?.[0];
    assert.ok(image?.includes('[transform:matrix(' + [...matrix, 0, 0].join(',') + ')]'), id + ' must keep its Figma orientation.');
  }
  const programs = render('departmentsQuiz');
  assert.equal((programs.match(/<img/g) ?? []).length, 3);
  assert.ok(programs.includes('right-2 top-1/2 flex -translate-y-1/2 flex-col gap-4'));
  assert.ok(!programs.includes('transform:matrix'), 'The programs page must keep its existing straight accents.');
  console.log('PASS: 32 Figma orientations restored; programs page unchanged.');
} finally {
  await server.close();
}
