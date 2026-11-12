import type { Project, Section, Group } from './schema';
export const uid = () => crypto.randomUUID();
export const newSection = (order = 1): Section => ({
  id: uid(),
  order: String(order),
  name: '',
  enabled: true,
  pc: '',
  mo: '',
  pcType: '',
  moType: '',
  groups: [],
});
export const newGroup = (kind: Group['kind'], device: Group['device']): Group => ({
  id: uid(),
  kind,
  device,
  key: '',
  position: '',
  initial: '',
  multiple: '허용',
  items: [{ id: uid(), name: '', url: '', closed: '', position: '' }],
});
export const emptyProject = (): Project => ({
  version: 1,
  name: '',
  folder: '',
  reference: '',
  cdn: '',
  rms: '',
  assets: '',
  extra: '',
  tagging: false,
  gtm: '',
  includeGuides: true,
  target: 'Codex',
  sections: [newSection()],
  buttons: [],
});
