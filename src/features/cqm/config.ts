export const cqmConfig = {
  id: 'cqm',
  title: 'CQM 콘텐츠 제작',
  subtitle: '상품 퍼블리싱 워크스페이스',
  pageTitle: 'CQM 명령문 생성기',
  // Preserve v1 to keep existing local drafts and exported JSON compatible.
  storageKey: 'cqm-studio-project-v1',
  settingsFile: 'cqm-settings.json',
  promptFile: 'cqm-prompt.md',
  maxImportBytes: 2_000_000,
  steps: ['기본 정보', 'Figma 디자인', '에셋 · 버튼', '생성 설정'],
} as const;
