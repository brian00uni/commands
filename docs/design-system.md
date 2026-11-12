# Mantis 기반 대시보드 디자인

[README로 돌아가기](../README.md)

## 참조 기준

[Mantis Free React Admin Template](https://github.com/codedthemes/mantis-free-react-admin-template)의 Vite 구현을 참고했습니다. 확인한 저장소 커밋은 `bec0222f77d2298897799c5ba28aaaca797f9c46`입니다.

- [Dashboard 레이아웃](https://github.com/codedthemes/mantis-free-react-admin-template/blob/bec0222f77d2298897799c5ba28aaaca797f9c46/vite/src/layout/Dashboard/index.jsx): 좌측 드로어, 상단 헤더, 본문·푸터 분리
- [MainCard](https://github.com/codedthemes/mantis-free-react-admin-template/blob/bec0222f77d2298897799c5ba28aaaca797f9c46/vite/src/components/MainCard.jsx): 얇은 테두리와 카드 헤더 구분
- [팔레트](https://github.com/codedthemes/mantis-free-react-admin-template/blob/bec0222f77d2298897799c5ba28aaaca797f9c46/vite/src/themes/palette.js): 밝은 중립 배경, 흰색 표면, 회색 텍스트
- [타이포그래피](https://github.com/codedthemes/mantis-free-react-admin-template/blob/bec0222f77d2298897799c5ba28aaaca797f9c46/vite/src/themes/typography.js): 본문과 보조 텍스트의 크기 구분, 절제된 제목 굵기

레이아웃과 시각 체계를 참고해 현재 프로젝트에서 구현했습니다. Mantis의 전체 앱·로고·데모 데이터·인증 화면은 가져오지 않았습니다. 현재 컴포넌트는 기존 TypeScript 기능 구조를 유지합니다.

## 화면 배치

```text
┌────────────────┬─────────────────────────────────────────────┐
│ 브랜드         │ 메뉴 토글 · 현재 화면 · 저장 상태 · 문서 안내 │
│                ├─────────────────────────────────────────────┤
│ 워크스페이스   │ 경로 표시 / 페이지 제목 / 저장·불러오기      │
│                │                                             │
│ 콘텐츠 제작    │ 선택 섹션 / 출력 파일 / 디자인 URL / 입력 오류│
│ · 생성기       │                                             │
│ · 원본 문서    │ ┌───────────────────┬─────────────────────┐ │
│                │ │ 단계별 입력 폼    │ 명령문 미리보기     │ │
│ 가이드 안내    │ │                   │ 출력 구조·복사      │ │
│                │ └───────────────────┴─────────────────────┘ │
│ 로컬 저장 안내 │ 푸터                                        │
└────────────────┴─────────────────────────────────────────────┘
```

요약 카드는 실제 입력을 사용합니다. 선택 섹션만 집계하고, 디자인은 선택 섹션의 PC/MO·상태 URL 중 공백 제거 후 고유 URL 수를 표시합니다. URL 수는 Figma 접근 성공이나 올바른 노드 검증을 뜻하지 않습니다. 예상 파일 수는 기존 CQM 생성 함수의 결과이며, 생성 완료 수가 아닙니다. 확인 항목 카드를 누르면 미리보기의 오류 목록을 펼칩니다.

## 테마와 크기

| 항목           | 값                    |
| -------------- | --------------------- |
| 기본 포인트    | `#1677ff`             |
| 포인트 hover   | `#0958d9`             |
| 선택 메뉴 배경 | `#e6f4ff`             |
| 화면 배경      | `#fafafb`             |
| 카드 표면      | `#ffffff`             |
| 카드 경계      | `#e6ebf1`             |
| 본문           | `#262626`             |
| 보조 텍스트    | `#595959` / `#737373` |
| 헤더 높이      | 64px                  |
| 데스크톱 메뉴  | 260px, 접힘 시 76px   |
| 카드 간격      | 기본 20~24px          |

MUI 테마는 `src/themes/index.tsx`, 기존 폼과 업무 화면 스타일은 `src/css/style.css`에서 관리합니다. MUI 9·Emotion을 사용하며 글꼴은 [SUIT Variable](https://sun.fo/suit/)로 통일합니다. 메뉴·본문·입력·미리보기와 MUI 컴포넌트에 같은 폰트를 적용합니다. `src/css/fonts.css`에서 100~900 굵기의 WOFF2를 선언하며 `public/fonts/suit/`에 폰트와 SIL OFL 라이선스를 보관합니다. 외부 폰트 CDN 요청이나 API 연동은 없습니다.

## 반응형과 상호작용

- 1200px 이상: 고정 메뉴, 헤더 버튼으로 아이콘 메뉴 전환
- 1200px 미만: 임시 드로어, 바깥 클릭·Escape·메뉴 선택 시 닫힘
- 900px 이하: 요약 카드 2열, 입력과 미리보기 세로 배치
- 600px 이하: 제목과 도구 버튼 줄바꿈, 폼 여백 조정, 모바일 입력 글자 크기 확대
- 드로어 초점 관리는 MUI가 처리하며, 메뉴 선택 상태와 열림 상태를 접근성 속성으로 제공합니다.
- 본문 바로가기와 키보드 초점 표시를 유지합니다.

## 확장 시 적용

새 콘텐츠 유형도 `DashboardTheme`와 `AppLayout`을 재사용합니다. 유형별 요약 카드는 해당 기능의 `components`에 두며, 공통 레이아웃에 업무 계산을 넣지 않습니다. 기능이 없는 알림·계정 메뉴나 임의 통계를 만들지 않고 실제 동작이 생길 때 연결합니다.

## 검증 범위

기존 명령문·저장 로직 테스트와 프로덕션 빌드로 기능 연결을 확인합니다. 현재 환경은 연결된 브라우저가 없어 드로어 조작·시각 배치·화면 크기별 실제 렌더링은 미검증입니다. `npm run dev` 실행 후 로컬 브라우저에서 확인할 수 있습니다.
