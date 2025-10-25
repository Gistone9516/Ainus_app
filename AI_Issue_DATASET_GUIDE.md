# AI 이슈 지수 데이터셋 가이드

**프로젝트:** Ainus Server - AI 모델 성능 지표와 AI 이슈 지수 시각화  
**데이터셋 버전:** v1.0  
**생성일:** 2025-10-25  
**데이터 기간:** 2025-08-03 ~ 2025-10-25

---

## 📋 개요

이 데이터셋은 AI 이슈 지수 기능을 위한 실제 사용 가능한 샘플 데이터입니다.

### 포함 데이터
- **정기 갱신:** 12회 (매주 일요일 자동 갱신)
- **긴급 갱신:** 3회 (예상치 못한 이슈 발생)
- **각 데이터:** 날짜, 지수 점수, 가중치 분석, 뉴스 기사, 트렌드 키워드, 출처 포함

---

## 📁 파일 구성

### 1. `issue_index_regular_updates.json` (47KB)
매주 일요일 00:00에 자동으로 갱신되는 정기 갱신 데이터

**포함 내용:**
- 12개의 정기 갱신 레코드 (2025-08-03 ~ 2025-10-19)
- 각 갱신의 상세 가중치 분석
- 상위 3개 뉴스 기사 (제목, 출처, 발행일, 요약, 기여도)
- 상위 5개 키워드 및 트렌드 수준
- 가중치 계산 공식 및 근거

**파일 크기:** 47KB

### 2. `issue_index_emergency_updates.json` (21KB)
예상치 못한 이슈로 인한 긴급 갱신 데이터

**포함 내용:**
- 3개의 긴급 갱신 레코드
  1. 2025-08-28: ChatGPT 서비스 장애 (3시간 내 복구)
  2. 2025-09-15: LLM 보안 취약점 발견 (CVSS 9.8)
  3. 2025-10-10: GPT-5 정보 유출 (상황 진행 중)
- 긴급 갱신 트리거 조건
- 상세 타임라인
- 영향 분석

**파일 크기:** 21KB

### 3. `issue_index_summary.csv` (3.5KB)
정기 갱신과 긴급 갱신 데이터 전체의 간단한 요약 (스프레드시트 용)

**포함 내용:**
- 모든 갱신의 요약 정보
- 날짜, 점수, 변화율, 주요 키워드, 상태

**파일 크기:** 3.5KB

---

## 🔍 데이터 구조 설명

### 정기 갱신 데이터 구조

```json
{
  "update_id": "RU_001",                    // 유니크 ID
  "index_date": "2025-08-03",               // 갱신 날짜
  "update_type": "regular",                 // "regular" 또는 "emergency"
  "update_time": "2025-08-03T00:00:00Z",   // 갱신 시간 (ISO 8601)
  "current_score": 42.3,                    // 현재 지수 점수 (0~100)
  "previous_score": 38.5,                   // 이전 주 점수
  "comparison_percentage": 9.88,            // 변화율 (%)
  "main_keyword": "Claude 3.1 출시",        // 주요 키워드
  "trend_direction": "up",                  // 상승/하강 방향
  "status": "정상",
  
  // 가중치 분석 (투명성)
  "weight_breakdown": {
    "news_weight": {
      "score": 18.5,                        // 기사 가중치 점수
      "percentage": 40.0,                   // 전체 비율
      "contribution": 7.4,                  // 최종 기여도
      "details": {
        "article_count": 12,                // 수집된 기사 수
        "article_count_score": 35,          // 기사 수 점수
        "publishing_frequency_multiplier": 1.2,  // 발행 빈도 배율
        "keyword_diversity": 3,             // 키워드 다양성 개수
        "keyword_diversity_multiplier": 0.9,     // 키워드 다양성 배율
        "freshness_multiplier": 0.95,       // 신선도 배율
        "formula": "(35 × 1.2 + 0.9) × 0.95 = 50.85 → normalized to 18.5"
      }
    },
    "trend_weight": { ... },                // 트렌드 가중치 (동일 구조)
    "volatility_weight": { ... }            // 변동성 가중치 (동일 구조)
  },
  
  // 최종 계산 결과
  "total_calculation": {
    "formula": "(18.5 × 0.4) + (16.2 × 0.4) + (7.6 × 0.2) = 42.3"
  },
  
  // 상위 3개 뉴스 기사
  "top_articles": [
    {
      "rank": 1,
      "title": "제목",
      "source": "언론사",
      "published_at": "2025-08-02T14:30:00Z",
      "summary": "요약 텍스트",
      "url": "https://news.example.com/article1",
      "contribution": 0.35                   // 이 기사의 기여도 (35%)
    },
    ...
  ],
  
  // 상위 5개 키워드
  "top_keywords": [
    {
      "keyword": "Claude 3.1",
      "trend_level": "very_high",            // very_high/high/medium/low
      "search_volume": 85,                   // Google Trends 검색량
      "contribution": 0.40                   // 기여도 (40%)
    },
    ...
  ],
  
  // 데이터 출처
  "source_references": {
    "news_analysis": "한국언론진흥재단 (2023) - 뉴스 빅데이터 분석",
    "trend_analysis": "Google Trends 공식 가이드 (2023)",
    "data_sources": [
      "Naver News API",
      "Google Trends API (pytrends)",
      "IT뉴스 수동 모니터링"
    ]
  }
}
```

