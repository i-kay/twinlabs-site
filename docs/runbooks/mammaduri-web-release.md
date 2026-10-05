# 맘마두리 웹 미리보기·공개 절차

## 현재 상태
2026-10-05: 소개·지원·개인정보 검토본 구현. 공개 배포하지 않았다. 모든 새 페이지에 `noindex`를 두었으며 스토어 링크는 출시 준비 상태다. 기존 Debt Freedom 및 다른 앱 페이지는 변경하지 않았다. TwinLabs 루트에는 맘마두리 카드만 추가했다.

## 미리보기
저장소 루트에서 실행:

```sh
python3 -m http.server 8765 --bind 127.0.0.1
```

- http://127.0.0.1:8765/mammaduri/
- http://127.0.0.1:8765/mammaduri/support.html
- http://127.0.0.1:8765/mammaduri/privacy-policy.html

## 자동 검증
Node.js와 macOS Google Chrome 필요. 웹 자체는 빌드나 npm 패키지를 요구하지 않는다. 검증 의존성은 별도 임시 경로에 설치한다.

```sh
npm install --prefix /tmp/mammaduri-web-qa playwright axe-core html-validate
NODE_PATH=/tmp/mammaduri-web-qa/node_modules node tools/check-mammaduri.cjs
```

결과는 `docs/verification/mammaduri-check.json`, 화면은 같은 디렉터리의 PNG다. Chrome 경로는 다른 운영체제에서 수정한다. HTML 문법·접근성, 내부 링크/앵커, 이미지 로드, 가로 넘침 및 첫 키보드 포커스를 확인한다. HTML 형식 규칙은 Prettier 기본 출력에 맞춘다. 자동 검사는 법률 검토나 모든 보조공학 사용자 검증을 대신하지 않는다.

## 이번 검증
- 3개 페이지 × 360/390/1440px에서 렌더링, HTML 검사와 axe 검사.
- 모바일·데스크톱 캡처에서 배치·문구·버튼·문서 읽기 흐름 점검.
- 내부 링크/앵커 정상, 이미지 누락 및 가로 넘침 없음.
- Tab 시작 시 본문 건너뛰기, Enter로 FAQ 열기 확인. FAQ 모두 펼친 상태도 검사.
- 가상 아이 이름만 사용. 비밀키·실제 회원·식단 정보 없음.
- 이메일 링크는 직접 발송해야 접수됨. 실제 문의 메일 전송이나 수신 테스트는 수행하지 않음.

## 공개 전 운영 확인
1. `privacy-policy.html#review`의 문의·로그·백업 보유기간, 위탁/국외 이전 고지, 법정대리인 절차를 운영 기준과 맞춰 확정한다. 검토본 문구를 제거하고 실제 시행일을 기입한다.
2. 앱에서 정식 방침·지원 링크를 열 수 있게 연결하고, 필요한 동의/안내 절차를 구현한다.
3. 문의함의 외부 메일 수신 및 담당자 답변·본인 확인·삭제 요청 처리 절차를 확인한다. 비밀번호나 토큰을 요청하지 않는다.
4. 공개 스토어 링크가 확인되면 출시 안내를 교체한다. 미출시 상태로 안내 사이트를 공개할 경우에는 출시 준비 표기를 유지한다.
5. 최신 main과 변경을 비교해 다른 앱 작업과 병합 충돌을 해결한다. 기존 페이지 변경을 덮어쓰지 않는다.
6. 저장소의 GitHub Pages 배포 브랜치/경로 설정을 확인하고 검토된 변경만 병합·배포한다. 이번 환경에서는 gh 로그인이 없어 Pages 설정 API까지 확인하지 못했다.
7. 정식 공개 시 검색 허용 대상의 noindex를 제거하고 canonical/소셜 공유 메타데이터를 실제 공개 주소로 확정한다.
8. 배포 후 HTTPS와 `/mammaduri/`, `/mammaduri/support.html`, `/mammaduri/privacy-policy.html`의 HTTP 응답·모바일 화면·삭제 요청 링크를 다시 확인한다. 스토어의 지원/개인정보/삭제 요청 URL을 등록한다.

## 수정·회수
정적 HTML/CSS와 `mammaduri/assets/icon.png`가 배포 대상이다. 문제가 생기면 해당 변경 커밋만 되돌려 재배포한다. 앱 또는 Firebase 데이터는 이 웹 배포에 포함되지 않는다.
