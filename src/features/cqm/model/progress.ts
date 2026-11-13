import type { Project } from './schema';
import { hasDevice } from './selectors';

// 입력 여부를 집계한다. 형식·중복 등 유효성은 기존 issues 검증으로 별도 안내한다.
export function inputProgress(project: Project) {
  const filled = (value: string) => Boolean(value.trim());
  const basic = [filled(project.name), filled(project.folder)];
  const design: boolean[] = [];
  const selected = project.sections.filter((s) => s.enabled);
  if (!selected.length) design.push(false);
  for (const section of selected) {
    design.push(
      filled(section.order),
      filled(section.name),
      hasDevice(section, 'PC') || hasDevice(section, 'MO'),
    );
    for (const device of ['PC', 'MO'] as const) {
      const type = section[device === 'PC' ? 'pcType' : 'moType'].toLowerCase();
      for (const kind of ['tabs', 'accordion'] as const) {
        if (
          type.includes(kind) &&
          !section.groups.some((g) => g.device === device && g.kind === kind)
        ) {
          design.push(false);
        }
      }
    }
    for (const group of section.groups) {
      design.push(filled(group.key));
      for (const item of group.items) design.push(filled(item.url));
    }
  }
  const assets = project.buttons.flatMap((b) => [filled(b.text), filled(b.url), filled(b.action)]);
  if (project.tagging) assets.push(filled(project.gtm));
  const steps = [basic, design, assets, []].map((checks) => ({
    completed: checks.filter(Boolean).length,
    total: checks.length,
    percent: checks.length ? Math.round((checks.filter(Boolean).length / checks.length) * 100) : 0,
  }));
  const completed = steps.reduce((sum, step) => sum + step.completed, 0);
  const total = steps.reduce((sum, step) => sum + step.total, 0);
  return { steps, completed, total, percent: Math.round((completed / total) * 100) };
}
