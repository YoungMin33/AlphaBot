시퀀스 다이아그램 예제


## 1.1 알람 설정(예제)

### 1.1.1 알람 설정 흐름(예제)
```mermaid
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
```

사용자가 회원가입을 누르면 이메일 인증 → 닉네임 중복확인 → 비밀번호 확인 → 개인정보 입력 → 서버에 가입 요청 후 응답이 오면 로그인 화면으로 전환된다. (예제)



위 형식에 맞춰서 아래에 시퀀스 다이아그램을 작성해주세요.

## 1

### 1.1 종목 상세 정보 조회
```mermaid
sequenceDiagram
    actor User
    participant StockSearchFragment as StockSearchFragment [종목 분석 영역]
    participant StockViewModel
    participant StockRepository
    participant ExternalAPI as ExternalAPI [외부 금융 API]

    User->>StockSearchFragment: 검색창에 종목 입력 & 확정
    StockSearchFragment->>StockViewModel: loadStockDetails(ticker)
    StockViewModel->>StockRepository: fetchRealtime(ticker)
    StockRepository->>ExternalAPI: 실시간 데이터 요청
    ExternalAPI-->>StockRepository: 데이터 응답 (상세 시세)
    StockRepository-->>StockViewModel: 데이터 반환
    StockViewModel-->>StockSearchFragment: 상세 정보 표시 완료 (update UI)
    StockSearchFragment-->>User: 상세 정보 표시 완료
```

사용자가 챗봇 대화창에서 종목 분석 영역을 활성화하거나 버튼을 누른다 → 분석 영역 내 검색창에서 종목명 또는 코드를 입력하고 선택한다 → 상세 정보 탭에 현재가, 등락률, 거래량 등 실시간 시세 정보가 표시된다.

### 1.2 재무제표 조회
```mermaid
sequenceDiagram
    actor User
    participant StockSearchFragment as StockSearchFragment [종목 분석 영역]
    participant StockViewModel
    participant StockRepository
    participant ExternalAPI as ExternalAPI [외부 금융 API]

    Note over StockSearchFragment: '상세 정보' 탭에서 재무제표 탭으로 전환
    User->>StockSearchFragment: 재무제표 탭 클릭
    StockSearchFragment->>StockViewModel: loadFinancials(ticker)
    StockViewModel->>StockRepository: fetchFinancials(ticker)
    StockRepository->>ExternalAPI: 재무 데이터 요청
    ExternalAPI-->>StockRepository: 데이터 응답 (재무제표 데이터)
    StockRepository-->>StockViewModel: 데이터 반환
    StockViewModel-->>StockSearchFragment: 재무제표 표시 완료 (update UI)
    StockSearchFragment-->>User: 재무제표 표시 완료
```

사용자가 종목 분석 영역에서 재무제표 탭을 클릭한다 → 시스템은 해당 종목의 최신 재무제표 데이터를 조회한다 → 재무 상태표, 손익계산서 등의 데이터가 표와 그래프로 화면에 출력된다.

### 1.3 휴지통 관리
```mermaid
sequenceDiagram
    participant User
    participant SidebarFragment
    participant SidebarViewModel
    participant ItemRepository
    participant LocalDB
    User->>SidebarFragment: '휴지통' 메뉴 클릭
    SidebarFragment->>SidebarViewModel: getTrashBinList()
    SidebarViewModel->>ItemRepository: findDeletedItems()
    ItemRepository->>LocalDB: SELECT WHERE DELETE_FLAG = TRUE
    LocalDB-->>ItemRepository: 항목 목록 반환
    ItemRepository-->>SidebarViewModel: 항목 목록 반환
    SidebarViewModel->>SidebarFragment: updateTrashBinList()
    SidebarFragment-->>User: 휴지통 목록 표시
    User->>SidebarFragment: 항목 선택 및 '복원' 버튼 클릭
    SidebarFragment->>SidebarViewModel: restoreItem(itemId)
    SidebarViewModel->>ItemRepository: restoreItem(itemId)
    ItemRepository->>LocalDB: UPDATE DELETE_FLAG = FALSE
    LocalDB-->>ItemRepository: 성공 코드 반환
    Note over SidebarViewModel: 목록 LiveData 갱신
    SidebarViewModel->>SidebarFragment: updateTrashBinList()
    SidebarFragment-->>User: 갱신된 목록 표시
```

사용자가 사이드바에서 휴지통 메뉴를 클릭한다 → 삭제된 대화 기록 및 저장된 답변 목록을 확인한다 → 원하는 항목을 선택하고 복원 또는 영구 삭제 버튼을 누른다 → 목록이 갱신된다.