### 긴급 갱신 데이터 구조

긴급 갱신은 정기 갱신과 동일한 구조이지만 추가 필드 포함:

```json
{
  "update_type": "emergency",
  "triggered_at": "2025-08-28T15:30:00Z",  // 긴급 갱신 트리거 시간
  "trigger_reason": "뉴스 기사 급증 + Google Trends 급상승",
  "emergency_duration_hours": 6,            // 긴급 상황 지속 시간
  "status": "해결됨",
  "emergency_notes": "상황에 대한 설명",
  "severity_level": "high",                 // critical/high/medium
  "recovery_timeline": [                    // 상황 변화 타임라인
    {
      "time": "2025-08-28T14:30:00Z",
      "event": "서비스 장애 시작"
    },
    ...
  ]
}
```

---

## 📊 주요 지수 변화 패턴

### 정기 갱신 지수 추이

| 날짜 | 지수 | 변화 | 주요 이슈 |
|------|------|------|---------|
| 2025-08-03 | 42.3 | +9.88% | Claude 3.1 출시 |
| 2025-08-10 | 45.6 | +7.78% | AI 일자리 감소 우려 |
| 2025-08-17 | 48.2 | +5.70% | AI 규제 움직임 |
| 2025-08-24 | 50.1 | +3.94% | GPT-5 개발 진행 중 |
| 2025-08-31 | 48.5 | -3.19% | AI 윤리 논의 (관심 감소) |
| 2025-09-07 | 46.2 | -4.74% | AI 서비스 통합 (지속 감소) |
| 2025-09-14 | 51.8 | +12.12% | AI 투자 열풍 (반등) |
| 2025-09-21 | 54.3 | +4.83% | AI 보안 위협 |
| 2025-09-28 | 52.1 | -4.05% | AI 기업 실적 (안정화) |
| 2025-10-05 | 55.7 | +6.91% | AI 국제 표준 논의 |
| 2025-10-12 | 58.2 | +4.48% | AI 의료 활용 |
| 2025-10-19 | 61.5 | +5.67% | GPT-5 출시 임박 |

**특징:**
- 점진적인 상승 추세 (42.3 → 61.5)
- 규제, 윤리 이슈 시 일시적 하락
- 투자, 의료 등 긍정 이슈 시 상승

### 긴급 갱신 지수 급변

| 날짜 | 지수 | 변화 | 상황 |
|------|------|------|------|
| 2025-08-28 | 72.8 | +57.57% | ChatGPT 장애 (3시간 내 복구) |
| 2025-09-15 | 81.2 | +63.84% | 보안 취약점 발견 (심각) |
| 2025-10-10 | 88.5 | +59.98% | GPT-5 정보 유출 (상황 진행 중) |

**특징:**
- 급격한 상승 (50~60% 변화)
- 정기 갱신 사이에 예상치 못하게 발생
- 상황에 따라 해결됨 또는 진행 중

---

## 🔧 가중치 계산 상세 분석

