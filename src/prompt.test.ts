import test from 'node:test';
import assert from 'node:assert/strict';
import { emptyProject, figmaUrl, issues, newGroup, newSection, projectSchema } from './model';
import { generatePrompt, outputFiles } from './prompt';
const url='https://www.figma.com/design/abc/product?node-id=123-456&m=dev';
function valid(){const p=emptyProject();p.name='신규 상품';p.folder='기업/상품/신규 상품';p.sections[0]={...p.sections[0],name:'상품 개요',pc:url};return p;}
test('빈 프로젝트의 필수 입력 누락',()=>assert.ok(issues(emptyProject()).length>=3));
test('PC만 제공하면 PC 파일만 생성, 내부 공백 보존',()=>{const p=valid();assert.deepEqual(issues(p),[]);assert.deepEqual(outputFiles(p),['기업/상품/신규 상품/1.상품 개요/pc.html']);});
test('node-id 있는 Figma https 링크만 허용',()=>{assert.ok(figmaUrl(url));assert.ok(figmaUrl('https://www.figma.com/file/abc/name?node-id=123%3A456'));for(const bad of ['https://figma.com.evil.test/design/a?node-id=1-2','javascript:alert(1)','https://www.figma.com/design/abc/name'])assert.equal(figmaUrl(bad),false);});
test('같은 출력 폴더 중복 방지',()=>{const p=valid();p.sections.push({...p.sections[0],id:'second'});assert.ok(issues(p).some(x=>x.includes('중복')));});
test('선택하지 않은 섹션은 실행 범위와 출력에서 제외',()=>{const p=valid();p.sections.push({...newSection(2),enabled:false,name:'제외 섹션',pc:url});assert.equal(outputFiles(p).length,1);assert.ok(!generatePrompt(p).includes('제외 섹션'));assert.deepEqual(issues(p),[]);});
test('상태 프레임만으로 기기 출력 판단, 탭 수만큼 파일을 늘리지 않음',()=>{const p=valid(),g=newGroup('tabs','MO');g.key='pricing';g.items[0].url=url;g.items.push({...g.items[0],id:'second',url:url.replace('123-456','123-789')});p.sections[0].groups=[g];p.sections[0].moType='tabs';assert.equal(outputFiles(p).length,2);assert.deepEqual(issues(p),[]);assert.match(generatePrompt(p),/대상 기기 : MO/);});
test('탭 일부 링크 누락 및 구성 불일치 감지',()=>{const p=valid(),g=newGroup('tabs','PC');g.key='main';p.sections[0].groups=[g];const errors=issues(p);assert.ok(errors.some(x=>x.includes('상태 Figma')));assert.ok(errors.some(x=>x.includes('구성 방식')));});
test('아코디언의 열린/닫힌 상태 및 소속 탭 보존',()=>{const p=valid(),g=newGroup('accordion','PC');g.key='faq';g.position='탭 1';g.items[0].url=url;g.items[0].closed=url.replace('123-456','123-789');p.sections[0].pcType='accordion';p.sections[0].groups=[g];assert.deepEqual(issues(p),[]);const t=generatePrompt(p);assert.match(t,/소속 탭 \/ 그룹 위치 : 탭 1/);assert.match(t,/접힌 상태 Figma 프레임 URL : https:/);});
test('가이드 전문 기본 포함 및 별도 첨부 모드',()=>{const p=valid();assert.match(generatePrompt(p),/\[참고 문서: CQM_김형윤.md 전문\]/);p.includeGuides=false;assert.ok(!generatePrompt(p).includes('[참고 문서: CQM_김형윤.md 전문]'));assert.match(generatePrompt(p),/문서가 없으면/);});
test('샘플 변수는 입력값으로 주입하지 않음',()=>{const p=valid();p.includeGuides=false;const vars=generatePrompt(p).split('[명령문]')[0];assert.ok(!vars.includes('87551'));assert.ok(!vars.includes('AI빌딩넷'));assert.match(vars,/\[VAR-04\] 상품명 : 신규 상품/);});
test('GTM 명시 선택과 확정값, CDN 경로 처리',()=>{const p=valid();p.gtm='태깅 보존값';p.cdn='https://example.com/images';assert.ok(!generatePrompt(p).includes('태깅 보존값'));p.tagging=true;assert.match(generatePrompt(p),/태깅 보존값/);assert.match(generatePrompt(p),/https:\/\/example.com\/images\//);p.gtm='';assert.ok(issues(p).some(x=>x.includes('GTM')));});
test('잘못된 JSON 구조와 버전 거절',()=>{assert.equal(projectSchema.safeParse({version:2}).success,false);assert.equal(projectSchema.safeParse(valid()).success,true);});
test('출력 경로 탈출과 잘못된 섹션명 방지',()=>{const p=valid();p.folder='../외부';p.sections[0].name='bad/name';assert.ok(issues(p).some(x=>x.includes('상대경로')));assert.ok(issues(p).some(x=>x.includes('문자')));});
