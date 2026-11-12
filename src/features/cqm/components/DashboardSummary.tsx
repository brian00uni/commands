import { Card, CardContent } from '@mui/material';
import { FileCode2, Layers, Link2, ListChecks } from 'lucide-react';
import type { Project } from '../model';
type Props = {
  project: Project;
  fileCount: number;
  issueCount: number;
  onDesign: () => void;
  onIssues: () => void;
};
export function DashboardSummary({ project, fileCount, issueCount, onDesign, onIssues }: Props) {
  const selected = project.sections.filter((s) => s.enabled);
  const links = new Set(
    selected
      .flatMap((s) => [
        s.pc,
        s.mo,
        ...s.groups.flatMap((g) => g.items.flatMap((i) => [i.url, i.closed])),
      ])
      .map((v) => v.trim())
      .filter(Boolean),
  );
  const cards = [
    {
      title: '선택한 섹션',
      value: selected.length,
      suffix: '개',
      note: `전체 ${project.sections.length}개 섹션 중 생성 대상`,
      icon: Layers,
      tone: 'blue',
      badge: '작업 범위',
      action: onDesign,
    },
    {
      title: '예상 출력 파일',
      value: fileCount,
      suffix: '개',
      note: '디자인이 제공된 PC · MO 기준',
      icon: FileCode2,
      tone: 'green',
      badge: 'HTML',
      action: onDesign,
    },
    {
      title: '연결한 디자인',
      value: links.size,
      suffix: '개',
      note: '선택 섹션의 고유 Figma URL',
      icon: Link2,
      tone: 'purple',
      badge: 'Figma',
      action: onDesign,
    },
    {
      title: '확인이 필요한 항목',
      value: issueCount,
      suffix: '개',
      note: issueCount ? '필수 입력과 링크를 확인하세요' : '전체 명령문을 복사할 수 있어요',
      icon: ListChecks,
      tone: issueCount ? 'orange' : 'green',
      badge: issueCount ? '입력 중' : '준비 완료',
      action: onIssues,
    },
  ];
  return (
    <section className="dashboard-summary" aria-label="현재 작업 요약">
      {cards.map((c) => (
        <Card key={c.title} className={`stat-card tone-${c.tone}`}>
          <CardContent sx={{ p: '20px !important' }}>
            <div className="stat-title">
              <span>{c.title}</span>
              <c.icon size={18} />
            </div>
            <div className="stat-value">
              {c.value}
              <span>{c.suffix}</span>
              <span className="stat-badge">{c.badge}</span>
            </div>
            <button type="button" className="stat-note" onClick={c.action}>
              {c.note}
              <Chevron />
            </button>
          </CardContent>
        </Card>
      ))}
    </section>
  );
}
function Chevron() {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden="true"
    >
      <path d="m9 5 7 7-7 7" />
    </svg>
  );
}