## 2

### 2.1 채팅 메시지 저장
```mermaid
sequenceDiagram
    actor 사용자 as 사용자 (User)
    participant Frontend as 프론트엔드 (UI)
    participant Backend as 백엔드 (Server)
    participant DB as 데이터베이스
    사용자 ->> Frontend: 특정 메시지의 저장(북마크) 버튼 클릭
    Frontend ->> Backend: API 요청: 메시지 저장 여부 확인 (messageId)
    Backend ->> DB: 해당 메시지(messageId)가 이미 저장되었는지 확인
    alt 메시지가 아직 저장되지 않은 경우
        DB -->> Backend: 저장되지 않은 상태 (false) 반환
        Backend -->> Frontend: 저장 가능 응답 (HTTP 200 OK)
        Frontend ->> 사용자: '카테고리 선택' 팝업 표시
        alt 사용자가 카테고리를 선택하고 "저장"을 선택하는 경우
            사용자 ->> Frontend: 카테고리 선택 후 "저장" 클릭
            alt 기존 카테고리에 저장
                Frontend ->> Backend: API 요청: 메시지 저장 (messageId, categoryId)
            else 새 카테고리 생성
                Frontend ->> Backend: API 요청: 메시지 저장 (messageId, newCategoryName)
            end
            alt 백엔드 저장 처리 성공
                opt 새 카테고리 생성 요청 시
                    Backend ->> DB: 새 카테고리 생성 (newCategoryName)
                    DB -->> Backend: 카테고리 생성 성공
                end
                Backend ->> DB: 메시지를 지정된 카테고리에 저장
                DB -->> Backend: 메시지 저장 성공
                Backend -->> Frontend: 성공 응답
                Frontend ->> 사용자: "메시지가 성공적으로 저장되었습니다" 알림 표시
            break 백엔드 저장 처리 실패
                Backend ->> DB: 데이터 저장 시도 중 오류 발생
                DB -->> Backend: 오류 응답
                Backend -->> Frontend: 실패 응답 (HTTP 500 Internal Server Error)
                Frontend ->> 사용자: "저장에 실패했습니다. 나중에 다시 시도해주세요." 오류 알림 표시 (Ext)
                end
            end
        break 사용자가 저장을 "취소" 버튼을 선택하는 경우
            사용자 ->> Frontend: 팝업의 "취소" 버튼 클릭
            Frontend ->> 사용자: 팝업 닫기
            Frontend ->> 사용자: "저장이 취소되었습니다" 알림 표시 (Ext)
            end
        end
    break 메시지가 이미 저장된 경우
        DB -->> Backend: 저장된 상태 (true) 반환
        Backend -->> Frontend: 실패 응답 (HTTP 409 Conflict)
        Frontend ->> 사용자: "이미 저장된 메시지입니다" 알림 표시 (Ext)
        end
    end
```

사용자가 특정 메시지의 저장(북마크) 버튼을 클릭한다. → 프론트엔드는 백엔드에 해당 메시지가 이미 저장되었는지 확인을 요청한다. → (1. 이미 저장된 경우) 백엔드가 '저장된 상태(true)'를 반환하면, "이미 저장된 메시지입니다" 알림이 표시된다. → (2. 저장이 가능한 경우) 백엔드가 '저장되지 않은 상태(false)'를 반환하면, 사용자에게 '카테고리 선택' 팝업이 표시된다.  
→(저장 선택) 사용자가 카테고리(기존 또는 신규)를 선택하고 "저장"을 클릭하면, 백엔드에 저장을 요청한다. → (1. 저장 성공) 백엔드가 DB에 성공적으로 저장하면, "메시지가 성공적으로 저장되었습니다" 알림이 표시된다. → (2. 저장 실패) DB 저장 중 오류가 발생하면, "저장에 실패했습니다" 오류 알림이 표시된다.  
→(취소 선택) 사용자가 팝업에서 "취소" 버튼을 클릭하면, 팝업이 닫히고 "저장이 취소되었습니다" 알림이 표시된다.



