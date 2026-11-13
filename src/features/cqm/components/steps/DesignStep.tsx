import { Monitor, Smartphone, Plus, Trash2, X } from 'lucide-react';
import { Field } from '../../../../components/ui/Field';
import { Panel } from '../../../../components/ui/Panel';
import type { CqmBuilderController } from '../../hooks/useCqmBuilder';
import { folderName, newSection, uid } from '../../model';
type Props = Pick<
  CqmBuilderController,
  'project' | 'change' | 'updateSection' | 'updateGroup' | 'addGroup'
>;
export function DesignStep({ project, change, updateSection, updateGroup, addGroup }: Props) {
  return (
    <>
      <Panel
        number="02"
        title="디자인과 섹션을 연결하세요"
        description="VAR-06 · 각 섹션은 하나의 출력 폴더가 됩니다. 제공한 기기만 생성합니다."
      >
        {project.sections.map((s, i) => (
          <div className={`section-card ${!s.enabled ? 'excluded' : ''}`} key={s.id}>
            <div className="section-header">
              <label className="check-label">
                <input
                  type="checkbox"
                  checked={s.enabled}
                  onChange={(e) => updateSection(s.id, { enabled: e.target.checked })}
                />
                <strong>섹션 {String(i + 1).padStart(2, '0')}</strong>
              </label>
              <span className="section-path">{s.name ? folderName(s) : '새 섹션'}</span>
              <button
                type="button"
                className="icon-button danger"
                aria-label={`섹션 ${i + 1} 삭제`}
                disabled={project.sections.length === 1}
                onClick={() =>
                  change(
                    'sections',
                    project.sections.filter((x) => x.id !== s.id),
                  )
                }
              >
                <Trash2 size={15} />
              </button>
            </div>
            <div className="form-grid">
              <div className="section-identity wide">
                <Field
                  label="순서"
                  required
                  value={s.order}
                  onChange={(v) => updateSection(s.id, { order: v })}
                  placeholder="1"
                />
                <Field
                  label="섹션 이름"
                  required
                  value={s.name}
                  onChange={(v) => updateSection(s.id, { name: v })}
                  placeholder="상품개요"
                />
              </div>
              {(['PC', 'MO'] as const).map((d) => (
                <div className={`device-block device-${d.toLowerCase()} wide`} key={d}>
                  <div className="device-label">
                    {d === 'PC' ? <Monitor size={15} /> : <Smartphone size={15} />} {d} 디자인
                  </div>
                  <Field
                    label={`${d} Figma Dev URL`}
                    conditional
                    hint="섹션마다 PC·MO 중 하나의 디자인이 필요합니다. 아래 상태별 링크로도 지정할 수 있습니다."
                    value={s[d === 'PC' ? 'pc' : 'mo']}
                    onChange={(v) => updateSection(s.id, { [d === 'PC' ? 'pc' : 'mo']: v })}
                    placeholder="https://www.figma.com/design/…?node-id=…"
                  />
                  <div className="field">
                    <span id={`${d}-layout-${s.id}`}>
                      {d} 구성 방식 <span className="field-badge is-optional">기본값: 일반</span>
                    </span>
                    <div
                      className="layout-type-buttons"
                      role="group"
                      aria-labelledby={`${d}-layout-${s.id}`}
                    >
                      {(
                        [
                          ['일반', '일반'],
                          ['tabs', '탭'],
                          ['accordion', '아코디언'],
                        ] as const
                      ).map(([value, label]) => {
                        const selected =
                          value === '일반'
                            ? !s[d === 'PC' ? 'pcType' : 'moType'].trim() ||
                              s[d === 'PC' ? 'pcType' : 'moType'].trim() === '일반'
                            : s[d === 'PC' ? 'pcType' : 'moType'].includes(value);
                        return (
                          <button
                            key={value}
                            type="button"
                            className="button layout-type-button"
                            aria-pressed={selected}
                            onClick={() => {
                              const next =
                                value === '일반'
                                  ? []
                                  : ['tabs', 'accordion'].filter((kind) =>
                                      kind === value
                                        ? !selected
                                        : s[d === 'PC' ? 'pcType' : 'moType'].includes(kind),
                                    );
                              updateSection(s.id, {
                                [d === 'PC' ? 'pcType' : 'moType']: next.join(' + ') || '일반',
                              });
                            }}
                          >
                            {label}
                          </button>
                        );
                      })}
                    </div>
                    <small>탭과 아코디언은 함께 선택할 수 있습니다.</small>
                    {s[d === 'PC' ? 'pcType' : 'moType'].trim() &&
                      ![
                        '일반',
                        'tabs',
                        'accordion',
                        'tabs + accordion',
                        'accordion + tabs',
                      ].includes(s[d === 'PC' ? 'pcType' : 'moType'].trim()) && (
                        <small>
                          기존 구성 방식: {s[d === 'PC' ? 'pcType' : 'moType']} · 버튼을 선택하면
                          변경됩니다.
                        </small>
                      )}
                  </div>
                  {(['tabs', 'accordion'] as const).some((kind) =>
                    s[d === 'PC' ? 'pcType' : 'moType'].includes(kind),
                  ) && (
                    <div className="inline-actions">
                      {s[d === 'PC' ? 'pcType' : 'moType'].includes('tabs') && (
                        <button type="button" onClick={() => addGroup(s, 'tabs', d)}>
                          <Plus size={13} />탭 그룹 추가
                        </button>
                      )}
                      {s[d === 'PC' ? 'pcType' : 'moType'].includes('accordion') && (
                        <button type="button" onClick={() => addGroup(s, 'accordion', d)}>
                          <Plus size={13} />
                          아코디언 그룹 추가
                        </button>
                      )}
                    </div>
                  )}
                  {s.groups
                    .filter((g) => g.device === d)
                    .map((g) => (
                      <div key={g.id} className="group-card device-group-card">
                        <div className="section-header">
                          <strong>
                            <span className="group-level-label">하위 설정</span>
                            {g.kind === 'tabs' ? '탭 그룹' : '아코디언 그룹'}
                          </strong>
                          <button
                            type="button"
                            className="icon-button"
                            aria-label={`${d} ${g.kind === 'tabs' ? '탭' : '아코디언'} 그룹 ${g.key || ''} 삭제`}
                            onClick={() =>
                              updateSection(s.id, {
                                groups: s.groups.filter((x) => x.id !== g.id),
                              })
                            }
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                        <div className="form-grid group-meta-grid">
                          <Field
                            label="그룹 ID"
                            required
                            value={g.key}
                            onChange={(v) => updateGroup(s, g.id, { key: v })}
                            placeholder="pricing-main"
                          />
                          <Field
                            label="초기 상태 / 활성 탭"
                            value={g.initial}
                            onChange={(v) => updateGroup(s, g.id, { initial: v })}
                            placeholder="Figma 기준"
                          />
                          <Field
                            label="소속 탭 / 그룹 위치"
                            value={g.position}
                            onChange={(v) => updateGroup(s, g.id, { position: v })}
                            placeholder="예: 탭 1 / 요금 안내 하단"
                          />
                          {g.kind === 'accordion' && (
                            <label className="field">
                              <span>
                                동시 펼침{' '}
                                <span className="field-badge is-optional">기본값: 허용</span>
                              </span>
                              <select
                                value={g.multiple}
                                onChange={(e) => updateGroup(s, g.id, { multiple: e.target.value })}
                              >
                                <option>허용</option>
                                <option>하나만</option>
                              </select>
                            </label>
                          )}
                        </div>
                        {g.items.map((item, j) => {
                          const edit = (key: string, v: string) =>
                            updateGroup(s, g.id, {
                              items: g.items.map((x) =>
                                x.id === item.id ? { ...x, [key]: v } : x,
                              ),
                            });
                          return (
                            <div className="state-item" key={item.id}>
                              <div className="section-header">
                                <small>상태 항목 {j + 1}</small>
                                <button
                                  type="button"
                                  className="icon-button"
                                  aria-label={`상태 항목 ${j + 1} 삭제`}
                                  disabled={g.items.length === 1}
                                  onClick={() =>
                                    updateGroup(s, g.id, {
                                      items: g.items.filter((x) => x.id !== item.id),
                                    })
                                  }
                                >
                                  <X size={14} />
                                </button>
                              </div>
                              <Field
                                label="탭 / 항목 이름"
                                value={item.name}
                                onChange={(v) => edit('name', v)}
                                placeholder="Figma에서 확인"
                              />
                              {g.kind === 'accordion' && (
                                <Field
                                  label="접힌 상태 URL (별도 프레임이 있는 경우)"
                                  value={item.closed}
                                  onChange={(v) => edit('closed', v)}
                                  placeholder="https://www.figma.com/design/…?node-id=…"
                                />
                              )}
                              <Field
                                label={`${g.kind === 'tabs' ? '선택' : '펼친'} 상태 Figma URL`}
                                required
                                value={item.url}
                                onChange={(v) => edit('url', v)}
                                placeholder="https://www.figma.com/design/…?node-id=…"
                              />
                              <Field
                                label="프레임 안 대상 / 노드 위치"
                                value={item.position}
                                onChange={(v) => edit('position', v)}
                                placeholder="그룹 전체 프레임일 때 대상 위치"
                              />
                            </div>
                          );
                        })}
                        <button
                          type="button"
                          className="button small"
                          onClick={() =>
                            updateGroup(s, g.id, {
                              items: [
                                ...g.items,
                                {
                                  id: uid(),
                                  name: '',
                                  url: '',
                                  closed: '',
                                  position: '',
                                },
                              ],
                            })
                          }
                        >
                          <Plus size={14} />
                          상태 항목 추가
                        </button>
                      </div>
                    ))}
                </div>
              ))}
            </div>
          </div>
        ))}
        <button
          type="button"
          className="add-button"
          onClick={() =>
            change('sections', [
              ...project.sections,
              newSection(Math.max(...project.sections.map((s) => Number(s.order) || 0)) + 1),
            ])
          }
        >
          <Plus size={17} />
          섹션 추가
        </button>
      </Panel>
    </>
  );
}
