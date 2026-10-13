import assert from 'node:assert/strict';
import { monthCells, dateFromKey, eventsForMonth, shiftDate } from '../src/utils/calendar.js';
import { calendarEvents } from '../src/data/calendarEvents.js';

for (let year = 1900; year <= 2100; year++) for (let month = 0; month < 12; month++) {
  const cells = monthCells(year, month);
  assert([28, 35, 42].includes(cells.length));
  assert.equal(dateFromKey(cells[0].key).getUTCDay(), 1);
  assert.equal(dateFromKey(cells.at(-1).key).getUTCDay(), 0);
  assert.equal(new Set(cells.map(cell => cell.key)).size, cells.length);
  assert.equal(cells.filter(cell => cell.inMonth).length, new Date(Date.UTC(year, month + 1, 0)).getUTCDate());
  cells.forEach((cell, i) => { if (i) assert.equal(shiftDate(cells[i - 1].key, 1), cell.key); });
}
assert.equal(monthCells(2024, 1).filter(cell => cell.inMonth).length, 29);
assert.equal(monthCells(1900, 1).filter(cell => cell.inMonth).length, 28);
assert.equal(monthCells(2000, 1).filter(cell => cell.inMonth).length, 29);
assert.equal(monthCells(2100, 1).filter(cell => cell.inMonth).length, 28);
assert.equal(monthCells(2026, 9)[3].key, '2026-10-01');
assert.equal(monthCells(2026, 9)[33].key, '2026-10-31');
assert.equal(shiftDate('2026-12-31', 1), '2027-01-01');
assert.equal(shiftDate('2024-03-01', -1), '2024-02-29');
assert.equal(monthCells(9999, 11).at(-1).key, '+010000-01-02');
assert.equal(dateFromKey(monthCells(9999, 11).at(-1).key).getUTCFullYear(), 10000);
assert.equal(eventsForMonth(calendarEvents, 2026, 9).length, 7);
assert.deepEqual(eventsForMonth(calendarEvents, 2026, 10), []);
assert.deepEqual(eventsForMonth([], 2026, 9), []);
assert.equal(new Set(calendarEvents.map(event => event.id)).size, calendarEvents.length);
console.log('PASS 2,412 months, Monday-first alignment, continuous dates, leap centuries, year boundary, 7 Figma examples and empty months.');
