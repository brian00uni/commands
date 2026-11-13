import type { Project } from '../model';
import { inputProgress } from '../model/progress';
import { cqmConfig } from '../config';

type Props = {
  project: Project;
  issueCount: number;
  currentStep: number;
  onStep: (step: number) => void;
};
export function InputProgress({ project, issueCount, currentStep, onStep }: Props) {
  const progress = inputProgress(project);
  return (
    <section className="input-progress" aria-labelledby="input-progress-title">
      <div className="input-progress-heading">
        <div>
          <h2 id="input-progress-title">필수 입력 진행률</h2>
          <p>
            {progress.completed} / {progress.total}개 입력 · 선택 항목 제외
          </p>
        </div>
        <strong>{progress.percent}%</strong>
      </div>
      <progress aria-label="전체 필수 입력률" max={progress.total} value={progress.completed} />
      <div className="input-progress-steps">
        {progress.steps.map((step, i) => (
          <button
            type="button"
            key={i}
            aria-current={currentStep === i ? 'step' : undefined}
            onClick={() => onStep(i)}
          >
            <span>
              {i + 1}. {cqmConfig.steps[i]}
            </span>
            <strong>
              {step.total
                ? `${step.completed} / ${step.total}`
                : i === 3
                  ? '기본 설정 적용'
                  : '필수 입력 없음'}
            </strong>
            {step.total > 0 && (
              <progress
                aria-label={`${cqmConfig.steps[i]} 입력률`}
                max={step.total}
                value={step.completed}
              />
            )}
          </button>
        ))}
      </div>
      <p className="input-progress-status">
        {issueCount === 0
          ? '입력 및 검증 완료 · 명령문을 복사할 수 있습니다.'
          : `검증 확인 ${issueCount}건 · 입력률과 별도로 링크 형식과 구성 조건을 확인합니다.`}
      </p>
    </section>
  );
}