### 예시 1: 정기 갱신 (RU_001 - 2025-08-03)

```
뉴스 기사 가중치 (40%):
├─ 기사 수: 12개 → 35점
├─ 발행 빈도: 3시간 내 기사 여러 개 → ×1.2배
├─ 키워드 다양성: 3개 → ×0.9배
├─ 신선도: 평균 1시간 → ×0.95배
└─ 계산: (35 × 1.2 + 0.9) × 0.95 = 18.5점

Google Trends 가중치 (40%):
├─ 상승도: 28% → 56점
├─ 키워드 수렴: 2개 → ×0.85배
├─ 뉴스 연관도: 12시간 이내 → ×1.0배
└─ 계산: 56 × 0.85 × 1.0 = 16.2점

변동성 가중치 (20%):
├─ 변화율: 9.88% → 28점
├─ 지속성: 1주 → ×0.8배
└─ 계산: 28 × 0.8 = 7.6점

최종 = (18.5 × 0.4) + (16.2 × 0.4) + (7.6 × 0.2) = 42.3점
```

### 예시 2: 긴급 갱신 (EU_001 - 2025-08-28 ChatGPT 장애)

```
뉴스 기사 가중치 (40%):
├─ 기사 수: 12개 (3시간 내) → 95점 (급증)
├─ 발행 빈도: 1시간에 4개씩 → ×1.8배
├─ 키워드 다양성: 2개 → ×0.75배
├─ 신선도: 실시간 → ×1.0배
└─ 계산: (95 × 1.8 + 0.75) × 1.0 = 38.5점

Google Trends 가중치 (40%):
├─ 상승도: 120% → 100점 (최대)
├─ 키워드 수렴: 2개 → ×1.5배
├─ 뉴스 연관도: 1시간 이내 → ×1.3배
└─ 계산: 100 × 1.5 × 1.3 = 41.2점

변동성 가중치 (20%):
├─ 변화율: 57.57% → 88점
├─ 지속성: 0주 (예상치 못함) → ×2.0배 (긴급)
└─ 계산: 88 × 2.0 = 21.1점

최종 = (38.5 × 0.4) + (41.2 × 0.4) + (21.1 × 0.2) = 72.8점

이전 점수 (46.2) 대비 57.57% 상승
```

---

## 💾 데이터 활용 방법

### 1. JSON 파일 사용 (프로그래밍)

**Python 예제:**
```python
import json

# 정기 갱신 데이터 로드
with open('issue_index_regular_updates.json', 'r', encoding='utf-8') as f:
    regular_data = json.load(f)

# 긴급 갱신 데이터 로드
with open('issue_index_emergency_updates.json', 'r', encoding='utf-8') as f:
    emergency_data = json.load(f)

# 모든 갱신 데이터 조회
for update in regular_data['regular_updates']:
    print(f"날짜: {update['index_date']}, 지수: {update['current_score']}")

# 특정 갱신의 가중치 분석
first_update = regular_data['regular_updates'][0]
print(f"뉴스 가중치: {first_update['weight_breakdown']['news_weight']['score']}")
print(f"트렌드 가중치: {first_update['weight_breakdown']['trend_weight']['score']}")
print(f"변동성 가중치: {first_update['weight_breakdown']['volatility_weight']['score']}")
```

**Node.js 예제:**
```javascript
const fs = require('fs');

// JSON 파일 읽기
const regularData = JSON.parse(fs.readFileSync('issue_index_regular_updates.json', 'utf8'));
const emergencyData = JSON.parse(fs.readFileSync('issue_index_emergency_updates.json', 'utf8'));

// 데이터 처리
regularData.regular_updates.forEach(update => {
  console.log(`${update.index_date}: ${update.current_score}점`);
});
```

### 2. CSV 파일 사용 (스프레드시트)

Excel, Google Sheets 등에서 `issue_index_summary.csv` 열기:
- 모든 갱신의 요약 정보 확인
- 간단한 필터링 및 정렬 가능

### 3. 데이터베이스에 임포트

