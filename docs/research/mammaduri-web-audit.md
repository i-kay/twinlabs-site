# 맘마두리 웹페이지 근거 조사

조사일: 2026-10-05. 대상 앱: 맘마두리 1.0.0(3), 현재 내부 테스트 구현. 웹 작업은 `mammaduri-web-pages` worktree에 한정한다. 앱 코드·운영 설정을 변경하거나 사용자 식단을 조회하지 않았다.

## 참조와 작업 범위

`twinlabs-site/debt-freedom/index.html`의 핵심 메시지 → 기능 → 화면 → 사용 단계 → 이용 정보 → 지원/개인정보 링크 구조를 참고한다. 정적 HTML과 로컬 자산으로 구성된 기존 사이트에 `/mammaduri/`를 추가한다. 색상, 기능 설명, 분석 코드, 개인정보 문구는 맘마두리에 맞게 새로 작성한다. 원본 사이트 저장소에는 별도의 채권온도 devlog가 있어 전용 worktree로 분리했다.

원본 Debt Freedom은 기기 저장 중심이고 별도 로그인 없음이라고 안내하지만 맘마두리는 소셜 로그인과 가족 공유를 제공한다. Debt Freedom의 GA 측정 ID·광고/분석 SDK 안내·스토어 URL을 복사하면 안 된다. `CNAME`은 `twinlabs.studio`다. GitHub Pages 설정 API는 이 환경의 gh 미로그인으로 확인하지 못했으며 공개 서버 응답과 배포 담당 설정을 구분한다. Debt Freedom의 세 공개 페이지는 HTTP 200 및 Server: GitHub.com 응답을 확인했다. 맘마두리 Android 패키지의 Play 공개 주소는 조회 당시 404였다.

## 앱 구현으로 확인한 사실

앱 저장소: `/Users/twinlabs/Projects/apps/toddler_meal`.

| 영역 | 확인한 동작 | 코드 근거 |
| --- | --- | --- |
| 아이 정보 | 별명과 내부 ID. 생년월일·사진·알레르기 입력 기능 없음 | `lib/models/meal_data.dart` |
| 식단·기록 | 날짜, 끼니, 메뉴, 대상 아이, 먹은 상태, 반응. 공통 계획과 아이별 실제 기록 분리 | 위 파일, `lib/controllers/meal_controller.dart` |
| 게스트 | 로그인 전 로컬 JSON 저장 및 한 세대 백업 파일. 기록 초기화 시 원본·백업·임시 파일 제거 | `lib/repositories/local_store.dart` |
| 가족 | 계정 UID, 가족 ID, 구성원 역할·가입시각, 식단/기록 payload, 변경 시각·revision. 최대 보호자 8명 | `functions/service.js` |
| 초대 | 코드 원문 대신 해시 저장. 24시간 유효, 사용 시 삭제. 만료 시각 도달만으로 즉시 물리 삭제하는 TTL은 코드에 없음 | `functions/service.js` |
| 인증 | Android: 카카오·Google, iOS: 카카오·Google·Apple. 다른 제공자의 계정 자동 병합 없음 | `lib/services/cloud_service.dart` |
| 카카오 | 토큰 유효성과 해당 앱인지 서버에서 확인한 뒤 카카오 회원번호 기반 Firebase UID 생성. 프로필/이메일 API 조회 없음 | `functions/service.js`, `functions/index.js` |
| Google·Apple | 제공자 인증을 Firebase로 전달. 제공 범위에 따라 이메일·표시 이름·프로필 등 인증 데이터가 Firebase 계정에 포함될 수 있음. 앱 UI가 표시하지 않는다는 이유로 미수집이라 쓰지 않음 | `lib/services/cloud_service.dart` |
| 권한 | 같은 가족의 구성원만 가족 문서 읽기. 클라이언트 직접 쓰기 금지, 서버 API가 권한 확인 | `firestore.rules`, `functions/service.js` |
| 기기 사본 | Firestore 영구 캐시 비활성, 앱 자체 저장소로 오프라인 변경 보존. 오프라인 기기는 권한 철회 확인 후 정리 | `lib/services/cloud_service.dart` |
| 회원 삭제 | 제공자 재인증/연결 해제 후 서버 가족 탈퇴 및 Firebase 사용자 삭제. 다른 가족이 남으면 공동 식단 유지. 마지막 구성원이면 가족 상태·초대 삭제 | `lib/services/cloud_service.dart`, `functions/service.js` |
| 관리자 | 다른 구성원이 남아 있으면 관리자 탈퇴/회원 삭제 제한. 먼저 구성원 정리 필요 | 위 파일 |
| 로그아웃 | 서버 계정/공동 기록 유지. 전송 대기 먼저 해결하고 기기의 연결된 가족 기록 정리 | `lib/services/cloud_service.dart` |
| 진단 | 기능 사용 횟수·저장/동기화 오류 상태는 기기에 저장. 사용자가 문의용 상태를 복사해 직접 전송할 수 있음 | `lib/repositories/metrics_store.dart`, `lib/controllers/meal_controller.dart` |
| 내보내기 | 아이 별명·메뉴 포함 JSON 공유. 자동 재가져오기 UI 없음 | `lib/screens/meal_app.dart` |
| SDK | Firebase Core/Auth/Firestore/Functions, 카카오, Google 로그인. AdMob·Analytics·Crashlytics 의존성 없음 | `pubspec.yaml` |

