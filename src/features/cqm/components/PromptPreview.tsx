import {
  ArrowDownToLine,
  ArrowRight,
  CheckCheck,
  ChevronRight,
  Clipboard,
  Code2,
  FileCode2,
  FolderOpen,
  ShieldCheck,
} from 'lucide-react';
import { download } from '../../../lib/browser/download';
import { cqmConfig } from '../config';
import type { CqmBuilderController } from '../hooks/useCqmBuilder';
type Props = Pick<
  CqmBuilderController,
  | 'project'
  | 'preview'
  | 'setPreview'
  | 'previewRef'
  | 'prompt'
  | 'files'
  | 'selected'
  | 'ready'
  | 'errors'
  | 'showIssues'
  | 'setShowIssues'
  | 'setToast'
  | 'copy'
>;
export function PromptPreview({
  project,
  preview,
  setPreview,
  previewRef,
  prompt,
  files,
  selected,
  ready,
  errors,
  showIssues,
  setShowIssues,
  setToast,
  copy,
}: Props) {
  return (
    <aside className="preview-panel" id="prompt-preview">
      <div className="preview-heading">
        <span className="preview-icon">
          <FileCode2 size={19} />
        </span>
        <div>
          <h2>명령문 미리보기</h2>
          <p>실시간 반영 · 확인 후 복사</p>
        </div>
        <span className="live-badge">
          <span /> LIVE
        </span>
      </div>
      <div className="preview-tabs">
        <button
          type="button"
          className={preview === 'prompt' ? 'active' : ''}
          onClick={() => setPreview('prompt')}
        >
          전체 명령문
        </button>
        <button
          type="button"
          className={preview === 'files' ? 'active' : ''}
          onClick={() => setPreview('files')}
        >
          출력 구조 <span>{files.length}</span>
        </button>
        <span className="format-label">{preview === 'prompt' ? 'MARKDOWN' : 'FILES'}</span>
      </div>
      {preview === 'prompt' ? (
        <div className="code-wrap">
          <div className="code-top">
            <span className="code-dots">
              <i />
              <i />
              <i />
            </span>
            <span>cqm-prompt.md</span>
            <Code2 size={13} />
          </div>
          <textarea
            ref={previewRef}
            className="code-preview"
            aria-label="생성된 전체 명령문"
            readOnly
            value={prompt}
            spellCheck={false}
          />
        </div>
      ) : (
        <div className="file-preview">
          <div className="file-root">
            <FolderOpen size={17} />
            {project.folder || '상품 작업 폴더'}
          </div>
          {files.length ? (
            files.map((f) => (
              <div className="file-row" key={f}>
                <FileCode2 size={15} />
                {f.slice(project.folder.trim().replace(/\/+$/, '').length + 1)}
              </div>
            ))
          ) : (
            <p>
              섹션 이름과 Figma 링크를 입력하면
              <br />
              생성할 파일 목록이 표시됩니다.
            </p>
          )}
          <small>실제 파일 생성은 명령문을 전달받은 AI가 수행합니다.</small>
        </div>
      )}
      <div className="preview-stats">
        <span>
          선택 섹션 <b>{selected.length}</b>
        </span>
        <span>
          예상 파일 <b>{files.length}</b>
        </span>
        <span>
          <b>{prompt.length.toLocaleString()}</b> 자
        </span>
      </div>
      <div className="preview-bottom">
        <button
          type="button"
          className={`validation ${ready ? 'valid' : ''}`}
          onClick={() => setShowIssues(!showIssues)}
        >
          {ready ? <CheckCheck size={16} /> : <span className="validation-dot" />}
          <span>
            {ready ? '입력 완료 · 복사 가능' : `필수 입력을 확인해 주세요 · ${errors.length}개`}
          </span>
          <ChevronRight size={14} />
        </button>
        {showIssues && !ready && (
          <ul className="error-list">
            {errors.map((e, i) => (
              <li key={i}>{e}</li>
            ))}
          </ul>
        )}
        <button type="button" className="copy-button" onClick={() => void copy()}>
          <Clipboard size={17} />
          전체 명령문 복사
          <ArrowRight size={17} />
        </button>
        <div className="preview-secondary">
          <span>
            <ShieldCheck size={13} />
            {project.includeGuides ? '제작 가이드 전문 포함' : '제작 가이드 별도 필요'}
          </span>
          <button
            type="button"
            onClick={() => {
              if (!ready) {
                setShowIssues(true);
                setToast('필수 입력을 완료하면 명령문을 다운로드할 수 있습니다.');
                return;
              }
              download(prompt, cqmConfig.promptFile, 'text/markdown;charset=utf-8');
            }}
          >
            <ArrowDownToLine size={13} />
            .md 다운로드
          </button>
        </div>
      </div>
      <div className="paste-note">
        <span>⌘ V</span>복사한 명령문을 {project.target}에 붙여넣으세요.
      </div>
    </aside>
  );
}
