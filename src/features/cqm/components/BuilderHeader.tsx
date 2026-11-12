import { ArrowDownToLine, RotateCcw, Upload } from 'lucide-react';
import { download } from '../../../lib/browser/download';
import { cqmConfig } from '../config';
import type { CqmBuilderController } from '../hooks/useCqmBuilder';
type Props = Pick<CqmBuilderController, 'project' | 'importRef' | 'importFile' | 'setReset'>;
export function BuilderHeader({ project, importRef, importFile, setReset }: Props) {
  return (
    <div className="page-heading">
      <div>
        <h1>CQM 명령문 대시보드</h1>
        <p>디자인 링크를 연결하고, AI에 전달할 상품 제작 명령문을 완성하세요.</p>
      </div>
      <div className="heading-actions">
        <button type="button" className="button quiet" onClick={() => importRef.current?.click()}>
          <Upload size={15} />
          불러오기
        </button>
        <button
          type="button"
          className="button quiet"
          onClick={() =>
            download(JSON.stringify(project, null, 2), cqmConfig.settingsFile, 'application/json')
          }
        >
          <ArrowDownToLine size={15} />
          설정 저장
        </button>
        <button
          type="button"
          className="icon-button"
          aria-label="입력 초기화"
          onClick={() => setReset(true)}
        >
          <RotateCcw size={17} />
        </button>
        <input
          ref={importRef}
          hidden
          type="file"
          accept=".json,application/json"
          onChange={(e) => void importFile(e.target.files?.[0])}
        />
      </div>
    </div>
  );
}