2026-10-05 Firebase CLI 읽기 전용 확인: 현재 개발 Firestore의 `locationId=asia-northeast3`(서울), PITR 비활성, 버전 보존 3600초. Functions 소스 리전도 서울이다. 이 설정만으로 인증·제공자 운영 데이터까지 국내 처리된다고 주장할 수 없다. 운영 프로젝트가 달라지면 다시 확인한다.

## 공식 자료와 적용

- [개인정보위 2026 작성지침 개정 안내](https://pipc.go.kr/np/cop/bbs/selectBoardArticle.do?bbsId=BS074&mCode=&nttId=12021): 로컬 기능이 있어도 서버 처리 내용을 안내해야 한다. 실제 항목·목적·기간·외부 처리·권리행사를 구체적으로 기술한다. 이번 조사는 공식 개정 안내와 안내서 목록을 확인했으며 전체 지침 PDF를 정독했다고 주장하지 않는다.
- [Firebase 개인정보·보안](https://firebase.google.com/support/privacy): 인증은 미국 데이터센터에서 처리된다. 인증 IP 로그는 수 주간, 계정 데이터는 개발자의 삭제 요청 후 실서비스/백업에서 최대 180일 내 제거된다고 안내한다. 이 기간은 앱의 모든 식단이나 모든 로그에 일괄 적용되는 기간이 아니다.
- [Google Play 계정 삭제 요구사항](https://support.google.com/googleplay/android-developer/answer/13327111?hl=ko): 앱 재설치 없이 요청할 수 있는 웹 경로가 필요하다. 앱 이름, 눈에 띄는 삭제 안내, 문의 이메일 경로와 삭제/유지 범위를 함께 제공한다.
- [Apple 계정 삭제 안내](https://developer.apple.com/support/offering-account-deletion-in-your-app/): 인앱 계정 삭제와 로그인 제공자 연결 해제는 별도로 점검한다.
- [GitHub 개인정보 안내](https://docs.github.com/en/site-policy/privacy-policies/github-general-privacy-statement): 웹 호스팅 사업자의 접속 데이터 처리는 앱의 식단 저장과 구분한다.

## 확정 사항과 공개 전 확인 사항

사용자 확인: 공개 운영자/문의 담당 표기는 **TwinLabs / 맘마두리 개인정보 담당자**, 연락처는 **hello@twinlabs.studio**. Google 로그인 동의용 Google 그룹 주소와 혼동하지 않는다.

공개 맘마두리 App Store URL은 확인되지 않았고 검색 결과 부재만으로 미출시를 단정하지 않는다. 검증된 공개 URL이 확보되기 전에는 출시 준비 중으로 표시하고 가짜 다운로드 링크·대기자 정보 수집 폼을 만들지 않는다.

현재 코드는 아동 관련 동의 UI, 개인정보처리방침 외부 링크, 국외 이전 안내/동의 절차를 제공하지 않는다. 공개 출시 전 법적 근거와 법정대리인 안내, 국외 이전 고지/동의 등 적용 요건을 확정해야 한다. 보호자용 앱이라는 문구만으로 아동정보 의무가 없어지는 것은 아니다.

문의 이메일 보존/파기 운영 기간, 전체 서버 로그 및 예약 백업 보존, 외부 처리자 계약/연락처와 이전 국가·근거는 별도 운영 확인이 필요하다. 임의로 30일·90일 등 기간을 사실처럼 쓰지 않는다. 개인정보 페이지는 이 미확정 항목을 식별할 수 있는 **시행 전 검토본**으로 제공하며 정식 시행일은 임의로 만들지 않는다. 이번 세션의 완료는 페이지 제작·로컬 검증·배포 준비이며 공개 배포나 법률 적합성 보증이 아니다.
