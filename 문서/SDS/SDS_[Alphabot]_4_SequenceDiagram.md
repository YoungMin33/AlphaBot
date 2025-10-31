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
시퀀스: 가격/이벤트 알림 설정 → 알림 수신

┌────────────┐     ┌─────────┐     ┌───────────────┐     ┌──────────────┐     ┌──────────────┐
│   사용자   │     │ 프론트  │     │   Alert API   │     │ 시세엔진(ENG) │     │ Notification │
└────┬───────┘     └────┬────┘     └──────┬────────┘     └──────┬───────┘     └──────┬───────┘
     │ 입력: AAPL ≤ 180 │                │                         │                     │
     │─────────────────▶│                │                         │                     │
     │                  │ POST /alerts   │                         │                     │
     │                  │───────────────▶│                         │                     │
     │                  │                │ 검증/저장               │                     │
     │                  │                │───────────┐             │                     │
     │                  │◀───────────────│201 Created│             │                     │
     │                  │                └───────────┘             │                     │
     │                  │                         (주기적/이벤트)  │                     │
     │                  │                ┌──────────────────────────┴───────────────┐    │
     │                  │                │  ENG: 시세 수신 → 조건 평가(AAPL≤180?)  │    │
     │                  │                └──────────────┬───────────────────────────┘    │
     │                  │                               │  true                         │
     │                  │                               │──────────────────────────────▶│
     │                  │                               │ send(userId, message)         │
     │                  │                               │                               │ 전송(Push/App)
     │                  │                               │                               │────────▶ 사용자
| # | From     | To         | Message / Action                        | Notes                        |
|---|----------|------------|-----------------------------------------|------------------------------|
| 1 | 사용자   | 프론트     | 알림 조건 입력(AAPL ≤ 180)              |                              |
| 2 | 프론트   | Alert API  | POST /alerts {stock, rule}              | 유효성 검사                  |
| 3 | Alert API| 프론트     | 201 Created {alertId}                    |                              |
| 4 | 시세엔진 | Alert API  | GET /alerts?stock=AAPL                  | 주기/이벤트 트리거           |
| 5 | Alert API| 시세엔진   | 활성 알림 목록                           |                              |
| 6 | 시세엔진 | 시세엔진   | 조건 평가 (≤ 180 ?)                      | 충족 시 다음 단계            |
| 7 | 시세엔진 | Notification| send(userId, message)                  |                              |
| 8 | Notification | 사용자 | 푸시/앱 알림 전달                        |                              |
U(사용자)         FE(프론트)          API                DB/Redis            외부/엔진
──────────        ───────────          ───────────        ───────────         ───────────
입력 제출 ─────▶  검증/직렬화 ─────▶   POST /path ───▶    트랜잭션/조회        (이벤트/시세)
응답 표시 ◀─────  응답 처리  ◀──────   200/4xx ◀──────    커밋/롤백            트리거/웹훅
Note: 실패 시 재시도/토스트 노출, 성공 시 라우팅

sequenceDiagram
  autonumber
  actor U as User
  participant FE as Frontend
  participant A as Alert API
  participant E as PriceEventEngine
  participant N as Notification

  U->>FE: Set rule (AAPL ≤ 180)
  FE->>A: POST /alerts
  A-->>FE: 201 Created

  par Ticks/Webhooks
    E->>E: Ingest quotes
  and Events
    E->>A: GET /alerts?stock=AAPL
    A-->>E: Active alert list
  end

  E->>E: Evaluate condition
  alt Triggered
    E->>N: send(userId, message)
    N-->>U: Push/App notification
  else Not yet
    E->>E: wait next tick
  end
