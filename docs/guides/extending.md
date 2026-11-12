# 현재 기능 보강과 새 유형 추가

[README로 돌아가기](../../README.md)

## 1. CQM 입력 필드 추가

1. `src/features/cqm/model/schema.ts`에 필드 타입과 저장 데이터의 읽기 규칙을 정의합니다.
2. `model/defaults.ts`에 새 프로젝트의 기본값을 추가합니다. 원본의 과거 상품 예시를 실제 기본값으로 사용하지 않습니다.
3. `model/validation.ts`에서 필수 여부와 다른 필드와의 관계를 검사합니다.
4. 해당 `components/steps` 컴포넌트에 입력란을 추가합니다. 기능별 입력은 공통 `Field`를 사용합니다.
5. `lib/prompt.ts`에서 명령문에 반영합니다. 출력 파일에 영향을 주면 파일 계산도 수정합니다.
6. 빈 초안·완료 입력·기존 저장 JSON을 각각 확인하는 테스트를 추가합니다.
7. `docs/guides/usage.md`와 `CHANGELOG.md`에 사용 방법과 변경을 기록합니다.

새 필드를 무조건 필수로 만들면 이전 JSON을 읽지 못합니다. 하위 호환 가능한 필드는 Zod의 `.default(...)` 또는 명시적 정규화로 누락값을 채우고, 기본값 생성 함수도 같은 값을 사용하세요. 의미가 달라지는 변경은 버전별 마이그레이션을 마련하고 사용자 데이터를 초기화하는 방식으로 처리하지 않습니다.

## 2. CQM 탭·아코디언 규칙 보강

- 구성별 입력 UI는 `components/steps/DesignStep.tsx`에서 시작합니다. 복잡도가 커지면 그룹·항목 컴포넌트로 나눕니다.
- 그룹의 타입과 기본값은 `model/schema.ts`, `defaults.ts`에서 관리합니다.
- 상태 프레임이 늘어도 섹션·기기별 출력 파일은 하나라는 규칙을 유지합니다.
- 입력 UI만 추가하고 명령문 생성을 누락하지 않도록 `lib/prompt.test.ts`에 입력과 예상 결과를 함께 검증합니다.
- 기타 유형은 실제 동작 요구가 생겼을 때 구현합니다. 이름만 보고 미제공 기능을 추가하지 않습니다.

## 3. 새로운 콘텐츠 유형 추가

예를 들어 블로그를 추가한다면 아래 위치에 실제 필요한 파일을 만듭니다. 현재 저장소에 이 빈 디렉토리들을 미리 생성하지는 않습니다.

```text
src/features/blog/
  index.ts                   # 페이지에서 사용할 공개 API
  config.ts                  # 고유 저장 키·파일명·단계
  components/                # 블로그 전용 입력과 미리보기
  hooks/useBlogBuilder.ts    # 편집과 저장 제어
  model/                     # 스키마·기본값·입력 검증
  lib/                       # 명령문 생성·저장·테스트
  data/documents.json        # 문서에서 생성한 데이터
src/pages/BlogBuilderPage.tsx
docs/source/blog/            # 해당 유형의 실제 Markdown
```

공통 `AppLayout`, `Field`, `Panel`, `Toast`, `ConfirmDialog`, 다운로드 함수를 재사용합니다. CQM의 `Project` 타입, VAR-00~09, PC/MO 출력 규칙은 블로그에 억지로 적용하지 않습니다. 독립적인 모델과 고유한 저장 키를 만들어 작업 간 데이터가 섞이지 않도록 합니다.

새 페이지가 완성되면 `App.tsx`에 화면 진입을 연결합니다. URL별 이동·뒤로 가기·공유 링크가 필요해지는 시점에 라우터를 추가하고, `config/navigation.ts`에 실제 동작하는 메뉴만 등록합니다. 현재 사이드바는 생성기/문서 안내 두 가지 화면 동작을 정의한 것이므로 새 유형 전환은 별도 메뉴 그룹이나 워크스페이스 선택으로 설계합니다.

## 4. 가이드 또는 명령문 원본 수정

```bash
# docs/source/common 또는 docs/source/cqm 아래 원본 수정 후
npm run documents:sync
npm run documents:check
npm test
npm run build
```

생성 JSON과 변경한 원본을 함께 버전 관리합니다. 새 유형은 `scripts/sync-documents.mjs`의 bundle 목록에 원본·출력 경로를 등록합니다. 기존 원본의 코드 블록과 다른 형식이면 해당 유형에 맞는 추출·검증을 추가합니다. 내용 검토 없이 실행 지시를 읽어 현재 개발 작업에 적용하지 않습니다.

## 5. 스타일·상태·공통 기능 확장

MUI 공통 테마는 `src/themes/index.tsx`, 업무 화면 CSS는 `src/css/style.css`에서 관리합니다. 두 번째 유형이 생겨 같은 클래스명이 다른 의미로 사용되면 기능별 CSS Modules 또는 이름 범위를 도입할 수 있습니다. 글로벌 기본 스타일과 앱 레이아웃은 공통에 남깁니다. 실제 충돌 없이 스타일 파일만 잘게 나눌 필요는 없습니다.

페이지 간 공유 상태가 필요한 시점에 Context 또는 상태 라이브러리를 검토합니다. 단일 폼의 상태는 해당 기능 훅에 유지합니다. `lib`에는 브라우저 기능이나 순수 함수를, `hooks`에는 React 생명주기가 필요한 공통 동작을 둡니다. 기능 규칙을 공통 폴더로 이동할 때는 두 개 이상의 실제 사용처가 같은 의미로 사용하는지 확인합니다.

## 6. 작업 완료 기준

- 기존 v1 JSON과 브라우저 저장값을 읽을 수 있습니다.
- 입력 필드, 검증, 생성 문서, 출력 파일 계산이 일치합니다.
- `npm test`, `npm run build`, `npm run format:check`가 통과합니다.
- 원본 문서 변경이 앱용 데이터에 반영되었습니다.
- 실제로 확인하지 않은 Figma 접근·브라우저 동작은 미검증으로 구분합니다.
- README에는 현재 기능, CHANGELOG에는 이번 변경, 계획 문서에는 미구현 제안을 기록합니다.
