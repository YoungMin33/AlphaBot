시퀀스 다이아그램 예제

sequenceDiagram
  autonumber
  actor U as 사용자
  participant W as 웹앱
  participant S as 서버
  participant DB as DB

  U->>W: 액션/클릭
  W->>S: 요청 (JSON)
  S->>DB: 조회/저장
  DB-->>S: 결과
  S-->>W: 응답 (200)
  W-->>U: 화면 업데이트

  Note over S,DB: 트랜잭션/롤백 처리
  alt 성공
    S-->>W: payload
  else 실패
    S-->>W: error
  end
