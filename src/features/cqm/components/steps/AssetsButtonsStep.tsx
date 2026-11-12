import { Image, Plus, Trash2 } from 'lucide-react';
import { Field } from '../../../../components/ui/Field';
import { Panel } from '../../../../components/ui/Panel';
import type { CqmBuilderController } from '../../hooks/useCqmBuilder';
import { uid } from '../../model';
type Props = Pick<CqmBuilderController, 'project' | 'change'>;
export function AssetsButtonsStep({ project, change }: Props) {
  return (
    <>
      <Panel
        number="03"
        title="이미지 에셋을 지정하세요"
        description="확정된 경로만 입력하세요. CDN 또는 RMS가 비어 있으면 로컬 경로를 사용합니다."
      >
        <div className="form-grid">
          <Field
            label="이미지 CDN 기준 경로"
            hint="VAR-02 · 이미지 폴더 바로 앞까지의 경로"
            value={project.cdn}
            onChange={(v) => change('cdn', v)}
            placeholder="https://example.com/images/"
            wide
          />
          <Field
            label="이미지 폴더명 / RMS 번호"
            hint="VAR-03"
            value={project.rms}
            onChange={(v) => change('rms', v)}
            placeholder="예: 87589"
          />
          <Field
            label="로컬 에셋 폴더"
            hint="VAR-08"
            value={project.assets}
            onChange={(v) => change('assets', v)}
            placeholder="기업/상품/상품명/87589"
          />
        </div>
        <div className="path-tip">
          <Image size={16} />
          <span>
            {project.cdn && project.rms
              ? `${project.cdn.replace(/\/+$/, '')}/${project.rms}/[실제 파일명]`
              : '로컬 에셋의 실제 상대경로를 사용합니다.'}
          </span>
        </div>
      </Panel>
      <Panel
        number="＋"
        title="버튼 링크와 동작"
        description="VAR-01 · 디자인에 있는 버튼만 추가하세요. 같은 문구의 버튼은 위치로 구분합니다."
      >
        {project.buttons.length === 0 && (
          <p className="empty-hint">등록된 버튼이 없습니다. 버튼이 없는 디자인은 비워두세요.</p>
        )}
        {project.buttons.map((b, i) => (
          <div className="section-card" key={b.id}>
            <div className="section-header">
              <strong>버튼 {i + 1}</strong>
              <button
                type="button"
                className="icon-button"
                aria-label={`버튼 ${i + 1} 삭제`}
                onClick={() =>
                  change(
                    'buttons',
                    project.buttons.filter((x) => x.id !== b.id),
                  )
                }
              >
                <Trash2 size={14} />
              </button>
            </div>
            <div className="form-grid">
              {(
                [
                  ['text', '버튼 문구', '가입상담 신청'],
                  ['location', '적용 위치 / 영역', '상품개요 하단'],
                  ['url', '연결 URL / 동작 대상', 'https://…'],
                  ['action', '동작', '페이지 이동 / 새창 / 팝업'],
                ] as const
              ).map(([key, label, placeholder]) => (
                <Field
                  key={key}
                  label={label}
                  value={b[key]}
                  onChange={(v) =>
                    change(
                      'buttons',
                      project.buttons.map((x) => (x.id === b.id ? { ...x, [key]: v } : x)),
                    )
                  }
                  placeholder={placeholder}
                />
              ))}
            </div>
          </div>
        ))}
        <button
          type="button"
          className="add-button"
          onClick={() =>
            change('buttons', [
              ...project.buttons,
              { id: uid(), text: '', location: '', url: '', action: '' },
            ])
          }
        >
          <Plus size={16} />
          버튼 추가
        </button>
        <label className="check-label gtm-toggle">
          <input
            type="checkbox"
            checked={project.tagging}
            onChange={(e) => change('tagging', e.target.checked)}
          />
          GTM 태깅을 명시적으로 요청합니다
        </label>
        {project.tagging && (
          <Field
            label="확정된 영역별 GTM 태깅"
            hint="VAR-07 · 샘플값은 자동으로 채우지 않습니다."
            value={project.gtm}
            onChange={(v) => change('gtm', v)}
            multiline
            placeholder="영역·버튼명과 제공받은 data-gtm-* 속성을 입력하세요."
          />
        )}
      </Panel>
    </>
  );
}