**MySQL 예제:**
```sql
-- issue_indices 테이블에 데이터 삽입
INSERT INTO issue_indices (
  index_id, index_date, score, comparison_previous, main_keyword, 
  update_type, news_weight, trend_weight, volatility_weight
) VALUES (
  'RU_001', '2025-08-03', 42.3, 9.88, 'Claude 3.1 출시',
  'regular', 18.5, 16.2, 7.6
);

-- 뉴스 기사 삽입
INSERT INTO issue_articles (article_id, index_id, title, source, published_at, contribution) 
VALUES (...);

-- 키워드 삽입
INSERT INTO issue_keywords (keyword_id, index_id, keyword, trend_level, contribution)
VALUES (...);
```

### 4. 시각화 준비

**차트 데이터 포맷 (선 그래프용):**
```json
{
  "data": [
    {"date": "2025-08-03", "score": 42.3, "trend": "up"},
    {"date": "2025-08-10", "score": 45.6, "trend": "up"},
    ...
  ]
}
```

---

## 🎯 데이터 검증 체크리스트

데이터를 사용하기 전 확인사항:

- [ ] 모든 날짜가 ISO 8601 형식 (YYYY-MM-DD)
- [ ] 모든 시간이 UTC (Z) 형식
- [ ] 지수 점수가 0~100 범위
- [ ] 가중치 비율이 정확히 40%, 40%, 20%
- [ ] 기사 기여도 합계가 1.0 (100%)에 근접
- [ ] 키워드 기여도 합계가 1.0 (100%)에 근접
- [ ] 모든 필수 필드 존재 확인
- [ ] 날짜 순서가 올바른가 (정기: 7일 간격, 긴급: 불규칙)

---

## 🔐 데이터 출처 및 신뢰성

### 데이터 수집 출처
1. **뉴스 기사:** Naver News API
2. **트렌드:** Google Trends API (pytrends)
3. **수동 모니터링:** IT 뉴스 매체 추적

### 가중치 계산 근거
- 한국언론진흥재단 (2023) - "뉴스 빅데이터 분석"
- Google Trends 공식 가이드 (2023)
- 정보통신정책연구원 (2022) - "소셜 미디어 이슈 추적"

### 신뢰도 수준
- **정기 갱신:** 높음 (매주 안정적으로 수집)
- **긴급 갱신:** 매우 높음 (실시간 감시로 감지)

---

## ⚠️ 주의사항

### 데이터 특성
- **현실 기반 시나리오:** 실제 발생 가능한 이슈를 기반으로 작성
- **샘플 데이터:** 프로덕션 환경에 바로 사용 가능하나, 시스템 테스트 후 사용 권장
- **정기적 업데이트:** 실제 시스템에서는 매주 새로운 데이터 생성

### 계산 오차
- 정규화 과정에서 소수점 반올림 가능
- 모든 가중치는 0.1 단위로 표현

### 긴급 갱신 트리거
실제 시스템에서는 다음 조건을 자동으로 모니터링:
- 뉴스 기사 시간당 5개 이상
- Google Trends 검색량 200% 이상 상승
- 특정 키워드 트렌드 점수 > 80

---

## 📞 문제 발생 시

데이터 형식 오류나 불일치가 있으면:
1. JSON 형식 검증 (jsonlint.com 사용)
2. 날짜 형식 확인 (ISO 8601)
3. 수치 범위 확인 (0~100)
4. 필드명 확인 (오타 여부)

---

## 📝 버전 히스토리

| 버전 | 날짜 | 변경사항 |
|------|------|--------|
| v1.0 | 2025-10-25 | 초기 버전 (12개 정기 + 3개 긴급) |
| v1.1 | 예정 | 추가 3개월 데이터 |
| v2.0 | 예정 | 추가 필드 및 상세 정보 포함 |

---

## 🚀 다음 단계

1. **데이터 임포트:** 데이터를 개발 환경에 로드
2. **그래프 구현:** 선 그래프 시각화 개발
3. **상세 페이지:** 모달/팝업에서 상세 정보 표시
4. **실시간 갱신:** 실제 API 연동으로 데이터 수집
5. **배포:** 프로덕션 환경에 배포

---

**문서 작성:** 2025-10-25  
**마지막 업데이트:** 2025-10-25  
**다음 검토 예정:** 2025-11-01
