const timestamp = value => {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}T(?:[01]\d|2[0-3]):[0-5]\d:[0-5]\d(?:\.\d{1,3})?(?:Z|[+-](?:[01]\d|2[0-3]):[0-5]\d)$/.test(value)) return NaN;
  const date = new Date(`${value.slice(0, 10)}T00:00:00Z`);
  if (Number.isNaN(date.getTime()) || date.toISOString().slice(0, 10) !== value.slice(0, 10)) return NaN;
  return Date.parse(value);
};
export function registrationState(schedule, now = Date.now()) {
  const opens = timestamp(schedule.opensAt), closes = timestamp(schedule.closesAt);
  if (!Number.isFinite(now) || (schedule.opensAt && !Number.isFinite(opens)) || (schedule.closesAt && !Number.isFinite(closes))) return 'unknown';
  if (Number.isFinite(opens) && Number.isFinite(closes) && closes <= opens) return 'unknown';
  if (Number.isFinite(opens) && now < opens) return 'upcoming';
  if (Number.isFinite(closes) && now > closes) return 'closed';
  if (Number.isFinite(opens) && Number.isFinite(closes)) return 'open';
  return 'unknown';
}
export function registrationCountdown(schedule, now = Date.now()) {
  const state = registrationState(schedule, now);
  const target = timestamp(state === 'upcoming' ? schedule.opensAt : state === 'open' ? schedule.closesAt : null);
  if (!Number.isFinite(target)) return null;
  const seconds = Math.max(0, Math.floor((target - now) / 1000));
  return [Math.floor(seconds / 86400), Math.floor(seconds / 3600) % 24, Math.floor(seconds / 60) % 60, seconds % 60];
}
