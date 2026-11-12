import type { Section } from './schema';
export const folderName = (s: Section) => `${s.order.trim()}.${s.name.trim()}`;
export const hasDevice = (s: Section, d: 'PC' | 'MO') =>
  !!s[d === 'PC' ? 'pc' : 'mo'].trim() ||
  s.groups.some((g) => g.device === d && g.items.some((i) => i.url.trim() || i.closed.trim()));
