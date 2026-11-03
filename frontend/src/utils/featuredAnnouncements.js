// Publication date follows toPengumumanItem: tanggal, then created_at.
export const latestPublishedAnnouncements = items => items
  .filter(item => item.status === 'published' && item.slug && item.title)
  .slice()
  .sort((a, b) => (Date.parse(b.iso || b.created_at) || 0) - (Date.parse(a.iso || a.created_at) || 0)
    || (Date.parse(b.created_at) || 0) - (Date.parse(a.created_at) || 0));
