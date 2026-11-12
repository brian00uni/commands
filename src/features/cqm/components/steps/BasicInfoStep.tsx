import { ChevronRight, FolderOpen, Link2 } from 'lucide-react';
import { Field } from '../../../../components/ui/Field';
import { Panel } from '../../../../components/ui/Panel';
import type { CqmBuilderController } from '../../hooks/useCqmBuilder';
type Props = Pick<CqmBuilderController, 'project' | 'change'>;
export function BasicInfoStep({ project, change }: Props) {
  return (
    <>
      <Panel
        number="01"
        title="어떤 상품을 작업하나요?"
        description="명령문의 기준이 되는 상품 정보와 작업 폴더를 입력하세요."
      >
        <div className="form-grid">
          <Field
            label="상품명"
            required
            hint="VAR-04 · 이번 작업의 상품 이름"
            value={project.name}
            onChange={(v) => change('name', v)}
            placeholder="예: AI빌딩넷_by_ixi"
            wide
          />
          <Field
            label="상품 작업 폴더"
            required
            hint="VAR-00 · 대상 AI 워크스페이스 기준 상대경로"
            value={project.folder}
            onChange={(v) => change('folder', v)}
            placeholder="기업/상품/상품명"
            wide
          />
          <div className="path-tip wide">
            <FolderOpen size={16} />
            <span>
              입력한 폴더 아래에 <code>1.상품개요/pc.html</code> 형식으로 생성됩니다.
            </span>
          </div>
          <Field
            label="전체 참고용 Figma URL"
            hint="VAR-05 · 선택 항목. 실제 제작 노드는 다음 단계에서 입력합니다."
            value={project.reference}
            onChange={(v) => change('reference', v)}
            placeholder="https://www.figma.com/design/…?node-id=…&m=dev"
            wide
          />
        </div>
      </Panel>
      <div className="info-card">
        <span className="info-icon">
          <Link2 size={20} />
        </span>
        <div>
          <strong>Figma Dev Mode 링크를 준비해 주세요.</strong>
          <p>
            Figma에서 제작할 프레임의 링크를 복사하세요.
            <br />
            PC와 MO는 각각의 디자인 노드 링크를 사용합니다.
          </p>
        </div>
      </div>
      <div className="mini-guide">
        <span className="tiny-label">HOW IT WORKS</span>
        <div>
          <span>
            <span>1</span>작업 정보 입력
          </span>
          <ChevronRight size={15} />
          <span>
            <span>2</span>디자인 링크 연결
          </span>
          <ChevronRight size={15} />
          <span>
            <span>3</span>복사 후 AI에 전달
          </span>
        </div>
      </div>
    </>
  );
}
