import test from 'node:test';
import assert from 'node:assert/strict';
import { emptyProject, newGroup, newSection } from './defaults';
import { inputProgress } from './progress';
import { issues } from './validation';

function filledProject() {
  const p = emptyProject();
  p.name = '상품';
  p.folder = '기업/상품';
  p.sections[0].name = '개요';
  p.sections[0].pc = 'https://www.figma.com/design/test/name?node-id=1-2';
  return p;
}
test('선택 입력과 기본 설정은 필수 분모에서 제외', () => {
  const p = filledProject();
  assert.equal(inputProgress(p).percent, 100);
  assert.equal(inputProgress(p).total, 5);
  assert.equal(inputProgress(p).steps[2].total, 0);
  assert.equal(inputProgress(p).steps[3].total, 0);
  assert.deepEqual(issues(p), []);
});
test('동적 탭 그룹 및 버튼·GTM 필수 입력 반영', () => {
  const p = filledProject();
  p.sections[0].pcType = 'tabs + accordion';
  assert.equal(inputProgress(p).completed, 5);
  assert.equal(inputProgress(p).total, 7);
  const group = newGroup('tabs', 'PC');
  group.key = 'main';
  group.items[0].url = p.sections[0].pc;
  p.sections[0].groups.push(group);
  assert.equal(inputProgress(p).completed, 7);
  assert.equal(inputProgress(p).total, 8);
  p.buttons.push({ id: 'button', text: '이동', url: '', action: '', location: '' });
  p.tagging = true;
  assert.equal(inputProgress(p).steps[2].completed, 1);
  assert.equal(inputProgress(p).steps[2].total, 4);
});
test('제외 섹션은 무시하고 생성 대상이 없으면 미완료', () => {
  const p = filledProject();
  p.sections.push({ ...newSection(2), enabled: false });
  assert.equal(inputProgress(p).percent, 100);
  p.sections[0].enabled = false;
  assert.ok(inputProgress(p).percent < 100);
});
test('입력 완료와 유효성 검증은 구별', () => {
  const p = filledProject();
  p.sections[0].pc = 'invalid';
  assert.equal(inputProgress(p).percent, 100);
  assert.ok(issues(p).length > 0);
  p.name = '   ';
  assert.ok(inputProgress(p).percent < 100);
});
