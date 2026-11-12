# Debt Freedom 웹 소개·지원 개편 — 2026-11-12

## 출시 근거와 범위

- App Store 공개 lookup: `https://itunes.apple.com/lookup?id=6777608452&country=kr`. 현재 1.8.0, 2026-10-05 출시, 가격 0, iOS 15.0 이상 확인. 공식 링크 `https://apps.apple.com/kr/app/id6777608452`.
- Google Play 공개 상세: `https://play.google.com/store/apps/details?id=studio.twinlabs.debtfreedom&hl=ko`. 앱명·개발자·설명·광고 포함·2026-10-05 업데이트·납부일/할부 회차 출시 안내 확인. Android 버전 번호는 공개 페이지에서 단정하지 않는다.
- 양쪽 공개 설명에 있는 전체 완납 예상월, 고금리 우선순위, 추가 상환 효과, 여러 부채 관리, 실제 상환 기록·최근 6개월 추이, 지난 여정 보관을 6개 핵심 기능으로 설명했다.
- 앱 출시 소스 `35c389a`의 pubspec·로컬 Hive 저장·광고 SDK 및 CSV 명세와 대조했다. 현재 앱 저장소에 미커밋된 JSON 백업/복원은 출시 기능으로 홍보하지 않는다. 자동 동기화·복원이나 금융기관 연결을 약속하지 않는다.
- iPhone iOS 15 이상만 명시하고 Android/iPad의 기기별 설치 가능 여부는 스토어 호환성 안내로 연결한다. 무료 이용·광고 포함, 출시 소스에 유료 구독/인앱 구매 없음 확인.
- 기존 스크린샷 자산을 재사용하고 앱 화면 소개 이미지·가상 데이터임을 표시했다. 평점·이용자 수·후기·금융 효과를 만들어 넣지 않았다.

## 검색·배포 설계

- 소개·지원은 index,follow, 각각 고유 title/description/canonical/OG/Twitter 및 WebPage+MobileApplication/ContactPage JSON-LD를 제공한다. 이전 해당 페이지에 noindex는 없었으며 이번에 명시적으로 검색 허용했다.
- 개인정보 문서는 본문·시행일을 보존하고 탐색/접근성을 보완했다. 정책은 noindex,follow로 검색 대표 페이지와 구분하고 사이트맵에서 제외한다.
- 대표 URL은 `https://twinlabs.studio/debt-freedom/`와 `/debt-freedom/support.html`. `/index.html`과 캠페인 쿼리 URL은 대표 URL로 canonical을 통일한다. robots.txt의 기존 전체 허용과 sitemap 위치는 유지하며 사이트맵에 대표 두 페이지만 추가했다.
- 새 1200×630 공유 이미지 `debt-freedom/assets/social.png`를 제공한다. 루트 앱 목록에 출시 상태·두 스토어·소개·지원·정책 링크를 추가했다.
- 기존 GitHub Pages 저장소 `i-kay/twinlabs-site`, main 브랜치·CNAME `twinlabs.studio`를 그대로 사용한다. Sites 스킬의 디자인·검증 지침을 참고하되 기존 GitHub Pages 서비스를 다른 호스팅으로 이전하지 않는다.

## 검증

- `tools/check-debt-freedom.cjs`: Playwright, axe-core, html-validate 사용. `NODE_PATH=/tmp/debt-site-qa/node_modules node tools/check-debt-freedom.cjs` (저장소 루트 실행). 필요한 모듈은 별도 QA 디렉터리에 설치했으며 제품 의존성을 추가하지 않았다.
- 루트·소개·지원·정책 × 360/390/1440px, HTML, axe, 가로 넘침, 이미지, 스킵 링크, FAQ Enter/Space 열기·닫기, 전체 FAQ 확장 시 접근성·넘침 검사. 내부 링크와 앵커, 고유 메타, canonical/OG/Twitter/JSON-LD URL, 공유 이미지, 두 스토어 링크, 사이트맵 모든 URL의 index/canonical 정합성 검사.
- 동일 검사를 공개 배포 URL을 대상으로 다시 실행해 12개 화면·내부 링크 20개·전체 사이트맵에서 문제 0개를 확인했다.
- 결과·스크린샷은 `docs/verification/debt-freedom-*`. 출시 후 공개 응답은 별도 결과로 남긴다.

## 검색 관리 계정 후속

- Google Search Console 로그인된 현재 계정에서 속성 선택기에 `일치하는 속성 없음`을 확인했다. 다른 Google 계정의 등록까지 미등록이라고 단정하지 않는다.
- 사용자 요청 범위에서 URL 접두어 속성 `https://twinlabs.studio/`를 추가했다. Google이 발급한 HTML 태그를 루트에 반영했다. 배포 후 소유권 확인과 사이트맵 제출·URL 검사·색인 요청 결과는 아래 운영 확인에 기록한다.
- Naver `https://searchadvisor.naver.com/console/board`는 네이버 로그인 화면으로 이동했다. 로그인 정보가 제공되지 않아 기존 등록·권한·소유권·사이트맵·수집 요청 상태를 확인하지 못했다. **네이버 작업 미완료**. 로그인 후 기존 `https://twinlabs.studio` 사이트가 있으면 먼저 선택하고, 없으면 추가한다. 서비스가 발급한 HTML 태그/파일로 소유권을 확인한 뒤 `https://twinlabs.studio/sitemap.xml` 제출, 대표 소개/지원 URL 수집 요청을 진행한다. 기존 소유권 검증값은 보존한다.
- 검색엔진 색인·순위 또는 AI 검색 노출·인용은 배포와 별개이며 보장하지 않는다.

## 운영 확인

- 구현/배포 커밋: `5183ebe7894b2051ae3eff528846e55f0ea57347`, origin/main 푸시 완료.
- GitHub Pages 실행 [43189335783](https://github.com/i-kay/twinlabs-site/actions/runs/43189335783) completed/success, 동일 head_sha 확인.
- 공개 URL 15개 HTTP 200, X-Robots-Tag 없음, 본문/이미지/robots/sitemap SHA-256 로컬과 모두 일치. `docs/verification/debt-freedom-public.json` 참조. App Store/Google Play 공식 다운로드 목적지 각각 HTTP 200.
- Google Search Console에서 HTML 태그 방식 **소유권이 확인됨**을 실제 확인했다. 검증 메타태그는 유지한다. 사이트맵 제출 성공 후 상세에서 **사이트맵 처리 완료**, 발견된 페이지 **7개**, 2026-11-12 마지막 읽음을 확인했다. 최초 목록의 일시적 가져올 수 없음은 상세 처리 완료로 해소되었다. 소개 URL 검사에서는 기존 **URL이 Google에 등록되어 있음 / 페이지 색인이 생성됨**이 표시되었다. 변경 반영을 위한 색인 생성 요청을 실행하고 **색인 생성 요청됨 / 우선순위 크롤링 대기열 추가**를 확인했다. 이 요청은 새 본문의 재색인 완료를 의미하지 않는다. 지원 URL도 기존 **URL이 Google에 등록되어 있음 / 페이지 색인이 생성됨** 상태였다. 새 본문 반영 요청 후 **색인 생성 요청됨 / 우선순위 크롤링 대기열 추가**를 확인했다. 두 URL 모두 요청 접수 완료이며 새 본문의 실제 재색인 완료는 확인하지 않았다.
