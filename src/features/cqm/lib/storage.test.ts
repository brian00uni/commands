import test from 'node:test';
import assert from 'node:assert/strict';
import { cqmConfig } from '../config';
import { emptyProject } from '../model';
import { loadProject, saveProject } from './storage';
function memoryStorage(initial?: string) {
  const values = new Map<string, string>();
  if (initial) values.set('cqm-studio-project-v1', initial);
  return {
    getItem: (key: string) => values.get(key) ?? null,
    setItem: (key: string, value: string) => {
      values.set(key, value);
    },
  };
}
test('구조 개편 후에도 기존 v1 키와 JSON을 읽는다', () => {
  const old = emptyProject();
  old.name = '기존 프로젝트';
  old.folder = '기업/상품/기존';
  const storage = memoryStorage(JSON.stringify(old));
  assert.equal(cqmConfig.storageKey, 'cqm-studio-project-v1');
  assert.deepEqual(loadProject(storage), old);
});
test('저장과 복원에서 섹션과 선택값을 유지한다', () => {
  const p = emptyProject();
  p.includeGuides = false;
  p.sections[0].enabled = false;
  const storage = memoryStorage();
  saveProject(storage, p);
  assert.deepEqual(loadProject(storage), p);
});
test('유효하지 않은 저장값을 자동으로 덮어쓰지 않는다', () => {
  const storage = memoryStorage('{broken');
  assert.throws(() => loadProject(storage));
  assert.equal(storage.getItem(cqmConfig.storageKey), '{broken');
});
test('저장 접근 실패를 호출자에게 전달한다', () => {
  assert.throws(
    () =>
      saveProject(
        {
          setItem: () => {
            throw new Error('storage blocked');
          },
        },
        emptyProject(),
      ),
    /storage blocked/,
  );
});
