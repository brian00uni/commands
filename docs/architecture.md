# 구조와 개발 규칙

[README로 돌아가기](../README.md)

## 참조와 적용 범위

참조한 [appresso README](https://github.com/brian00uni/appresso/blob/main/README.md)는 페이지, 공통 UI, 레이아웃, 메뉴 설정, 훅, 라이브러리, 스타일을 분리합니다. 이 프로젝트도 같은 역할 구분을 사용하되 CQM의 제작 규칙을 하나의 기능 디렉토리에 모았습니다. 참고 README blob SHA: `4de156198074b3e7ba03e8b99d14ed479249457d`.

appresso의 인증·DB·차트·상태 관리 라이브러리는 해당 서비스의 요구사항입니다. 현재 앱에는 도입하지 않았습니다. `partials`와 `components/layout`의 역할이 겹치지 않도록 레이아웃은 한 위치에서 관리합니다. 대소문자 차이에 의한 경로 혼동을 줄이기 위해 디렉토리는 소문자, React 컴포넌트 파일은 PascalCase로 사용합니다.

## 책임과 의존 방향

| 위치                | 책임                           | 피할 내용                    |
| ------------------- | ------------------------------ | ---------------------------- |
| `App.tsx`           | 최상위 화면 연결, 향후 라우팅  | 폼 필드·명령문 문자열        |
| `pages`             | 레이아웃과 기능 컴포넌트 조합  | 원본 파싱·업무 검증 규칙     |
| `components/layout` | 재사용 가능한 화면 틀          | CQM 모델 직접 참조           |
| `components/ui`     | 필드·패널·알림·확인 대화상자   | 상품명·VAR 번호·기능 저장 키 |
| `config`            | 공통 메뉴 정의                 | 개별 상품 입력값             |
| `hooks`             | 기능에 종속되지 않는 훅        | CQM 섹션 수정 규칙           |
| `lib/browser`       | 파일 다운로드 등 브라우저 기능 | CQM 파일명·출력 규칙         |
| `features/cqm`      | CQM 폼·상태·검증·생성·저장     | 다른 유형의 규칙             |
| `docs/source`       | 전달받은 원본 문서             | 앱 개발 지시·자동 포맷       |
| `scripts`           | 문서 데이터 갱신·검사          | 브라우저 코드에 포함할 도구  |

페이지는 `features/cqm/index.ts`를 통해 기능을 가져옵니다. 기능 내부에서는 가까운 모델·유틸을 상대경로로 참조합니다. 공통 컴포넌트는 기능을 import하지 않고 필요한 정보와 콜백을 props로 받습니다. 다른 콘텐츠 유형이 CQM 내부 파일을 참조하지 않도록 유지합니다.

## 변경 전후 매핑

| 기존                      | 변경 후                                                        |
| ------------------------- | -------------------------------------------------------------- |
| `src/App.tsx` 전체 화면   | `pages/CqmBuilderPage.tsx` + 공통 레이아웃 + 기능 컴포넌트     |
| App 내부 `Field`, `Panel` | `components/ui/Field.tsx`, `Panel.tsx`                         |
| App 내부 상태·이벤트      | `features/cqm/hooks/useCqmBuilder.ts`                          |
| App 내부 저장 접근        | `features/cqm/lib/storage.ts`                                  |
| App 내부 다운로드         | `lib/browser/download.ts`                                      |
| App 내부 알림 타이머      | `hooks/useToast.ts`                                            |
| `src/model.ts`            | `features/cqm/model/{schema,defaults,selectors,validation}.ts` |
| `src/prompt.ts`, 테스트   | `features/cqm/lib/prompt.ts`, `prompt.test.ts`                 |
| `src/data/documents.json` | `features/cqm/data/documents.json`                             |
| `src/style.css`           | `src/css/style.css`                                            |
| `docs/source/*`           | `docs/source/common/*`, `docs/source/cqm/*`                    |
| `docs/product-notes.md`   | `docs/planning/product-notes.md`                               |

## 저장 데이터와 검증 경계

소스 폴더 이동은 사용자 데이터 형식 변경을 의미하지 않습니다. 저장 키 `cqm-studio-project-v1`과 내보낸 JSON의 `version: 1`을 유지합니다. 저장된 값을 읽을 때 Zod로 구조를 검사하고, 입력을 편집한 경우에만 자동 저장합니다. 잘못된 기존 값은 최초 렌더링만으로 덮어쓰지 않습니다.

`model/validation.ts`는 명령문을 복사할 수 있는 입력인지 검사합니다. `schema.ts`는 JSON을 읽을 수 있는 구조인지 검사합니다. 초안에는 빈 필드가 있을 수 있으므로 이 둘을 분리합니다. `lib/prompt.ts`는 React나 localStorage 없이 입력을 받아 결과를 반환합니다. 같은 입력에서 결과가 유지되는지 UI 없이 검증할 수 있습니다.

전체 명령문과 파일 목록 계산은 입력 변경에 맞춰 메모합니다. 안내 패널이나 알림 상태만 바뀔 때 긴 가이드 문자열을 다시 조합하지 않습니다. 공통 확인창은 네이티브 dialog를 사용해 모달 초점과 Escape 처리를 브라우저에 맡깁니다.

## 문서 데이터 관리

`documents.json`은 원본의 중복 편집 장소가 아니라 앱 빌드를 위한 생성물입니다. `scripts/sync-documents.mjs`가 원본 템플릿의 명령문 블록을 추출하고 CQM·공통 가이드를 결합합니다. 스크립트는 저장소 위치를 기준으로 파일을 찾으며 원본의 CRLF를 앱 데이터에서 LF로 통일합니다. 원본 파일 자체는 바꾸지 않습니다.

빌드는 먼저 원본과 생성 데이터의 일치를 검사합니다. 원본을 수정하고 동기화를 빠뜨리면 오래된 규칙으로 빌드되지 않도록 실패합니다. 새 콘텐츠 유형은 스크립트의 bundle 목록에 추가합니다. 문서 구문이 다르면 전용 추출기를 마련하고 공통 추출 방식으로 억지로 맞추지 않습니다.
