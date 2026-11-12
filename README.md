# Prompt Studio

Markdown 제작 가이드와 작업별 입력값을 결합해 **Codex·Kiro 등에 붙여넣을 전체 명령문**을 만드는 React 앱입니다. 현재 v1.0.0은 **CQM 상품 제작**을 지원하며, 같은 버전의 기능 보강과 새로운 콘텐츠 유형 추가를 고려해 구성했습니다.

## 문서 안내

| 문서                                                        | 내용                                            |
| ----------------------------------------------------------- | ----------------------------------------------- |
| [사용 가이드](docs/guides/usage.md)                         | 입력 순서, VAR-00~09, 저장·복사, 원본 적용 기준 |
| [대시보드 디자인](docs/design-system.md)                    | Mantis 참조 기준, 테마, 카드·메뉴·반응형        |
| [구조와 개발 규칙](docs/architecture.md)                    | 폴더 역할, 의존 방향, 기존 구조에서의 변경      |
| [기능 확장 가이드](docs/guides/extending.md)                | CQM에 필드 추가, 새로운 유형 추가, 문서 갱신    |
| [변경 이력](CHANGELOG.md)                                   | 현재 버전에서 반영한 변경과 호환성              |
| [설계 근거와 확장 아이디어](docs/planning/product-notes.md) | 초기 설계 분석 및 향후 제안 12개                |

## 기술 스택

| 분류        | 사용 기술                 | 역할                            |
| ----------- | ------------------------- | ------------------------------- |
| 화면        | React 19 + TypeScript 5.9 | 입력 폼·미리보기·타입 검사      |
| 개발·빌드   | Vite 7                    | 로컬 개발 서버·정적 번들        |
| 스타일      | CSS                       | 공통 레이아웃·반응형 스타일     |
| 아이콘      | lucide-react              | UI 아이콘                       |
| 데이터 검사 | Zod 4                     | 저장된 작업·JSON 파일 구조 검증 |
| 테스트      | Node test runner + tsx    | 명령문 생성·저장 호환성 검사    |
| 코드 형식   | Prettier                  | TSX·CSS·문서 가독성과 형식 통일 |

설치 버전은 `package-lock.json`에 기록합니다. 상태 관리는 React 훅을 사용합니다. 현재는 단일 화면으로, 별도 라우터·전역 상태 라이브러리·인증·DB가 필요하지 않습니다.

## 환경과 시작하기

Node.js **v24.15.0**, npm **11.12.1**의 기존 설치를 확인해 사용했습니다. `.nvmrc`에 Node 버전을 고정했습니다. 별도 환경 변수나 API 키는 필요하지 않습니다.

```bash
# nvm을 사용하는 경우
nvm install
nvm use

npm ci           # lockfile 기준 설치
npm run dev      # http://127.0.0.1:5173 (사용 중이면 다음 포트)
npm run build    # 문서 일치 + 타입 검사 + dist/ 빌드
npm run preview  # 빌드 결과 미리보기
```

새 의존성을 추가할 때는 `npm install <패키지>`를 사용하고 `package-lock.json`도 함께 관리합니다. 패키지 설치에는 레지스트리 접근이 필요합니다.

## 화면 및 기능

현재 `/`에서 CQM 명령문 생성기를 제공합니다. 사이드바의 원본 문서 안내는 같은 화면에서 열리는 안내 패널이며, 별도 URL은 아직 없습니다.

| 영역          | 현재 기능                                                                |
| ------------- | ------------------------------------------------------------------------ |
| 기본 정보     | 상품명, 작업 폴더, 전체 참고용 Figma 링크                                |
| Figma 디자인  | 여러 섹션, 실행 대상 선택, PC/MO 독립 구성, 탭·아코디언 상태 링크        |
| 에셋·버튼     | CDN, RMS, 로컬 에셋, 버튼별 연결, 명시적인 GTM 입력                      |
| 생성 설정     | 대상 AI, 추가 요청, 제작 가이드 전문 포함 여부                           |
| 미리보기      | 전체 명령문, 실제 입력 기준 예상 출력 파일, 입력 오류 안내               |
| 저장·내보내기 | 브라우저 자동 저장, JSON 저장/불러오기, 클립보드 복사, Markdown 다운로드 |

