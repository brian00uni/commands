import { readFile, writeFile, mkdir } from 'node:fs/promises';

// Add a source bundle here when a new content type is implemented.
const bundles = [
  {
    id: 'cqm',
    command: 'docs/source/cqm/CQM명령문_김형윤(1).md',
    guide: 'docs/source/cqm/CQM_김형윤(1).md',
    common: 'docs/source/common/공통규칙01.md',
    output: 'src/features/cqm/data/documents.json',
  },
];
const root = new URL('../', import.meta.url);
const read = async (path) => (await readFile(new URL(path, root), 'utf8')).replace(/\r\n/g, '\n');
const check = process.argv.includes('--check');
for (const bundle of bundles) {
  const [template, guide, common] = await Promise.all([
    read(bundle.command),
    read(bundle.guide),
    read(bundle.common),
  ]);
  const marker = '\n[명령문]\n';
  const start = template.indexOf(marker);
  const end = template.indexOf('\n```', start + marker.length);
  if (start < 0 || end < 0)
    throw new Error(`${bundle.command}: 명령문 코드 블록을 찾을 수 없습니다.`);
  const data = { command: template.slice(start + marker.length, end), guide, common };
  if (check) {
    const existing = JSON.parse(await read(bundle.output));
    if (JSON.stringify(existing) !== JSON.stringify(data)) {
      throw new Error(
        `${bundle.id}: 원본과 앱 문서 데이터가 다릅니다. npm run documents:sync를 실행하세요.`,
      );
    }
    console.log(`${bundle.id}: 원본 문서와 생성 데이터 일치`);
  } else {
    await mkdir(new URL('./', new URL(bundle.output, root)), { recursive: true });
    await writeFile(new URL(bundle.output, root), JSON.stringify(data, null, 2) + '\n');
    console.log(`${bundle.id}: ${bundle.output} 갱신 완료`);
  }
}
