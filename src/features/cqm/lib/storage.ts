import { emptyProject, projectSchema } from '../model';
import type { Project } from '../model';
import { cqmConfig } from '../config';
export function loadProject(storage: Pick<Storage, 'getItem'>): Project {
  const raw = storage.getItem(cqmConfig.storageKey);
  return raw ? projectSchema.parse(JSON.parse(raw)) : emptyProject();
}
export function saveProject(storage: Pick<Storage, 'setItem'>, project: Project) {
  storage.setItem(cqmConfig.storageKey, JSON.stringify(project));
}