실제 Figma 접속·상품 HTML 생성은 명령문을 전달받은 AI가 수행합니다. URL 검사는 형식 검사이며 디자인 접근 가능 여부를 확인하지 않습니다. 입력값은 외부 서버로 전송하지 않습니다.

## 디렉토리 구조

[appresso README의 역할별 디렉토리 구분](https://github.com/brian00uni/appresso#readme)을 참고했습니다. 공통 화면은 `components`, 페이지는 `pages`, 메뉴는 `config`, 공통 훅은 `hooks`에 두고, 콘텐츠 유형별 규칙은 `features`에 추가로 분리했습니다.

```text
commands/
├── src/
│   ├── App.tsx                         # 최상위 페이지 연결
│   ├── main.tsx                        # React 진입점·전역 CSS
│   ├── components/
│   │   ├── layout/                     # AppLayout, Header, Sidebar
│   │   └── ui/                         # Field, Panel, ConfirmDialog, Toast
│   ├── config/
│   │   └── navigation.ts               # 공통 사이드바 메뉴 정의
│   ├── css/
│   │   ├── fonts.css                   # 로컬 SUIT Variable 웹폰트
│   │   └── style.css                   # 공통·반응형 스타일
│   ├── hooks/
│   │   └── useToast.ts                  # 공통 알림 상태와 타이머
│   ├── lib/
│   │   └── browser/download.ts         # 브라우저 파일 다운로드
│   ├── themes/
│   │   └── index.tsx                   # MUI 테마·CssBaseline
│   ├── pages/
│   │   └── CqmBuilderPage.tsx           # CQM 화면과 공통 레이아웃 조합
│   └── features/
│       └── cqm/
│           ├── index.ts                # 외부에 노출하는 기능 진입점
│           ├── config.ts               # 단계·저장 키·파일명·용량 제한
│           ├── components/
│           │   ├── DashboardSummary.tsx # 현재 입력 기준 작업 요약 카드
│           │   ├── BuilderHeader.tsx   # 설정 저장·불러오기·초기화 진입
│           │   ├── SourceNotice.tsx    # 원본 문서 안내
│           │   ├── PromptPreview.tsx   # 명령문·출력 파일·복사
│           │   └── steps/              # 기본 정보 / 디자인 / 에셋·버튼 / 설정
│           ├── hooks/
│           │   └── useCqmBuilder.ts    # CQM 편집 상태·저장·입출력 제어
│           ├── model/
│           │   ├── schema.ts           # Zod 스키마와 타입
│           │   ├── defaults.ts         # 새 상품·섹션·그룹 기본값
│           │   ├── selectors.ts        # 폴더명·기기 유무 계산
│           │   ├── validation.ts       # 입력값 일관성 검사
│           │   └── index.ts            # 모델 내부 진입점
│           ├── lib/
│           │   ├── prompt.ts           # 명령문·출력 파일 생성
│           │   ├── prompt.test.ts      # 생성 규칙 테스트
│           │   ├── storage.ts          # 브라우저 저장 읽기·쓰기
│           │   └── storage.test.ts     # v1 저장 호환성 테스트
│           └── data/
│               └── documents.json     # 원본에서 생성한 데이터
├── docs/
│   ├── design-system.md               # Mantis 디자인 적용 기준
│   ├── architecture.md                # 구조와 의존 관계
│   ├── guides/                        # 사용법·기능 확장 방법
│   ├── planning/                      # 설계 근거·향후 제안
│   └── source/
│       ├── common/                    # 공통규칙 Markdown 원본
│       └── cqm/                       # CQM 가이드·명령문 원본
├── scripts/
│   └── sync-documents.mjs              # 원본 → 앱 데이터 동기화·검사
├── public/fonts/suit/                 # SUIT Variable WOFF2·SIL OFL 라이선스
├── .nvmrc                             # Node 버전
├── .prettierrc.json                    # 코드 형식 규칙
├── .prettierignore                     # 원본·자동 생성 파일 포맷 제외
├── package.json / package-lock.json    # 스크립트·의존성
├── tsconfig.json / vite.config.ts      # 타입 검사·개발 서버 설정
├── CHANGELOG.md                        # 변경 이력
└── README.md
```

`dist/`, `node_modules/`, `*.tsbuildinfo`는 Git에서 제외합니다. `public/fonts/suit/`의 폰트와 라이선스는 빌드 시 그대로 배포됩니다.

## 대시보드 디자인

[Mantis Free React Admin Template](https://github.com/codedthemes/mantis-free-react-admin-template)의 Vite 레이아웃과 카드·테마 구성을 참고했습니다. 좌측 메뉴(260px/76px), 상단 헤더, 작업 요약 카드 4개, 입력·미리보기 2열로 구성합니다. 작은 화면에서는 메뉴가 드로어로 바뀌고 입력·미리보기가 세로로 배치됩니다. 상세 기준은 [디자인 문서](docs/design-system.md)를 참고하세요.

## 데이터 흐름과 호환성

```text
pages/CqmBuilderPage
  → features/cqm/hooks/useCqmBuilder
  → model: 스키마·기본값·검증
  → lib/prompt: 변수 + 실행 명령문 + 확정 출력 + 선택 가이드
  → components/PromptPreview: 확인·복사·다운로드

원본 Markdown → documents:sync → data/documents.json
                          documents:check → 빌드 전 불일치 검사
```

기존 `cqm-studio-project-v1` 저장 키와 JSON의 `version: 1`을 유지합니다. 구조 변경 전에 저장한 프로젝트를 그대로 읽습니다. 새 필드를 추가할 때는 기존 JSON의 기본값·마이그레이션을 함께 다뤄야 합니다.

## 원본 문서 갱신

원본은 `docs/source/common`과 `docs/source/cqm`에 보관합니다. 앱용 `documents.json`을 직접 편집하지 말고 아래 명령을 사용하세요.

```bash
npm run documents:sync   # 원본 Markdown을 앱용 JSON으로 갱신
npm run documents:check  # 원본과 앱 데이터 일치 여부 확인
```

가이드의 제작 지시는 **생성되는 명령문의 자료**입니다. React 앱 개발 지시로 해석하지 않습니다. 과거 상품 예시는 기본값으로 주입하지 않으며 현재 입력 범위를 우선합니다. 자세한 적용 순서는 [사용 가이드](docs/guides/usage.md)에 설명했습니다.

## 개발 명령과 검증

```bash
npm test              # 모든 기능의 *.test.ts 자동 검색
npm run typecheck     # TypeScript 검사
npm run build         # 문서 일치·타입 검사·프로덕션 빌드
npm run format        # 코드·관리 문서 포맷 정리 (원본 제외)
npm run format:check  # 형식 검사
```

구조 변경 전후의 전체 명령문·출력 목록 일치와 기존 JSON 저장 호환성을 확인합니다. 실제 상품 HTML 제작·Figma 접근·스크린리더 평가는 이 테스트의 범위가 아닙니다. 이번 작업 환경에서는 브라우저 연결·컴퓨터 제어 권한이 없어 시각·클릭 검증은 별도로 필요합니다.

## 다음 기능을 추가할 위치

- **현재 CQM 개선**: `features/cqm` 안의 단계 컴포넌트·모델·생성기를 수정합니다.
- **블로그 등 새 유형**: `features/<유형>`과 `pages/<유형>BuilderPage`를 추가합니다.
- **공통 UI**: 여러 유형에 실제로 공통인 기능만 `components/ui`로 올립니다.
- **메뉴·화면 전환**: 현재 `config/navigation.ts`, `App.tsx`에서 관리하고, 복수 URL이 필요해질 때 라우터를 도입합니다.

아직 구현하지 않은 유형의 메뉴·빈 모듈은 만들지 않았습니다. 단계별 추가 절차와 저장 데이터 변경 방법은 [기능 확장 가이드](docs/guides/extending.md)를 참고하세요.

## 글꼴

[SUIT 공식 배포](https://sun.fo/suit/)의 SUIT Variable을 화면 전체(MUI, 메뉴, 폼, 명령문 미리보기)에 사용합니다. WOFF2 파일을 프로젝트에 포함하므로 실행 중 외부 폰트 CDN을 요청하지 않습니다. 100~900 가변 굵기를 지원하며 `font-display: swap`을 적용했습니다. 원본과 라이선스 정보는 [폰트 안내](public/fonts/suit/README.md)에 기록했습니다.
