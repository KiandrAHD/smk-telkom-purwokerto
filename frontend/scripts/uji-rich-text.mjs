import assert from 'node:assert/strict';
import { isRichText, richTextToPlain, sanitizeRichText, toEditorHtml } from '../src/utils/richText.js';

const formatted = '<h2>Judul</h2><p style="text-align:center"><strong>Tebal</strong> <em>Miring</em> <u>Garis</u></p><ul><li>Satu</li></ul><table><tbody><tr><td>Sel</td></tr></tbody></table>';
assert.equal(sanitizeRichText(formatted), formatted);
assert.equal(richTextToPlain('<p>Halo &amp; teman</p><p>Dunia</p>'), 'Halo & teman\nDunia');
assert.equal(richTextToPlain('<p><br>&nbsp;</p>'), '');
assert.equal(isRichText('Nilai 2 < 3 dan 5 > 4'), false);
assert.equal(toEditorHtml('Nilai <aman>\nBaris kedua'), '<p>Nilai &lt;aman&gt;</p><p>Baris kedua</p>');
const unsafe = sanitizeRichText('<p onclick="alert(1)" style="text-align:right;background:url(javascript:x)">A</p><script>alert(1)</script><svg onload="x"></svg><img src=x onerror=x><a href="javascript:alert(1)">Klik</a><a href="//jahat.com">Relatif</a><iframe src="x"></iframe><h1>Judul</h1>');
assert.ok(!/onclick|javascript:|<script|<svg|<img|<iframe|<h1|href=/i.test(unsafe), unsafe);
assert.match(unsafe, /text-align:right/);
assert.match(sanitizeRichText('<a href="https://example.com">Aman</a>'), /rel="noopener noreferrer"/);
assert.equal(richTextToPlain('<p>&lt;script&gt; tetap teks</p>'), '<script> tetap teks');
console.log('Rich text: formatting, legacy text, empty content, tables, safe links, and XSS sanitization pass in Node/SSR.');
