# Debt Freedom 대표 페이지 배포 체크리스트

## 변경 파일

- `debt-freedom/index.html`
- `debt-freedom/assets/app-icon.png`
- `debt-freedom/assets/app-store-badge-ko.svg`
- `debt-freedom/assets/google-play-badge-ko.png`
- `debt-freedom/assets/screenshot-debt-free-date.png`
- `debt-freedom/assets/screenshot-priority.png`
- `debt-freedom/assets/screenshot-add-debt.png`

## 배포 전

- [ ] 위 HTML과 이미지 파일이 모두 배포 대상에 포함되었는지 확인한다.
- [ ] `npx --yes html-validate debt-freedom/index.html`이 통과하는지 확인한다.
- [ ] `git diff --check`가 통과하는지 확인한다.
- [ ] 실제 App Store URL이 HTTP 200으로 응답하는지 확인한다.
- [ ] 실제 Google Play URL이 HTTP 200으로 응답하는지 확인한다.
- [ ] 지원 페이지와 개인정보처리방침이 변경 없이 유지되는지 확인한다.
- [ ] 앱의 현재 가격, 광고 포함 여부 및 지원 OS가 페이지 표시와 일치하는지 확인한다.
- [ ] 스크린샷에 실제 사용자의 개인정보가 포함되지 않았는지 확인한다.

## 배포 후

- [ ] `https://twinlabs.studio/debt-freedom/`이 정상적으로 열린다.
- [ ] 모바일 390px에서 가로 스크롤 없이 단일 열로 표시된다.
- [ ] 데스크톱 1440px에서 기능·화면·사용 단계가 3열로 표시된다.
- [ ] 상단과 하단의 App Store 배지가 올바른 앱 상세 페이지로 이동한다.
- [ ] 상단과 하단의 Google Play 배지가 올바른 앱 상세 페이지로 이동한다.
- [ ] 앱 아이콘, 스토어 배지와 앱 스크린샷이 모두 표시된다.
- [ ] `지원 · 문의`, `개인정보처리방침`, `TwinLabs 홈` 링크가 정상 동작한다.
- [ ] 키보드 Tab 이동 시 다운로드 배지와 푸터 링크에 포커스 표시가 나타난다.
- [ ] 브라우저 콘솔에 파일 로딩 오류가 없는지 확인한다.

## 네이버 블로그 연결

- [ ] 블로그 소개 및 앱 소개 글의 링크를 `https://twinlabs.studio/debt-freedom/`으로 설정한다.
- [ ] 게시글별 UTM 파라미터를 추가해 랜딩페이지 유입을 구분한다.
- [ ] 네이버 모바일 앱에서 링크가 외부 브라우저 또는 스토어로 정상 연결되는지 확인한다.

## 배포 보류 조건

다음 중 하나라도 해당하면 배포를 보류한다.

- 앱스토어 링크가 404 또는 다른 앱으로 연결된다.
- 스크린샷이나 배지가 배포 서버에서 로드되지 않는다.
- 가격, 지원 OS 또는 개인정보 저장 방식이 실제 앱과 다르다.
- 모바일 화면에서 본문이나 설치 버튼이 잘리거나 가로 스크롤이 발생한다.
