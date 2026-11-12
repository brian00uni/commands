import { ArrowLeft, ArrowRight, Clipboard } from 'lucide-react';
import { AppLayout } from '../components/layout/AppLayout';
import { ConfirmDialog } from '../components/ui/ConfirmDialog';
import { Toast } from '../components/ui/Toast';
import {
  cqmConfig,
  useCqmBuilder,
  emptyProject,
  BuilderHeader,
  DashboardSummary,
  SourceNotice,
  PromptPreview,
  BasicInfoStep,
  DesignStep,
  AssetsButtonsStep,
  GenerationSettingsStep,
} from '../features/cqm';

export default function CqmBuilderPage() {
  const builder = useCqmBuilder();
  const { project, change, step, setStep, docs, setDocs, copy } = builder;
  return (
    <>
      <AppLayout
        title={cqmConfig.title}
        subtitle={cqmConfig.subtitle}
        pageTitle={cqmConfig.pageTitle}
        saved={builder.saved}
        active={docs ? 'documents' : 'builder'}
        onNavigate={(id) => {
          setDocs(id === 'documents');
          if (id === 'builder') setStep(0);
        }}
      >
        <BuilderHeader
          project={project}
          importRef={builder.importRef}
          importFile={builder.importFile}
          setReset={builder.setReset}
        />
        <DashboardSummary
          project={project}
          fileCount={builder.files.length}
          issueCount={builder.errors.length}
          onDesign={() => {
            setStep(1);
            document
              .getElementById('editor-panel')
              ?.scrollIntoView({ block: 'start', behavior: 'smooth' });
          }}
          onIssues={() => {
            builder.setShowIssues(true);
            document
              .getElementById('prompt-preview')
              ?.scrollIntoView({ block: 'start', behavior: 'smooth' });
          }}
        />
        {docs && <SourceNotice onClose={() => setDocs(false)} />}
        <div className="builder-layout">
          <div className="editor">
            <div className="editor-heading">
              <div>
                <h2>명령문 작성</h2>
                <p>작업 정보를 순서대로 입력하세요.</p>
              </div>
              <span className="editor-badge">STEP {step + 1} / 4</span>
            </div>
            <div className="step-tabs" role="tablist" aria-label="명령문 입력 단계">
              {cqmConfig.steps.map((label, i) => (
                <button
                  type="button"
                  key={label}
                  role="tab"
                  aria-selected={step === i}
                  aria-controls="editor-panel"
                  id={`step-${i}`}
                  onClick={() => setStep(i)}
                  className={step === i ? 'current' : ''}
                >
                  <span className="step-num">{i + 1}</span>
                  {label}
                </button>
              ))}
            </div>
            <div id="editor-panel" role="tabpanel" aria-labelledby={`step-${step}`}>
              {step === 0 && <BasicInfoStep project={project} change={change} />}
              {step === 1 && (
                <DesignStep
                  project={project}
                  change={change}
                  updateSection={builder.updateSection}
                  updateGroup={builder.updateGroup}
                  addGroup={builder.addGroup}
                />
              )}
              {step === 2 && <AssetsButtonsStep project={project} change={change} />}
              {step === 3 && <GenerationSettingsStep project={project} change={change} />}
            </div>
            <div className="step-footer">
              <span>
                {step + 1} / {cqmConfig.steps.length} 단계{' '}
                <span className="footer-muted">· 언제든 수정할 수 있어요</span>
              </span>
              <div>
                {step > 0 && (
                  <button type="button" className="button quiet" onClick={() => setStep(step - 1)}>
                    <ArrowLeft size={15} />
                    이전
                  </button>
                )}
                {step < cqmConfig.steps.length - 1 ? (
                  <button
                    type="button"
                    className="button primary"
                    onClick={() => setStep(step + 1)}
                  >
                    다음 단계
                    <ArrowRight size={15} />
                  </button>
                ) : (
                  <button type="button" className="button primary" onClick={() => void copy()}>
                    <Clipboard size={16} />
                    전체 명령문 복사
                  </button>
                )}
              </div>
            </div>
          </div>
          <PromptPreview
            project={project}
            preview={builder.preview}
            setPreview={builder.setPreview}
            previewRef={builder.previewRef}
            prompt={builder.prompt}
            files={builder.files}
            selected={builder.selected}
            ready={builder.ready}
            errors={builder.errors}
            showIssues={builder.showIssues}
            setShowIssues={builder.setShowIssues}
            setToast={builder.setToast}
            copy={copy}
          />
        </div>
      </AppLayout>
      <Toast message={builder.toast} />
      <ConfirmDialog
        open={builder.reset}
        title="입력 내용을 초기화할까요?"
        confirmLabel="초기화"
        onCancel={() => builder.setReset(false)}
        onConfirm={() => {
          builder.setProject(emptyProject());
          builder.setReset(false);
          setStep(0);
          builder.setShowIssues(false);
          builder.setToast('입력 내용을 초기화했습니다.');
        }}
      >
        현재 브라우저에 저장된 입력값도 초기화됩니다.
        <br />
        필요한 내용은 먼저 설정 JSON으로 저장하세요.
      </ConfirmDialog>
    </>
  );
}
