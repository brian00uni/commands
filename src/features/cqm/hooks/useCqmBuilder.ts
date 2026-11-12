import { useEffect, useMemo, useRef, useState } from 'react';
import { useToast } from '../../../hooks/useToast';
import { emptyProject, issues, newGroup, projectSchema } from '../model';
import type { Group, Project, Section } from '../model';
import { generatePrompt, outputFiles } from '../lib/prompt';
import { loadProject, saveProject } from '../lib/storage';
import { cqmConfig } from '../config';
export function useCqmBuilder() {
  const [project, setProject] = useState<Project>(() => {
      try {
        return loadProject(localStorage);
      } catch {
        return emptyProject();
      }
    }),
    [step, setStep] = useState(0),
    [preview, setPreview] = useState<'prompt' | 'files'>('prompt'),
    [saved, setSaved] = useState('이 브라우저에 자동 저장'),
    [showIssues, setShowIssues] = useState(false),
    [reset, setReset] = useState(false),
    [docs, setDocs] = useState(false);
  const importRef = useRef<HTMLInputElement>(null),
    previewRef = useRef<HTMLTextAreaElement>(null);
  const { toast, setToast } = useToast();
  const initialProject = useRef(project);
  const errors = useMemo(() => issues(project), [project]);
  const prompt = useMemo(() => generatePrompt(project), [project]);
  const files = useMemo(() => outputFiles(project), [project]);
  const selected = project.sections.filter((s) => s.enabled),
    ready = errors.length === 0;
  const change = <K extends keyof Project>(key: K, value: Project[K]) =>
    setProject((p) => ({ ...p, [key]: value }));
  useEffect(() => {
    if (project === initialProject.current) return;
    try {
      saveProject(localStorage, project);
      setSaved('브라우저에 저장됨');
    } catch {
      setSaved('자동 저장 불가 · JSON으로 저장하세요');
    }
  }, [project]);
  function updateSection(id: string, patch: Partial<Section>) {
    change(
      'sections',
      project.sections.map((s) => (s.id === id ? { ...s, ...patch } : s)),
    );
  }
  function updateGroup(s: Section, id: string, patch: Partial<Group>) {
    updateSection(s.id, {
      groups: s.groups.map((g) => (g.id === id ? { ...g, ...patch } : g)),
    });
  }
  function addGroup(s: Section, kind: Group['kind'], device: Group['device']) {
    const key = device === 'PC' ? 'pcType' : 'moType';
    const current = s[key];
    updateSection(s.id, {
      groups: [...s.groups, newGroup(kind, device)],
      [key]: current.includes(kind)
        ? current
        : [current === '일반' ? '' : current, kind].filter(Boolean).join(' + '),
    });
  }
  async function copy() {
    if (!ready) {
      setShowIssues(true);
      setToast('필수 입력 항목을 먼저 확인해 주세요.');
      return;
    }
    try {
      await navigator.clipboard.writeText(prompt);
      setToast('전체 명령문을 복사했습니다. AI 도구에 붙여넣으세요.');
    } catch {
      setPreview('prompt');
      requestAnimationFrame(() => {
        previewRef.current?.focus();
        previewRef.current?.select();
      });
      setToast('클립보드 접근이 제한되었습니다. 미리보기에서 전체 선택 후 ⌘/Ctrl+C로 복사하세요.');
    }
  }
  async function importFile(file?: File) {
    if (!file) return;
    try {
      if (file.size > cqmConfig.maxImportBytes) throw Error();
      const parsed = projectSchema.parse(JSON.parse(await file.text()));
      setProject(parsed);
      setToast('입력 설정을 불러왔습니다.');
    } catch {
      setToast('올바른 CQM 설정 JSON 파일(2MB 이하)을 선택해 주세요.');
    }
    if (importRef.current) importRef.current.value = '';
  }

  return {
    project,
    setProject,
    step,
    setStep,
    preview,
    setPreview,
    toast,
    setToast,
    saved,
    showIssues,
    setShowIssues,
    reset,
    setReset,
    docs,
    setDocs,
    importRef,
    previewRef,
    errors,
    prompt,
    files,
    selected,
    ready,
    change,
    updateSection,
    updateGroup,
    addGroup,
    copy,
    importFile,
  };
}
export type CqmBuilderController = ReturnType<typeof useCqmBuilder>;
