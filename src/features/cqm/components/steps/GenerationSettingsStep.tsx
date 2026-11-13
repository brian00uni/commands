import { ShieldCheck } from 'lucide-react';
import { Field } from '../../../../components/ui/Field';
import { Panel } from '../../../../components/ui/Panel';
import type { CqmBuilderController } from '../../hooks/useCqmBuilder';
import { aiToolSchema, type Project } from '../../model';
type Props = Pick<CqmBuilderController, 'project' | 'change'>;
export function GenerationSettingsStep({ project, change }: Props) {
  return (
    <Panel
      number="04"
      title="마지막으로, 생성 설정"
      description="추가 요구사항과 명령문에 포함할 문서를 선택하세요."
    >
      <label className="field">
        <span>
          사용할 AI 도구 <span className="field-badge is-optional">기본값: Codex</span>
        </span>
        <select
          value={project.target}
          onChange={(e) => change('target', e.target.value as Project['target'])}
        >
          {aiToolSchema.options.map((tool) => (
            <option key={tool} value={tool}>
              {tool}
            </option>
          ))}
        </select>
        <small>같은 CQM 기준을 사용합니다. 대상 도구에서 Figma MCP 연결이 필요합니다.</small>
      </label>
      <Field
        label="추가 요청"
        value={project.extra}
        onChange={(v) => change('extra', v)}
        multiline
        placeholder="파일명 규칙, 기타 구성의 동작, 수정 요청 등을 입력하세요."
      />
      <label className="option-card">
        <input
          type="checkbox"
          checked={project.includeGuides}
          onChange={(e) => change('includeGuides', e.target.checked)}
        />
        <span>
          <strong>
            제작 가이드 전문 포함 <em>권장</em>
          </strong>
          <small>
            CQM 가이드와 공통규칙을 함께 복사합니다.
            <br />
            다른 작업공간에서도 문서 첨부 없이 전체 기준을 전달할 수 있습니다.
          </small>
        </span>
      </label>
      {!project.includeGuides && (
        <p className="warning-text">
          가이드를 제외하면 대상 AI 작업공간에 CQM_김형윤.md와 공통규칙.md가 필요합니다.
        </p>
      )}
      <div className="rules-summary">
        <ShieldCheck size={20} />
        <div>
          <strong>이번 작업의 범위를 지킵니다.</strong>
          <p>
            선택한 섹션 · 제공한 PC/MO만 생성
            <br />
            과거 상품 예시 자동 적용 없음
            <br />
            이미지 업로드·별도 검증은 생성 명령에서 제외
          </p>
        </div>
      </div>
    </Panel>
  );
}
