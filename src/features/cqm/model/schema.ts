import { z } from 'zod';
export const itemSchema = z.object({
  id: z.string(),
  name: z.string(),
  url: z.string(),
  closed: z.string(),
  position: z.string(),
});
export const groupSchema = z.object({
  id: z.string(),
  kind: z.enum(['tabs', 'accordion']),
  device: z.enum(['PC', 'MO']),
  key: z.string(),
  position: z.string(),
  initial: z.string(),
  multiple: z.string(),
  items: z.array(itemSchema).min(1),
});
export const sectionSchema = z.object({
  id: z.string(),
  order: z.string(),
  name: z.string(),
  enabled: z.boolean(),
  pc: z.string(),
  mo: z.string(),
  pcType: z.string(),
  moType: z.string(),
  groups: z.array(groupSchema),
});
export const buttonSchema = z.object({
  id: z.string(),
  location: z.string(),
  text: z.string(),
  url: z.string(),
  action: z.string(),
});
export const projectSchema = z.object({
  version: z.literal(1),
  name: z.string(),
  folder: z.string(),
  reference: z.string(),
  cdn: z.string(),
  rms: z.string(),
  assets: z.string(),
  extra: z.string(),
  tagging: z.boolean(),
  gtm: z.string(),
  includeGuides: z.boolean(),
  target: z.enum(['Codex', 'Kiro', '기타 AI']),
  sections: z.array(sectionSchema).min(1),
  buttons: z.array(buttonSchema),
});
export type Project = z.infer<typeof projectSchema>;
export type Section = z.infer<typeof sectionSchema>;
export type Group = z.infer<typeof groupSchema>;
