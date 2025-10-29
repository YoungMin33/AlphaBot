![AlphaBot Use Case Diagram](./useCaseDiagram.png)

### Use Case #N : <제목>

**Summary**  
: 

**Scope / Level**  
: <Scope>, <Level>

**Author / Last Updated**  
: <Author>, <Last Updated>

**Actors**  
: Primary – <>, Secondary – <>

**Status**  
: <Analysis / Draft / …>

**Preconditions**  
: 

**Trigger**  
: 

**Post Conditions**  
: Success – <> / Failed – <>

**Main Flow**
1. 
2. 
3. 

**Extensions**
- 2a. <조건> → 2a1. <동작>
- 3b. <조건> → 3b1. <동작>

**Related**
- Performance: ≤ n s / Frequency: / Concurrency: / Due Date:








### Use Case #예제 : 종목 검색

**Summary**  
: 사용자가 티커/종목명을 입력해 관련 종목 목록과 핵심 메타데이터를 조회한다.

**Scope / Level**  
: 종목 정보 조회 및 관리, User level

**Author / Last Updated**  
: 김지광(예제), 2025-10-29

**Actors**  
: Primary – 인증 사용자  
: Secondary – 외부 금융 데이터 API, 시스템(검색 캐시/로그)

**Status**  
: Analysis

**Preconditions**  
: 로그인 상태, 네트워크 연결 가능, 외부 API 자격 정보 유효

**Trigger**  
: 검색창에 티커/종목명 입력 후 Enter 또는 검색 아이콘 클릭

**Post Conditions**  
: Success – 결과 목록 표시 및 검색어가 검색 기록에 저장됨 / Failed – 오류 또는 결과 없음 안내, 검색 기록 미저장

**Main Flow**
1. 사용자가 검색어(티커/종목명)를 입력한다.
2. 시스템이 입력을 검증 및 정규화한다.
3. (선택) 자동완성 후보를 제시한다.
4. 사용자가 검색을 확정한다.
5. 시스템이 캐시를 조회하고, 미적중 시 외부 금융 데이터 API를 호출한다.
6. 시스템이 결과를 정렬·정규화하여 목록을 구성한다.
7. 시스템이 결과 목록(티커, 종목명, 거래소, 현재가 요약 등)을 표시한다.
8. 시스템이 검색어와 시각을 사용자 검색 기록에 저장한다.

**Extensions**
- 2a. 입력 공백/최소 글자수 미달 → “검색어를 입력하세요” 메시지, 종료
- 5a. API 타임아웃/오류 → 1회 재시도, 캐시 있으면 캐시 사용·없으면 오류 안내
- 6a. 결과 0건 → “일치하는 종목이 없습니다”와 검색 도움말 노출
- 8a. 비인증 사용자 → 결과는 표시, 검색 기록 저장은 생략
- 5b. 호출 제한 초과 → 지수 백오프 적용 후 실패 시 안내 배너

**Related**
- Performance: 캐시 ≤ 0.5 s, API ≤ 2 s
- Frequency: 상시
- Concurrency: 제한 없음(서버에서 레이트 리밋)
- Due Date: N/A