### 2.2 채팅방 삭제
```mermaid
sequenceDiagram
  actor 사용자 as 사용자 (User)
  participant Frontend as 프론트엔드 (UI)
  participant Backend as 백엔드 (Server)
  participant DB as 데이터베이스
  사용자 ->> Frontend: 특정 채팅방의 '삭제' 옵션 클릭
  Frontend ->> 사용자: "이 채팅방을 삭제하시겠습니까?" 팝업 표시
  alt 사용자가 "삭제"버튼을 선택하는 경우
    사용자 ->> Frontend: 팝업의 "삭제" 버튼 클릭
    Frontend ->> Backend: API 요청: 채팅방 삭제
    alt 백엔드 처리 성공
      Backend ->> DB: 채팅방 상태를 '휴지통'으로 업데이트 요청
      DB ->> DB: 채팅방 상태를 "휴지통"으로 업데이트
      DB -->> Backend: 업데이트 성공 응답
      Backend -->> Frontend: 성공 응답 (HTTP 200 OK)
      Frontend ->> Frontend: 채팅 목록에서 해당 채팅방 제거
      Frontend ->> 사용자: "채팅방이 휴지통으로 이동되었습니다" 알림 표시
    break 백엔드 처리 실패
      Backend ->> DB: 채팅방 상태 업데이트 요청
      DB -->> Backend: 오류 응답 (DB 연결 실패)
      Backend -->> Frontend: 실패 응답 (HTTP 500 Internal Server Error)
      Frontend ->> 사용자: "채팅방 삭제에 실패했습니다" 오류 알림 표시
      end
    end
  else 사용자가 "취소"버튼을 선택하는 경우
    사용자 ->> Frontend: 팝업의 "취소" 버튼 클릭
    Frontend ->> Frontend: 팝업닫기
    Frontend ->> 사용자: "채팅방 삭제가 취소되었습니다" 알림 표시
  end
```

사용자가 특정 채팅방의 '삭제' 옵션을 클릭한다. → 프론트엔드가 "이 채팅방을 삭제하시겠습니까?" 팝업을 표시한다.  
→ (삭제 선택) 사용자가 팝업의 "삭제" 버튼을 클릭하면, 프론트엔드는 백엔드에 채팅방 삭제를 요청한다. → (1. 삭제 성공) 백엔드가 DB 상태를 '휴지통'으로 성공적으로 업데이트하면, 프론트엔드는 목록에서 채팅방을 제거하고 "채팅방이 휴지통으로 이동되었습니다" 알림을 표시한다. → (2. 삭제 실패) DB 오류 등으로 백엔드 처리가 실패하면, "채팅방 삭제에 실패했습니다" 오류 알림이 표시된다.  
→ (취소 선택) 사용자가 팝업의 "취소" 버튼을 클릭하면, 팝업이 닫히고 "채팅방 삭제가 취소되었습니다" 알림이 표시된다.


## 3. 검색 기록

### 3.1 검색 기록 조회
```mermaid
sequenceDiagram
participant User
participant SearchScreen
participant SearchController
participant HistoryDatabase

User->>SearchScreen: clickSearchBox
activate SearchScreen
SearchScreen->>SearchController: loadSearchHistory
activate SearchController
SearchController->>HistoryDatabase: getHistory(userId)
activate HistoryDatabase
HistoryDatabase-->>SearchController: return history list
deactivate HistoryDatabase
SearchController-->>SearchScreen: (history list)
deactivate SearchController
alt historyList is not empty
SearchScreen->>SearchScreen: displayHistory(historyList)
else historyList is empty
SearchScreen->>SearchScreen: displayNoHistoryMessage
end
SearchScreen-->>User: Show history list or message
deactivate SearchScreen
```

사용자가 검색창을 누르면, 검색 화면이 컨트롤러에 기록 조회를 요청 → 컨트롤러는 데이터베이스에서 기록을 조회 → 데이터베이스에서 기록 목록을 반환받으면 → 화면에 기록 목록 또는 "기록 없음" 메시지를 표시한다.

### 3.2 검색 기록 삭제
```mermaid
sequenceDiagram
participant User
participant SearchScreen
participant SearchController
participant HistoryDatabase

User->>SearchScreen: clickDeleteItem(itemId)
activate SearchScreen
SearchScreen->>SearchController: deleteHistoryItem(itemId)
activate SearchController
SearchController->>HistoryDatabase: deleteItem(itemId)
activate HistoryDatabase
HistoryDatabase-->>SearchController: success
deactivate HistoryDatabase
deactivate SearchController
SearchScreen->>SearchScreen: removeItemFromList(itemId)
SearchScreen-->>User: List updated
deactivate SearchScreen
```

사용자가 특정 기록의 삭제를 누르면, 검색 화면이 컨트롤러에 삭제를 요청하고 → 컨트롤러는 데이터베이스에서 해당 항목을 삭제한다 → 데이터베이스로부터 성공 응답이 오면 → 화면에서 해당 항목을 제거하여 목록을 갱신한다.

위 형식에 맞춰서 아래에 시퀀스 다이아그램을 작성해주세요.
