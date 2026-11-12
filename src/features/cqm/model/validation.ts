import type { Project } from './schema';
import { folderName, hasDevice } from './selectors';
export function figmaUrl(value: string) {
  try {
    const u = new URL(value);
    return (
      u.protocol === 'https:' &&
      ['figma.com', 'www.figma.com'].includes(u.hostname) &&
      /^\/(design|file|proto)\/[^/]+/.test(u.pathname) &&
      /^\d+[-:]\d+$/.test(u.searchParams.get('node-id') || '')
    );
  } catch {
    return false;
  }
}
export function issues(p: Project): string[] {
  const errors: string[] = [];
  if (!p.name.trim()) errors.push('상품명을 입력해 주세요.');
  if (!p.folder.trim()) errors.push('상품 작업 폴더를 입력해 주세요.');
  else if (
    p.folder.startsWith('/') ||
    /(^|[/\\])\.\.([/\\]|$)/.test(p.folder) ||
    /[<>:"|?*\\\n\r]/.test(p.folder)
  )
    errors.push('작업 폴더는 상위 경로(..) 없이 워크스페이스 상대경로로 입력해 주세요.');
  if (p.reference.trim() && !figmaUrl(p.reference.trim()))
    errors.push('전체 참고 Figma 링크에 올바른 node-id가 필요합니다.');
  if (p.cdn.trim()) {
    try {
      const u = new URL(p.cdn);
      if (!['https:', 'http:'].includes(u.protocol) || u.search || u.hash) throw Error();
    } catch {
      errors.push('CDN은 쿼리·해시 없는 http(s) 경로로 입력해 주세요.');
    }
  }
  if (p.rms && /[/\\<>:"|?*\n\r]/.test(p.rms))
    errors.push('이미지 폴더명에는 경로 구분자나 특수문자를 사용할 수 없습니다.');
  const selected = p.sections.filter((s) => s.enabled),
    names = new Set<string>();
  if (!selected.length) errors.push('생성할 섹션을 하나 이상 선택해 주세요.');
  selected.forEach((s, n) => {
    const label = `섹션 ${n + 1}`;
    if (!/^\d+$/.test(s.order.trim()) || !s.name.trim())
      errors.push(`${label}: 순서(숫자)와 이름을 입력해 주세요.`);
    if (/[<>:"/\\|?*\n\r]/.test(s.name) || /[. ]$/.test(s.name))
      errors.push(`${label}: 폴더명에 사용할 수 없는 문자가 있습니다.`);
    const name = folderName(s).toLowerCase();
    if (names.has(name)) errors.push(`${label}: 출력 폴더가 중복됩니다 (${folderName(s)}).`);
    names.add(name);
    if (!hasDevice(s, 'PC') && !hasDevice(s, 'MO'))
      errors.push(`${label}: PC 또는 MO 디자인 링크가 필요합니다.`);
    for (const device of ['PC', 'MO'] as const) {
      const url = s[device === 'PC' ? 'pc' : 'mo'].trim(),
        type = s[device === 'PC' ? 'pcType' : 'moType'].toLowerCase();
      if (url && !figmaUrl(url))
        errors.push(`${label} ${device}: Figma 노드 링크를 확인해 주세요.`);
      for (const kind of ['tabs', 'accordion'] as const)
        if (type.includes(kind) && !s.groups.some((g) => g.device === device && g.kind === kind))
          errors.push(`${label} ${device}: ${kind} 상태 그룹을 추가해 주세요.`);
    }
    const ids = new Set<string>();
    s.groups.forEach((g) => {
      if (!g.key.trim()) errors.push(`${label}: ${g.device} 그룹 ID를 입력해 주세요.`);
      if (ids.has(`${g.device}:${g.key}`))
        errors.push(`${label}: 같은 기기의 그룹 ID가 중복됩니다.`);
      ids.add(`${g.device}:${g.key}`);
      const type = s[g.device === 'PC' ? 'pcType' : 'moType'];
      if (!type.includes(g.kind))
        errors.push(`${label}: ${g.device} 구성 방식에 ${g.kind}를 포함해 주세요.`);
      g.items.forEach((i, j) => {
        if (!figmaUrl(i.url.trim()))
          errors.push(
            `${label} ${g.device} ${g.key || g.kind} 항목 ${j + 1}: 상태 Figma 링크가 필요합니다.`,
          );
        if (i.closed.trim() && !figmaUrl(i.closed.trim()))
          errors.push(`${label}: 접힌 상태 Figma 링크를 확인해 주세요.`);
      });
    });
  });
  if (p.tagging && !p.gtm.trim())
    errors.push('GTM 적용을 선택했다면 확정된 태깅 블록을 입력해 주세요.');
  p.buttons.forEach((b, i) => {
    if (!b.text.trim() || !b.action.trim() || !b.url.trim())
      errors.push(
        `버튼 ${i + 1}: 문구·URL·동작을 입력해 주세요. 팝업 등 URL이 없으면 동작 대상을 적어 주세요.`,
      );
  });
  return errors;
}
