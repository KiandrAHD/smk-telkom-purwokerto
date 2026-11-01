import assert from 'node:assert/strict';
import { wavePath, loopDistance } from '../src/utils/waveMarquee.js';

// Three complete loops must map to exactly the same position, including negative distances.
for (const offset of [-150, 0, 47.5, 1847, 2200]) {
  for (let cycle = 1; cycle <= 3; cycle++) {
    assert.equal(loopDistance(offset + cycle * 2200, 2200), loopDistance(offset, 2200));
  }
}
assert.equal(loopDistance(-1, 2200), 2199);
assert.match(wavePath(), /^M -2200 -646.98 L 0 86.351 C /);
assert.equal((wavePath().match(/ C /g) || []).length, 1);
assert.ok(!wavePath().includes('NaN'));
console.log('Wave geometry and three-cycle continuity passed.');
