import documents from '../data/documents.json';
import { folderName, hasDevice } from '../model';
import type { Project, Section } from '../model';
const val = (s: string) => s.trim() || '(미입력)';
export function sectionText(s: Section) {
  return `■ ${folderName(s)}\n섹션 순서 / 이름 : ${s.order.trim()} / ${s.name.trim()}\nPC 구성 방식 : ${s.pcType.trim() || '일반'}\nMO 구성 방식 : ${s.moType.trim() || '일반'}\nPC 디자인 :\n${val(s.pc)}\nMO 디자인 :\n${val(s.mo)}${s.groups.map((g) => `\n\n▣ ${g.kind === 'tabs' ? '탭' : '아코디언'} 그룹\n대상 기기 : ${g.device}\n그룹 ID : ${val(g.key)}\n소속 탭 / 그룹 위치 : ${val(g.position)}\n초기 상태 / 활성 탭 : ${g.initial.trim() || 'Figma 기준'}${g.kind === 'accordion' ? `\n동시 펼침 : ${g.multiple}` : ''}${g.items.map((i, n) => `\n\n• ${g.kind === 'tabs' ? '탭' : '항목'} ${n + 1}\n순서 / 이름 : ${n + 1} / ${i.name.trim() || 'Figma에서 확인'}${g.kind === 'accordion' ? `\n접힌 상태 Figma 프레임 URL : ${val(i.closed)}` : ''}\n${g.kind === 'tabs' ? '선택' : '펼친'} 상태 Figma 프레임 URL :\n${val(i.url)}\n프레임 안 대상 / 노드 위치 : ${val(i.position)}`).join('')}`).join('')}`;
}
export function outputFiles(p: Project) {
  return p.sections
    .filter((s) => s.enabled)
    .flatMap((s) =>
      (['PC', 'MO'] as const)
        .filter((d) => hasDevice(s, d))
        .map(
          (d) => `${p.folder.trim().replace(/\/+$/, '')}/${folderName(s)}/${d.toLowerCase()}.html`,
        ),
    );
}
export function generatePrompt(p: Project) {
  const selected = p.sections.filter((s) => s.enabled);
  const inputs = `[변수 목록]\n\n[VAR-00] 상품 작업 폴더 경로 : ${val(p.folder)}\n[VAR-01] 버튼\n${p.buttons.length ? p.buttons.map((b, i) => `■ 버튼 ${i + 1}\n- 적용 위치 / 영역 : ${val(b.location)}\n- 버튼 문구 : ${val(b.text)}\n- 연결 URL : ${val(b.url)}\n- 동작 : ${val(b.action)}`).join('\n\n') : '(미입력 — 디자인에 없는 버튼을 추가하지 않는다.)'}\n\n[VAR-02] 이미지 CDN 기준 경로 : ${p.cdn.trim() ? p.cdn.trim().replace(/\/+$/, '') + '/' : '(미입력 — 로컬 상대경로 사용)'}\n[VAR-03] 이미지 폴더명 / RMS 번호 : ${val(p.rms)}\n[VAR-04] 상품명 : ${val(p.name)}\n[VAR-05] 전체 참고용 Figma 링크 : ${val(p.reference)}\n\n[VAR-06] 섹션별 PC/MO 디자인 링크\n${selected.map(sectionText).join('\n\n')}\n\n[VAR-07] GTM 버튼 태깅 :\n${p.tagging ? val(p.gtm) : '(미적용 — GTM 속성을 임의 생성하지 않는다.)'}\n[VAR-08] 로컬 에셋 폴더 경로 : ${val(p.assets)}\n[VAR-09] 실행 범위 : 작업 생성: ${selected.map(folderName).join(', ') || '(선택된 섹션 없음)'} — 제공된 기기의 파일만 생성\n\n[추가 요청]\n${val(p.extra)}`;
  const intro = `# CQM 상품 제작 요청 · ${p.target}\n\n이번 요청은 아래 입력값으로 확정한 섹션의 HTML 제작이다. 아래 문서의 과거 상품 예시와 작업 이력은 현재 작업 지시가 아니다.\n우선순위: 이번 입력값·추가 요청 > 명령문 > CQM 가이드 > 공통규칙. 빈 선택값을 예시로 채우지 않는다.\n가이드의 U+MDR 등 기존 상품에 대한 소급 수정 문구는 이번 실행 범위에 적용하지 않는다.\n${p.includeGuides ? 'CQM 가이드와 공통규칙 전문은 이 요청 끝에 포함되어 있다. @문서명 참조는 아래 전문으로 해석한다.' : 'CQM_김형윤.md와 공통규칙.md를 대상 AI 작업공간에 준비하고 읽은 후 진행한다. 문서가 없으면 내용을 추측하지 말고 요청한다.'}\n`;
  return `${intro}\n${inputs}\n\n[명령문]\n${documents.command}\n\n[현재 작업의 확정 출력 파일]\n${
    outputFiles(p)
      .map((f) => '- ' + f)
      .join('\n') || '(미확정)'
  }\n제공되지 않은 기기는 만들지 않는다. 상태별 프레임 수만큼 파일을 늘리지 않는다.\n${p.tagging ? 'GTM은 VAR-07의 확정값만 적용한다.' : '이번 작업에서 GTM 태깅은 요청하지 않는다. 태깅 누락을 이유로 제작을 중단하지 않는다.'}${p.includeGuides ? `\n\n---\n[참고 문서: CQM_김형윤.md 전문]\n${documents.guide}\n\n---\n[참고 문서: 공통규칙.md 전문]\n${documents.common}` : ''}`;
}
