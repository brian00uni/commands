import { FileText, X } from 'lucide-react';
export function SourceNotice({ onClose }: { onClose: () => void }) {
  return (
    <div className="document-notice">
      <FileText size={20} />
      <div>
        <strong>3개의 원본 문서를 기반으로 만들었습니다.</strong>
        <p>공통규칙01.md · CQM_김형윤(1).md · CQM명령문_김형윤(1).md</p>
        <p>
          원본은 docs/source/common과 docs/source/cqm에 보관합니다. 전체 명령문은 입력 변수 + 원본
          명령문 + 선택한 가이드 전문으로 구성됩니다. 과거 상품 예시는 현재 작업값으로 사용하지
          않습니다.
        </p>
      </div>
      <button
        type="button"
        className="icon-button"
        aria-label="문서 안내 닫기"
        onClick={() => onClose()}
      >
        <X size={17} />
      </button>
    </div>
  );
}
