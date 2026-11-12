# Real Yield 마케팅 웹 배포 보고서

검증일: 2026-11-12 (KST)

## 구현과 출시 근거

- 소개: https://twinlabs.studio/real-yield/
- 지원: https://twinlabs.studio/real-yield/support.html
- 기존에는 지원·개인정보·면책 페이지만 있었으며 소개 페이지와 루트 앱 카드가 없었다.
- 출시 앱 저장소의 current-features.md, 입력·결과·비교·상세 화면 및 v1.3.0 소스를 대조했다. Apple 공개 lookup에서 앱 ID 6759360893, 버전 1.3.0, 무료, iOS 15.0 이상 및 2026-10-27 공개를 확인했다. Google Play 공식 패키지 studio.twinlabs.realyield의 공개 페이지 HTTP 200과 앱 제목을 확인했다.
- 월세 매물을 검토하는 임대인·투자자를 대상으로 첫 계산, 현금흐름/자기자본 수익률, 로컬 저장/입력 재개, 매물 비교, 복제, 메모의 6개 기능을 설명했다. 입력 → 저장 전 결과 → 저장·비교의 3단계 흐름을 제공한다.
- 실제 1.3.0 iOS 검증 화면을 리사이즈해 사용했다. 화면의 1억 원/월세 50만 원/수익률 6%는 가상 데이터 예시로 표시한다. 실매물·보장 수익이 아니다.
- 로그인 불필요, 기기 내 저장, 클라우드 동기화·앱 내 백업/내보내기 미지원, 무료·광고, 분석 선택, 지원 기기와 계산 한계를 FAQ에 명시했다. 미출시 알림·자동 시세·AI 추천·클라우드 기능은 홍보하지 않는다.
- 소개 상하단·지원·루트 카드에 공식 스토어 링크를 배치했다. 운영자 TwinLabs와 문의, 정책·면책을 공통 하단에 연결했다.

## 검색·공유 설정

루트, Real Yield 소개·지원은 index,follow. 개인정보·면책은 앱 이용자에게 직접 링크로 제공하는 문서로 유지하되 검색 대표 콘텐츠와 구분해 noindex,follow로 설정하고 사이트맵에서 제외했다. 법적 본문과 방침 시행일은 변경하지 않았다.

5개 페이지에 고유 title/description/canonical, OG/Twitter 제목·설명·이미지·공개 URL을 설정했다. WebPage/ContactPage 및 소개의 MobileApplication은 실제 본문과 일치한다. 평점·리뷰는 넣지 않았다. 루트와 앱용 공유 이미지(1200×630)를 각각 제공한다. /real-yield/index.html의 canonical은 /real-yield/다.

기존 robots.txt의 Allow: / 및 사이트맵 안내를 확인했다. 기존 대표 URL을 유지하고 소개·지원 2개만 사이트맵에 추가했다. 특별한 AI 파일은 만들지 않았다. 정적 HTML 본문이 수집의 기반이며 구조화 데이터는 리치 결과, 검색 색인이나 AI 인용을 보장하지 않는다.

## 검증

- tools/check-real-yield.cjs: 루트와 Real Yield 4개 페이지 × 360/390/1440px = 15개 화면.
- HTML 문법, axe 접근성(FAQ 접힘/펼침), 이미지 로드, 가로 넘침, 고유 메타데이터, canonical/OG/Twitter/JSON-LD URL, 스토어 링크, 사이트맵 범위 검사 통과.
- 내부 링크·앵커 19개 확인. 첫 Tab 본문 건너뛰기 및 Enter 이동, FAQ Enter 열기/Space 닫기 확인.
- 데스크톱·모바일 소개와 펼친 지원 FAQ를 캡처로 시각 검토했다. 결과: docs/verification/real-yield-check.json, 같은 폴더의 PNG.
- 개인정보·면책은 내용 유지, 탐색·스타일·검색 메타데이터만 정비했다.
- 자동 접근성 검사는 모든 보조공학 사용자 환경에 대한 인증을 의미하지 않는다. 문의 메일은 실제 발송하지 않았다.

재실행: 별도 임시 경로에 playwright, axe-core, html-validate를 설치하고 저장소 루트에서 python3 -m http.server 8766 --bind 127.0.0.1 실행. NODE_PATH=/tmp/mammaduri-web-qa/node_modules node tools/check-real-yield.cjs. 테스트는 macOS Chrome 경로를 사용한다.

## 검색 서비스 운영 후속 작업

2026-11-12 공개 DNS TXT와 저장소의 루트·앱 HTML을 확인했으나 Google/Naver 검증 레코드·태그를 찾지 못했다. 이것만으로 미등록이라고 단정할 수 없다. 현재 브라우저 접근 호스트가 동작하지 않아 로그인된 Search Console·네이버 계정의 기존 속성, 권한과 등록 여부는 확인하지 못했다. 소유권 확인, 사이트맵 제출, URL 검사와 색인 요청은 **미완료**다.

1. https://search.google.com/search-console 에서 twinlabs.studio 기존 속성과 계정 권한을 확인한다. 기존 속성이 있으면 중복 생성하지 않는다. 도메인 속성은 서비스가 발급한 DNS TXT, URL 접두어 속성은 제공되는 검증 방식을 사용한다.
2. 권한 확보 후 https://twinlabs.studio/sitemap.xml 을 제출한다. /real-yield/ 및 /real-yield/support.html 을 URL 검사하고 실제 수집 가능 여부·Google 선택 canonical을 확인한 뒤 색인 요청한다.
3. https://searchadvisor.naver.com/ 에서 기존 사이트 등록 및 소유권을 확인한다. 발급된 HTML 파일/메타 태그 등으로 검증 후 같은 사이트맵 제출과 웹페이지 수집 요청을 진행한다.
4. 제출 후 색인 상태, 노출·클릭, 검색어를 관찰한다. 앱 사용자 증가의 효과를 판단하려면 스토어 유입/설치 및 앱 활성화 지표를 함께 비교해야 한다. 배포만으로 유입 증가를 주장하지 않는다.

## 배포 확인

콘텐츠 커밋을 main에 push 후 GitHub Pages Actions와 공개 응답을 확인하고 아래에 결과를 기록한다.

### 공개 검증 완료

- 콘텐츠 배포 커밋: 3dfe97df569a3f99bf6ed595dcfdecca5785a3ea (main push 완료).
- GitHub Pages [실행 43187840932](https://github.com/i-kay/twinlabs-site/actions/runs/43187840932): completed / success.
- 공개 URL 13개(루트, 소개 대표/별칭, 지원, 정책·면책, CSS, 이미지 4개, robots.txt, sitemap.xml)의 HTTP 200을 확인했다. X-Robots-Tag는 없었고 공개 응답 본문 SHA-256이 로컬 검증 파일과 모두 일치했다. 따라서 새 본문, 다운로드 링크, canonical/공유/JSON-LD와 사이트맵이 그대로 배포되었음을 확인했다. 정책·면책의 HTML noindex는 의도된 설정이다.
- 공개 검증 원본: docs/verification/real-yield-public.json. 재검증: node tools/check-real-yield-public.cjs (curl 필요).
- 이 보고서와 공개 검증 증거를 기록하는 후속 커밋은 사이트 콘텐츠를 바꾸지 않는다.
- 남은 작업: Search Console·네이버 기존 등록/권한 확인 및 소유권 검증, 사이트맵 제출·URL 검사·수집/색인 요청. 검색 색인 및 AI 인용은 배포와 별개이며 보장하지 않는다.
