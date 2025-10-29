# Ainus 프로젝트 학습 가이드

> AI 시대 네비게이터 - 프로젝트 코드 이해를 위한 상세 학습 가이드

---

## 목차
1. [프로젝트 개요](#1-프로젝트-개요)
2. [기술 스택 및 아키텍처](#2-기술-스택-및-아키텍처)
3. [의존성 라이브러리 상세 분석](#3-의존성-라이브러리-상세-분석)
4. [프로젝트 구조](#4-프로젝트-구조)
5. [학습 파이프라인](#5-학습-파이프라인)
6. [핵심 개념 및 패턴](#6-핵심-개념-및-패턴)
7. [주요 기능 구현 분석](#7-주요-기능-구현-분석)
8. [실습 가이드](#8-실습-가이드)

---

## 1. 프로젝트 개요

### 1.1 프로젝트 정보
- **프로젝트명**: Ainus (AI 시대 네비게이터)
- **버전**: 1.0.0
- **플랫폼**: React Native (iOS, Android, Web)
- **개발 프레임워크**: Expo ~50.0.0

### 1.2 주요 기능
- AI 이슈 지수 추적 및 시각화
- 직업별/전역 AI 트렌드 모니터링
- AI 인사이트 피드 제공
- AI 도구 추천 시스템
- 커뮤니티 및 사용자 프로필 관리
- 인증 시스템 (로그인/회원가입)

---

## 2. 기술 스택 및 아키텍처

### 2.1 기술 스택 다이어그램
```
┌─────────────────────────────────────────┐
│          Presentation Layer             │
│  (React Native + Expo Components)       │
│  - Screens                              │
│  - Components                           │
│  - Navigation                           │
└────────────┬────────────────────────────┘
             │
┌────────────▼────────────────────────────┐
│          Business Logic Layer           │
│  - Context API (상태 관리)               │
│  - Services (데이터 처리)                │
│  - Utils (유틸리티)                      │
└────────────┬────────────────────────────┘
             │
┌────────────▼────────────────────────────┐
│            Data Layer                   │
│  - JSON 데이터 파일                      │
│  - AsyncStorage (로컬 저장소)            │
└─────────────────────────────────────────┘
```

### 2.2 아키텍처 패턴
- **아키텍처**: 컴포넌트 기반 아키텍처
- **상태 관리**: React Context API
- **네비게이션**: Stack + Tab Navigation
- **스타일링**: StyleSheet (React Native 기본)
- **데이터 흐름**: 단방향 데이터 흐름 (Unidirectional Data Flow)

---

## 3. 의존성 라이브러리 상세 분석

### 3.1 핵심 프레임워크

#### 3.1.1 Expo (~50.0.0)
**역할**: React Native 개발 프레임워크 및 빌드 도구

**사용 이유**:
- 복잡한 네이티브 설정 없이 빠른 개발 가능
- Over-The-Air (OTA) 업데이트 지원
- iOS/Android/Web 크로스 플랫폼 통합 지원
- 풍부한 네이티브 API 제공 (카메라, 위치, 센서 등)

**프로젝트 내 활용**:
```javascript
// App.js:7-10
"scripts": {
  "start": "expo start",      // 개발 서버 시작
  "android": "expo start --android",
  "ios": "expo start --ios",
  "web": "expo start --web"
}
```

#### 3.1.2 React (18.2.0) & React Native (0.73.0)
**역할**: UI 컴포넌트 라이브러리 및 모바일 프레임워크

**사용 이유**:
- 컴포넌트 기반 재사용 가능한 UI 개발
- Virtual DOM을 통한 효율적인 렌더링
- 크로스 플랫폼 네이티브 앱 개발
- 풍부한 생태계와 커뮤니티

**프로젝트 내 활용**:
```javascript
// src/components/common/Button.js 예시
import React from 'react';
import { TouchableOpacity, Text } from 'react-native';

// 재사용 가능한 컴포넌트 작성
```

---

### 3.2 네비게이션 라이브러리

#### 3.2.1 @react-navigation/native (^6.1.9)
**역할**: 네비게이션 핵심 라이브러리

**사용 이유**:
- React Native에서 가장 표준적인 네비게이션 솔루션
- 선언적 라우팅 구조
- Deep Linking 지원
- 상태 관리와 네비게이션 통합

**프로젝트 내 활용**:
```javascript
// App.js:12
<NavigationContainer>
  <MainNavigator />
</NavigationContainer>
```

#### 3.2.2 @react-navigation/stack (^6.3.20)
**역할**: Stack 기반 화면 전환

**사용 이유**:
- 일반적인 push/pop 네비게이션 구현
- 헤더 커스터마이징 지원
- 화면 간 전환 애니메이션 제공

**프로젝트 내 활용**:
```javascript
// src/navigation/MainNavigator.js:22, 142-150
const Stack = createStackNavigator();

// 인증 플로우 스택
<Stack.Navigator>
  <Stack.Screen name="LoginSelect" component={LoginSelectScreen} />
  <Stack.Screen name="Login" component={LoginScreen} />
  <Stack.Screen name="SignUp" component={SignUpScreen} />
</Stack.Navigator>
```

#### 3.2.3 @react-navigation/bottom-tabs (^6.5.11)
**역할**: 하단 탭 네비게이션

**사용 이유**:
- 모바일 앱의 주요 네비게이션 패턴
- 탭 간 상태 유지
- 아이콘 및 라벨 커스터마이징

**프로젝트 내 활용**:
```javascript
// src/navigation/MainNavigator.js:21, 24-139
const Tab = createBottomTabNavigator();

<Tab.Navigator>
  <Tab.Screen name="Home" component={HomeScreen} />
  <Tab.Screen name="Insights" component={InsightFeedScreen} />
  <Tab.Screen name="AIRecommend" component={AIRecommendScreen} />
  <Tab.Screen name="IssueIndex" component={IssueIndexScreen} />
  <Tab.Screen name="Community" component={CommunityScreen} />
  <Tab.Screen name="Profile" component={ProfileScreen} />
</Tab.Navigator>
```

---

### 3.3 UI 관련 라이브러리

#### 3.3.1 react-native-safe-area-context (5.4.0)
**역할**: 안전 영역(Safe Area) 처리

**사용 이유**:
- iPhone 노치, Android 상태바 등 다양한 디바이스 대응
- 콘텐츠가 시스템 UI에 가려지지 않도록 보장
- 플랫폼별 자동 패딩 적용

**프로젝트 내 활용**:
```javascript
// App.js:10
<SafeAreaProvider>
  {/* 앱 전체를 SafeArea로 감싸기 */}
</SafeAreaProvider>

// src/screens/HomeScreen.js:100
<SafeAreaView style={styles.container}>
  {/* 화면 콘텐츠가 안전 영역 내에 위치 */}
</SafeAreaView>
```

#### 3.3.2 expo-linear-gradient (~14.1.5)
**역할**: 그라데이션 효과 생성

**사용 이유**:
- 시각적으로 풍부한 UI 디자인
- CSS 그라데이션을 네이티브에서 구현
- 성능 최적화된 그라데이션 렌더링

**프로젝트 내 활용**:
```javascript
// src/theme/colors.js:48-50
gradient1: ['#6366F1', '#8B5CF6'], // 파랑-보라
gradient2: ['#EC4899', '#F472B6'], // 핑크 그라데이션
gradient3: ['#F59E0B', '#FBBF24'], // 오렌지-노랑

// 버튼, 카드 등 배경에 그라데이션 적용
```

#### 3.3.3 expo-status-bar (~2.2.3)
**역할**: 상태바 스타일 제어

**사용 이유**:
- iOS/Android 상태바 색상 통일
- 다크/라이트 모드 대응
- 화면별 상태바 스타일 변경

**프로젝트 내 활용**:
```javascript
// App.js:13
<StatusBar style="auto" />  // 시스템 테마에 따라 자동 조정
```

#### 3.3.4 react-native-screens (~4.11.1)
**역할**: 네이티브 화면 최적화

**사용 이유**:
- 네이티브 화면 컨테이너 사용으로 성능 향상
- 메모리 사용량 감소
- 화면 전환 애니메이션 개선

**프로젝트 내 활용**:
- React Navigation과 자동 통합되어 백그라운드에서 동작

---

### 3.4 데이터 시각화 라이브러리

#### 3.4.1 react-native-chart-kit (^6.12.0)
**역할**: 차트 및 그래프 렌더링

**사용 이유**:
- React Native 전용 차트 라이브러리
- 다양한 차트 타입 지원 (라인, 바, 파이 등)
- SVG 기반 고품질 렌더링
- 커스터마이징 가능

**프로젝트 내 활용**:
```javascript
// src/screens/HomeScreen.js:4, 127-149
import { LineChart } from 'react-native-chart-kit';

<LineChart
  data={globalIndexHistory}
  width={Dimensions.get('window').width - spacing.md * 2}
  height={220}
  chartConfig={{
    backgroundColor: colors.card,
    color: (opacity = 1) => `rgba(59, 130, 246, ${opacity})`,
    // ... 설정
  }}
  bezier  // 곡선 스타일 라인
/>
```

**왜 이 라이브러리를 선택했는가?**:
- AI 이슈 지수 트렌드 시각화가 핵심 기능
- 실시간 데이터 업데이트 필요
- 모바일 터치 인터랙션 지원

#### 3.4.2 react-native-svg (15.11.2)
**역할**: SVG 벡터 그래픽 렌더링

**사용 이유**:
- 해상도 독립적 그래픽
- 커스텀 차트 및 아이콘 제작
- 애니메이션 지원
- react-native-chart-kit의 의존성

**프로젝트 내 활용**:
```javascript
// src/components/common/IssueIndexChart.js:3, 108-185
import Svg, { Line, Circle, Path, G, Text as SvgText } from 'react-native-svg';

<Svg width={CHART_WIDTH} height={CHART_HEIGHT}>
  <Line x1={...} y1={...} />      // 그리드 라인
  <Path d={createPath()} />       // 차트 경로
  <Circle cx={...} cy={...} />    // 데이터 포인트
  <SvgText>레이블</SvgText>
</Svg>
```

**커스텀 차트 구현**:
- `IssueIndexChart.js`에서 완전 커스텀 차트 구현
- 노드 클릭, 기울기 색상 변경 등 고급 기능

---

### 3.5 애니메이션 라이브러리

#### 3.5.1 react-native-reanimated (~3.17.4)
**역할**: 고성능 애니메이션 라이브러리

**사용 이유**:
- 60fps 부드러운 애니메이션
- UI 스레드에서 실행되어 성능 우수
- 제스처와 연동 가능
- React Navigation의 화면 전환 애니메이션

**프로젝트 내 활용**:
- 화면 전환 애니메이션
- 스크롤 기반 애니메이션
- 버튼 클릭 피드백

**왜 필요한가?**:
- React Native의 기본 Animated API는 JavaScript 스레드에서 실행되어 성능 제한
- Reanimated는 네이티브 스레드에서 실행되어 복잡한 애니메이션도 부드럽게 처리

#### 3.5.2 react-native-gesture-handler (~2.24.0)
**역할**: 네이티브 제스처 처리

**사용 이유**:
- 터치, 스와이프, 핀치 등 제스처 인식
- 네이티브 성능
- Reanimated와 통합
- React Navigation 필수 의존성

**프로젝트 내 활용**:
- 탭 전환 스와이프
- 카드 드래그
- 새로고침 당겨서 갱신

---

### 3.6 데이터 저장 라이브러리

#### 3.6.1 @react-native-async-storage/async-storage (2.1.2)
**역할**: 로컬 데이터 저장소 (Key-Value Storage)

**사용 이유**:
- 브라우저의 localStorage와 유사한 API
- 앱 종료 후에도 데이터 유지
- 인증 토큰, 사용자 설정 저장
- 비동기 처리로 메인 스레드 블로킹 방지

**프로젝트 내 활용**:
```javascript
// src/contexts/AuthContext.js:2, 26-32, 58-59, 98-99, 118-119
import AsyncStorage from '@react-native-async-storage/async-storage';

// 자동 로그인 확인
const savedUser = await AsyncStorage.getItem('user');
const savedToken = await AsyncStorage.getItem('accessToken');

// 로그인 정보 저장
await AsyncStorage.setItem('user', JSON.stringify(mockUser));
await AsyncStorage.setItem('accessToken', mockToken);

// 로그아웃 시 삭제
await AsyncStorage.removeItem('user');
await AsyncStorage.removeItem('accessToken');
```

**왜 이 라이브러리를 사용하는가?**:
- 간단한 인증 상태 유지
- 사용자 설정 저장 (테마, 언어 등)
- 오프라인 데이터 캐싱

---

### 3.7 웹 지원 라이브러리

#### 3.7.1 react-native-web (^0.19.13)
**역할**: React Native 코드를 웹에서 실행

**사용 이유**:
- 단일 코드베이스로 모바일 + 웹 지원
- 개발 생산성 향상
- Expo Web 기능 활성화

**프로젝트 내 활용**:
```bash
npm run web  # 웹 버전 실행
```

#### 3.7.2 react-dom (^18.2.0)
**역할**: React를 웹 DOM에 렌더링

**사용 이유**:
- react-native-web의 의존성
- 웹 플랫폼 지원

---

### 3.8 기타 필수 라이브러리

#### 3.8.1 @expo/metro-runtime (~5.0.5)
**역할**: Metro 번들러 런타임

**사용 이유**:
- Expo 앱의 JavaScript 번들링
- Hot Reloading 지원
- 개발 서버 실행

#### 3.8.2 @babel/core (^7.20.0) [DevDependency]
**역할**: JavaScript 트랜스파일러

**사용 이유**:
- 최신 JavaScript 문법을 구버전 호환 코드로 변환
- React Native의 JSX 트랜스파일
- ES6+ 문법 지원

---

## 4. 프로젝트 구조

### 4.1 디렉토리 구조
```
Ainus_app/
├── App.js                          # 앱 진입점
├── package.json                    # 의존성 관리
├── src/
│   ├── components/                 # 재사용 가능한 컴포넌트
│   │   └── common/
│   │       ├── Button.js           # 버튼 컴포넌트
│   │       ├── Card.js             # 카드 컴포넌트
│   │       ├── IssueIndexCard.js   # 이슈 지수 카드
│   │       ├── IssueIndexChart.js  # 커스텀 차트
│   │       ├── IssueIndexDetailModal.js  # 상세 모달
│   │       └── InsightCard.js      # 인사이트 카드
│   ├── contexts/                   # Context API 상태 관리
│   │   └── AuthContext.js          # 인증 상태 관리
│   ├── data/                       # 정적 데이터
│   │   ├── issue_index_regular_updates.json     # 정기 갱신 데이터
│   │   └── issue_index_emergency_updates.json   # 긴급 갱신 데이터
│   ├── navigation/                 # 네비게이션 설정
│   │   └── MainNavigator.js        # 메인 네비게이터
│   ├── screens/                    # 화면 컴포넌트
│   │   ├── HomeScreen.js           # 홈 화면
│   │   ├── InsightFeedScreen.js    # 인사이트 피드
│   │   ├── AIRecommendScreen.js    # AI 추천
│   │   ├── IssueIndexScreen.js     # 이슈 지수
│   │   ├── CommunityScreen.js      # 커뮤니티
│   │   ├── ProfileScreen.js        # 프로필
│   │   └── auth/                   # 인증 화면
│   │       ├── LoginSelectScreen.js    # 로그인 선택
│   │       ├── LoginScreen.js      # 로그인
│   │       └── SignUpScreen.js     # 회원가입
│   ├── services/                   # 비즈니스 로직
│   │   └── issueIndexService.js    # 이슈 지수 서비스
│   ├── theme/                      # 디자인 시스템
│   │   ├── colors.js               # 색상 팔레트
│   │   ├── typography.js           # 타이포그래피
│   │   └── spacing.js              # 간격 시스템
│   └── utils/                      # 유틸리티 함수
│       └── validation.js           # 유효성 검사
└── ...
```

### 4.2 파일 역할 설명

#### App.js
- 앱의 진입점
- Provider 구조 설정 (SafeAreaProvider, AuthProvider, NavigationContainer)
- 전역 설정 초기화

#### components/common/
- 재사용 가능한 UI 컴포넌트
- **설계 원칙**: Atomic Design 패턴 부분 적용
- **Button.js**: 프라이머리/세컨더리/아웃라인 버튼
- **Card.js**: 기본 카드 컴포넌트
- **IssueIndexChart.js**: SVG 기반 커스텀 차트 (핵심 기능)

#### contexts/AuthContext.js
- 전역 인증 상태 관리
- 로그인/로그아웃/회원가입 로직
- AsyncStorage를 통한 자동 로그인

#### data/
- JSON 형식의 정적 데이터
- 추후 API로 대체 예정

#### services/issueIndexService.js
- 이슈 지수 데이터 비즈니스 로직
- 데이터 필터링, 정렬, 통계 계산
- 싱글톤 패턴 적용

#### theme/
- 일관된 디자인 시스템
- 색상, 타이포그래피, 간격 관리
- **왜 필요한가?**: 디자인 일관성 유지, 유지보수 용이

---

## 5. 학습 파이프라인

### 5.1 학습 로드맵 (초급 → 고급)

```
┌─────────────────────────────────────────────────────┐
│ Phase 1: 기초 환경 설정 및 이해 (1-2일)              │
├─────────────────────────────────────────────────────┤
│ □ Node.js, npm 설치                                 │
│ □ Expo CLI 설치                                     │
│ □ 프로젝트 클론 및 의존성 설치                       │
│ □ 앱 실행 (expo start)                              │
│ □ 프로젝트 구조 파악                                 │
└─────────────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────────────┐
│ Phase 2: React Native 기본 개념 (3-5일)             │
├─────────────────────────────────────────────────────┤
│ □ JSX 문법                                          │
│ □ 컴포넌트 (Functional Component)                   │
│ □ Props & State                                     │
│ □ StyleSheet 사용법                                 │
│ □ View, Text, ScrollView, TouchableOpacity 등       │
└─────────────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────────────┐
│ Phase 3: 네비게이션 이해 (2-3일)                     │
├─────────────────────────────────────────────────────┤
│ □ React Navigation 개념                             │
│ □ Stack Navigator 분석                              │
│ □ Tab Navigator 분석                                │
│ □ MainNavigator.js 상세 분석                        │
│ □ 화면 간 데이터 전달 (navigation.navigate)         │
└─────────────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────────────┐
│ Phase 4: 상태 관리 (3-4일)                           │
├─────────────────────────────────────────────────────┤
│ □ useState, useEffect 훅                            │
│ □ Context API 개념                                  │
│ □ AuthContext.js 분석                               │
│ □ useAuth 커스텀 훅 사용법                           │
│ □ AsyncStorage 사용법                               │
└─────────────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────────────┐
│ Phase 5: UI 컴포넌트 및 디자인 시스템 (3-4일)        │
├─────────────────────────────────────────────────────┤
│ □ theme/ 폴더 분석 (colors, typography, spacing)    │
│ □ 재사용 컴포넌트 작성법 (Button.js, Card.js)       │
│ □ SafeAreaView 사용법                               │
│ □ Platform-specific 스타일링                        │
└─────────────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────────────┐
│ Phase 6: 데이터 시각화 (4-5일)                       │
├─────────────────────────────────────────────────────┤
│ □ react-native-chart-kit 사용법                     │
│ □ react-native-svg 기본                             │
│ □ IssueIndexChart.js 커스텀 차트 분석               │
│ □ 좌표 변환 로직 이해                                │
│ □ 인터랙티브 차트 구현                               │
└─────────────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────────────┐
│ Phase 7: 서비스 레이어 및 비즈니스 로직 (3-4일)       │
├─────────────────────────────────────────────────────┤
│ □ issueIndexService.js 분석                         │
│ □ 데이터 필터링 및 정렬 로직                         │
│ □ 통계 계산 알고리즘                                 │
│ □ 싱글톤 패턴 이해                                   │
└─────────────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────────────┐
│ Phase 8: 고급 기능 및 최적화 (4-5일)                 │
├─────────────────────────────────────────────────────┤
│ □ 성능 최적화 (useMemo, useCallback)                │
│ □ 애니메이션 (react-native-reanimated)              │
│ □ 제스처 처리                                        │
│ □ 에러 핸들링                                        │
└─────────────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────────────┐
│ Phase 9: 실전 프로젝트 (자유)                        │
├─────────────────────────────────────────────────────┤
│ □ 새로운 화면 추가                                   │
│ □ 새로운 기능 구현                                   │
│ □ API 연동 (추후)                                    │
│ □ 배포 준비                                          │
└─────────────────────────────────────────────────────┘
```

### 5.2 단계별 학습 가이드

#### Phase 1: 환경 설정
```bash
# 1. Node.js 설치 확인
node --version  # v16 이상 권장

# 2. 프로젝트 클론
git clone <repository-url>
cd Ainus_app

# 3. 의존성 설치
npm install

# 4. Expo 앱 실행
npm start
# 또는
expo start

# 5. QR 코드 스캔하여 실제 기기에서 테스트
```

**학습 목표**:
- Expo 개발 환경 이해
- Hot Reload 경험
- 프로젝트 구조 파악

---

#### Phase 2: React Native 기본

**학습할 파일**:
- `src/components/common/Button.js`
- `src/components/common/Card.js`

**핵심 개념**:
```javascript
// 1. Functional Component
const Button = ({ title, onPress, variant = 'primary' }) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <Text>{title}</Text>
    </TouchableOpacity>
  );
};

// 2. StyleSheet
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
});

// 3. Props 전달
<Button title="클릭" onPress={() => console.log('클릭됨')} />
```

**실습 과제**:
1. 간단한 카드 컴포넌트 만들기
2. 버튼 클릭 시 텍스트 변경하기
3. StyleSheet로 커스텀 스타일 적용하기

---

#### Phase 3: 네비게이션

**학습할 파일**:
- `src/navigation/MainNavigator.js`
- `App.js`

**핵심 개념**:
```javascript
// 1. Tab Navigator
const Tab = createBottomTabNavigator();

<Tab.Navigator>
  <Tab.Screen name="Home" component={HomeScreen} />
  <Tab.Screen name="Profile" component={ProfileScreen} />
</Tab.Navigator>

// 2. Stack Navigator
const Stack = createStackNavigator();

<Stack.Navigator>
  <Stack.Screen name="Login" component={LoginScreen} />
  <Stack.Screen name="SignUp" component={SignUpScreen} />
</Stack.Navigator>

// 3. 화면 이동
navigation.navigate('Home');

// 4. 파라미터 전달
navigation.navigate('Detail', { id: 123 });

// 5. 파라미터 받기
const { id } = route.params;
```

**실습 과제**:
1. 새로운 화면 추가하기
2. 화면 간 데이터 전달하기
3. 뒤로가기 구현하기

---

#### Phase 4: 상태 관리

**학습할 파일**:
- `src/contexts/AuthContext.js`

**핵심 개념**:
```javascript
// 1. Context 생성
const AuthContext = createContext();

// 2. Provider 제공
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const login = async (email, password) => {
    // 로그인 로직
    setUser(mockUser);
  };

  const value = { user, login };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// 3. Custom Hook으로 사용
export const useAuth = () => {
  const context = useContext(AuthContext);
  return context;
};

// 4. 컴포넌트에서 사용
const { user, login } = useAuth();
```

**AsyncStorage 사용**:
```javascript
// 저장
await AsyncStorage.setItem('key', 'value');
await AsyncStorage.setItem('user', JSON.stringify(userObj));

// 읽기
const value = await AsyncStorage.getItem('key');
const user = JSON.parse(await AsyncStorage.getItem('user'));

// 삭제
await AsyncStorage.removeItem('key');
```

**실습 과제**:
1. 로그인/로그아웃 기능 테스트
2. 자동 로그인 확인
3. 새로운 Context 만들기 (테마 설정 등)

---

#### Phase 5: 디자인 시스템

**학습할 파일**:
- `src/theme/colors.js`
- `src/theme/typography.js`
- `src/theme/spacing.js`

**핵심 개념**:
```javascript
// 1. 색상 시스템
export const colors = {
  primary: '#6366F1',
  secondary: '#EC4899',
  text: '#1F2937',
  // ...
};

// 2. 타이포그래피
export const textStyles = {
  h1: { fontSize: 32, fontWeight: '700' },
  h2: { fontSize: 24, fontWeight: '600' },
  body1: { fontSize: 16, fontWeight: '400' },
  // ...
};

// 3. 간격 시스템
export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
};

// 4. 사용
import { colors, textStyles, spacing } from '../theme';

const styles = StyleSheet.create({
  title: {
    ...textStyles.h1,
    color: colors.primary,
    marginBottom: spacing.md,
  },
});
```

**왜 이렇게 하는가?**:
- 일관된 디자인
- 유지보수 용이
- 테마 변경 간편

**실습 과제**:
1. 새로운 색상 추가하기
2. 커스텀 텍스트 스타일 만들기
3. 다크 모드 준비하기

---

#### Phase 6: 데이터 시각화

**학습할 파일**:
- `src/components/common/IssueIndexChart.js`
- `src/screens/HomeScreen.js` (LineChart 사용 부분)

**react-native-chart-kit 사용법**:
```javascript
import { LineChart } from 'react-native-chart-kit';

<LineChart
  data={{
    labels: ['1월', '2월', '3월', '4월', '5월', '6월'],
    datasets: [{
      data: [20, 45, 28, 80, 99, 43]
    }]
  }}
  width={Dimensions.get('window').width - 32}
  height={220}
  chartConfig={{
    backgroundColor: '#ffffff',
    backgroundGradientFrom: '#ffffff',
    backgroundGradientTo: '#ffffff',
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(99, 102, 241, ${opacity})`,
  }}
  bezier  // 곡선 그래프
/>
```

**커스텀 SVG 차트**:
```javascript
import Svg, { Line, Circle, Path } from 'react-native-svg';

// 좌표 변환
const getX = (index) => {
  return PADDING.left + (chartWidth / (data.length - 1)) * index;
};

const getY = (score) => {
  const normalizedScore = (score - minScore) / scoreRange;
  return PADDING.top + chartHeight * (1 - normalizedScore);
};

<Svg width={CHART_WIDTH} height={CHART_HEIGHT}>
  {/* 그리드 라인 */}
  <Line x1={...} y1={...} x2={...} y2={...} stroke="#E0E0E0" />

  {/* 데이터 라인 */}
  <Path d={createPath()} stroke="#6366F1" strokeWidth="2" />

  {/* 데이터 포인트 */}
  <Circle cx={getX(i)} cy={getY(score)} r={5} fill="#6366F1" />
</Svg>
```

**실습 과제**:
1. LineChart 데이터 변경해보기
2. 차트 색상 커스터마이징
3. 간단한 SVG 도형 그리기

---

#### Phase 7: 서비스 레이어

**학습할 파일**:
- `src/services/issueIndexService.js`
- `src/data/issue_index_*.json`

**핵심 개념**:
```javascript
// 1. 싱글톤 패턴
class IssueIndexService {
  getAllUpdates() {
    // 데이터 병합 및 정렬
  }

  getLatestUpdate() {
    // 최신 데이터 반환
  }

  getStatistics(period) {
    // 통계 계산
  }
}

// 싱글톤 인스턴스 생성
const issueIndexService = new IssueIndexService();
export default issueIndexService;

// 2. 사용
import issueIndexService from '../services/issueIndexService';

const latestData = issueIndexService.getLatestUpdate();
const stats = issueIndexService.getStatistics('3months');
```

**데이터 처리 로직**:
```javascript
// 필터링
const filtered = allUpdates.filter(update =>
  new Date(update.index_date) >= startDate
);

// 정렬
const sorted = allUpdates.sort((a, b) =>
  new Date(a.index_date) - new Date(b.index_date)
);

// 통계 계산
const avgScore = scores.reduce((a, b) => a + b, 0) / scores.length;
```

**실습 과제**:
1. 새로운 필터 메서드 추가
2. 데이터 변환 함수 작성
3. 통계 계산 로직 개선

---

#### Phase 8: 고급 기능

**성능 최적화**:
```javascript
// 1. useMemo - 계산 비용이 큰 값 캐싱
const expensiveValue = useMemo(() => {
  return calculateComplexData(data);
}, [data]);

// 2. useCallback - 함수 재생성 방지
const handlePress = useCallback(() => {
  console.log('Pressed');
}, []);

// 3. React.memo - 컴포넌트 재렌더링 방지
export default React.memo(ExpensiveComponent);
```

**애니메이션**:
```javascript
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming
} from 'react-native-reanimated';

const MyComponent = () => {
  const opacity = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: withTiming(opacity.value, { duration: 1000 }),
    };
  });

  return <Animated.View style={animatedStyle} />;
};
```

---

## 6. 핵심 개념 및 패턴

### 6.1 컴포넌트 설계 패턴

#### Presentational vs Container 컴포넌트
```javascript
// Presentational (UI 컴포넌트)
const Button = ({ title, onPress, variant }) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <Text>{title}</Text>
    </TouchableOpacity>
  );
};

// Container (로직 컴포넌트)
const HomeScreen = ({ navigation }) => {
  const [data, setData] = useState([]);

  useEffect(() => {
    loadData();
  }, []);

  return <Button title="클릭" onPress={handlePress} />;
};
```

### 6.2 상태 관리 패턴

#### Context API 패턴
```
App.js (최상위)
  └─ AuthProvider
       ├─ NavigationContainer
       │    └─ MainNavigator
       │         ├─ HomeScreen (useAuth 사용)
       │         └─ ProfileScreen (useAuth 사용)
       └─ 모든 하위 컴포넌트가 인증 상태 접근 가능
```

### 6.3 네비게이션 패턴

#### 인증 기반 네비게이션
```javascript
// MainNavigator.js:152-174
const MainNavigator = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <Stack.Navigator>
      {isAuthenticated ? (
        <Stack.Screen name="MainTabs" component={TabNavigator} />
      ) : (
        <Stack.Screen name="Auth" component={AuthNavigator} />
      )}
    </Stack.Navigator>
  );
};
```

**패턴 설명**:
1. 앱 시작 시 AsyncStorage에서 토큰 확인 (isLoading)
2. 인증 상태에 따라 다른 네비게이터 렌더링
3. 로그인하면 자동으로 MainTabs로 전환

### 6.4 서비스 레이어 패턴

#### 싱글톤 서비스
```javascript
class IssueIndexService {
  // 비즈니스 로직
}

const issueIndexService = new IssueIndexService();
export default issueIndexService;
```

**왜 싱글톤인가?**:
- 데이터 일관성 유지
- 메모리 절약
- 전역 상태 관리

---

## 7. 주요 기능 구현 분석

### 7.1 인증 플로우

**파일**: `src/contexts/AuthContext.js`

**플로우 다이어그램**:
```
앱 시작
  ↓
[useEffect] checkAutoLogin()
  ↓
AsyncStorage.getItem('user', 'accessToken')
  ↓
┌──────────────┬──────────────┐
│ 데이터 있음   │ 데이터 없음   │
├──────────────┼──────────────┤
│ setUser()    │ setUser(null)│
│ 자동 로그인  │ 로그인 화면  │
└──────────────┴──────────────┘
```

**코드 분석**:
```javascript
// AuthContext.js:20-38
useEffect(() => {
  checkAutoLogin();
}, []);

const checkAutoLogin = async () => {
  try {
    const savedUser = await AsyncStorage.getItem('user');
    const savedToken = await AsyncStorage.getItem('accessToken');

    if (savedUser && savedToken) {
      setUser(JSON.parse(savedUser));
      setAccessToken(savedToken);
    }
  } catch (error) {
    console.error('Auto login check failed:', error);
  } finally {
    setIsLoading(false);  // 로딩 완료
  }
};
```

**핵심 포인트**:
- `isLoading` 상태로 로딩 화면 표시
- 에러 처리 (`try-catch`)
- `finally`에서 반드시 로딩 종료

---

### 7.2 이슈 지수 시각화

**파일**: `src/components/common/IssueIndexChart.js`

**기능**:
1. SVG 기반 커스텀 차트
2. 노드 클릭 인터랙션
3. 기울기에 따른 색상 변경
4. 긴급 갱신/급변 구간 강조

**좌표 변환 로직**:
```javascript
// IssueIndexChart.js:34-42
const getX = (index) => {
  return PADDING.left + (chartWidth / (data.length - 1)) * index;
};

const getY = (score) => {
  // Y축은 위에서 아래로 증가하므로 반전
  const normalizedScore = (score - minScore) / scoreRange;
  return PADDING.top + chartHeight * (1 - normalizedScore);
};
```

**설명**:
- `getX`: 데이터 인덱스를 X 좌표로 변환
- `getY`: 점수를 Y 좌표로 변환 (정규화 필요)
- `1 - normalizedScore`: SVG는 Y축이 아래로 증가하므로 반전

**기울기 색상 변경**:
```javascript
// IssueIndexChart.js:54-67
const getSegmentColor = (index) => {
  const currentScore = data[index].score;
  const previousScore = data[index - 1].score;
  const slope = (currentScore - previousScore) / previousScore;

  if (slope > 0.15) return colors.riskVeryHigh; // 급상승
  if (slope > 0.05) return colors.riskHigh;
  if (slope > 0) return '#FFB84D';
  if (slope > -0.05) return '#95A5A6';
  return '#2C3E50'; // 급하락
};
```

---

### 7.3 데이터 처리 서비스

**파일**: `src/services/issueIndexService.js`

**주요 메서드**:

1. **getAllUpdates()**: 정기 + 긴급 갱신 병합 및 정렬
```javascript
getAllUpdates() {
  const allUpdates = [
    ...regularUpdates.regular_updates,
    ...emergencyUpdates.emergency_updates,
  ];

  return allUpdates.sort((a, b) =>
    new Date(a.index_date) - new Date(b.index_date)
  );
}
```

2. **getUpdatesByPeriod()**: 기간별 필터링
```javascript
getUpdatesByPeriod(period = '3months') {
  const allUpdates = this.getAllUpdates();
  const now = new Date();
  let startDate;

  switch (period) {
    case '3months':
      startDate = new Date(now.setMonth(now.getMonth() - 3));
      break;
    // ...
  }

  return allUpdates.filter(update =>
    new Date(update.index_date) >= startDate
  );
}
```

3. **getStatistics()**: 통계 계산
```javascript
getStatistics(period = '3months') {
  const updates = this.getUpdatesByPeriod(period);
  const scores = updates.map(u => u.current_score);

  const maxScore = Math.max(...scores);
  const minScore = Math.min(...scores);
  const avgScore = scores.reduce((a, b) => a + b, 0) / scores.length;

  return {
    maxScore, minScore, avgScore,
    trend: this.calculateTrend(updates),
    // ...
  };
}
```

---

### 7.4 화면 구성

**파일**: `src/screens/HomeScreen.js`

**구성 요소**:
1. 사용자 인사말
2. 통합 AI 이슈 지수 카드 + 차트
3. 직업별 이슈 지수 카드 + 차트
4. AI 발전 비교
5. 최신 인사이트 리스트
6. 빠른 AI 추천

**차트 사용 예시**:
```javascript
// HomeScreen.js:127-149
<LineChart
  data={globalIndexHistory}
  width={Dimensions.get('window').width - spacing.md * 2}
  height={220}
  chartConfig={{
    backgroundColor: colors.card,
    backgroundGradientFrom: colors.card,
    backgroundGradientTo: colors.card,
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(59, 130, 246, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(107, 114, 128, ${opacity})`,
    propsForDots: {
      r: '6',
      strokeWidth: '2',
      stroke: colors.primary,
    },
  }}
  bezier
/>
```

---

## 8. 실습 가이드

### 8.1 실습 1: 새로운 화면 추가하기

**목표**: "설정(Settings)" 화면 추가

**단계**:
1. 새 파일 생성: `src/screens/SettingsScreen.js`
```javascript
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../theme/colors';

const SettingsScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>설정</Text>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: colors.text,
  },
});

export default SettingsScreen;
```

2. MainNavigator에 추가
```javascript
// src/navigation/MainNavigator.js
import SettingsScreen from '../screens/SettingsScreen';

// TabNavigator 안에 추가
<Tab.Screen
  name="Settings"
  component={SettingsScreen}
  options={{
    tabBarLabel: '설정',
    headerTitle: '⚙️ 설정',
  }}
/>
```

3. 앱 실행 및 확인

---

### 8.2 실습 2: 테마 Context 만들기

**목표**: 다크 모드 전환 기능 구현

**단계**:
1. `src/contexts/ThemeContext.js` 생성
```javascript
import React, { createContext, useState, useContext } from 'react';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleTheme = () => {
    setIsDarkMode(prev => !prev);
  };

  const theme = {
    isDarkMode,
    colors: isDarkMode ? darkColors : lightColors,
  };

  const value = {
    ...theme,
    toggleTheme,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

const lightColors = {
  background: '#FFFFFF',
  text: '#1F2937',
};

const darkColors = {
  background: '#1F2937',
  text: '#FFFFFF',
};
```

2. App.js에서 Provider 추가
```javascript
import { ThemeProvider } from './src/contexts/ThemeContext';

<ThemeProvider>
  <SafeAreaProvider>
    <AuthProvider>
      {/* ... */}
    </AuthProvider>
  </SafeAreaProvider>
</ThemeProvider>
```

3. 컴포넌트에서 사용
```javascript
const { isDarkMode, toggleTheme, colors } = useTheme();

<View style={{ backgroundColor: colors.background }}>
  <Text style={{ color: colors.text }}>텍스트</Text>
  <Button title="테마 전환" onPress={toggleTheme} />
</View>
```

---

### 8.3 실습 3: 커스텀 차트 만들기

**목표**: 간단한 막대 그래프 SVG로 구현

**단계**:
```javascript
import React from 'react';
import { View } from 'react-native';
import Svg, { Rect, Text as SvgText } from 'react-native-svg';

const BarChart = ({ data }) => {
  const WIDTH = 300;
  const HEIGHT = 200;
  const PADDING = 20;
  const BAR_WIDTH = (WIDTH - PADDING * 2) / data.length;

  const maxValue = Math.max(...data.map(d => d.value));

  return (
    <Svg width={WIDTH} height={HEIGHT}>
      {data.map((item, index) => {
        const barHeight = (item.value / maxValue) * (HEIGHT - PADDING * 2);
        const x = PADDING + index * BAR_WIDTH;
        const y = HEIGHT - PADDING - barHeight;

        return (
          <React.Fragment key={index}>
            <Rect
              x={x}
              y={y}
              width={BAR_WIDTH - 10}
              height={barHeight}
              fill="#6366F1"
            />
            <SvgText
              x={x + BAR_WIDTH / 2}
              y={HEIGHT - 5}
              fontSize="10"
              textAnchor="middle"
            >
              {item.label}
            </SvgText>
          </React.Fragment>
        );
      })}
    </Svg>
  );
};

// 사용
<BarChart data={[
  { label: 'A', value: 30 },
  { label: 'B', value: 50 },
  { label: 'C', value: 20 },
]} />
```

---

### 8.4 실습 4: API 연동 준비

**목표**: 실제 API 호출 구조 만들기

**단계**:
1. `src/services/apiService.js` 생성
```javascript
const API_BASE_URL = 'https://api.example.com';

class ApiService {
  async fetchIssueIndex() {
    try {
      const response = await fetch(`${API_BASE_URL}/issue-index`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  async login(email, password) {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Login Error:', error);
      throw error;
    }
  }
}

const apiService = new ApiService();
export default apiService;
```

2. AuthContext에서 사용
```javascript
import apiService from '../services/apiService';

const login = async (email, password) => {
  try {
    const response = await apiService.login(email, password);

    if (response.success) {
      setUser(response.user);
      setAccessToken(response.token);

      await AsyncStorage.setItem('user', JSON.stringify(response.user));
      await AsyncStorage.setItem('accessToken', response.token);

      return { success: true, user: response.user };
    } else {
      return { success: false, error: response.error };
    }
  } catch (error) {
    return {
      success: false,
      error: { code: 'NETWORK_ERROR', message: '네트워크 오류' },
    };
  }
};
```

---

## 9. 추가 학습 자료

### 9.1 공식 문서
- **React Native**: https://reactnative.dev/
- **Expo**: https://docs.expo.dev/
- **React Navigation**: https://reactnavigation.org/
- **react-native-chart-kit**: https://github.com/indiespirit/react-native-chart-kit
- **react-native-svg**: https://github.com/software-mansion/react-native-svg
- **AsyncStorage**: https://react-native-async-storage.github.io/async-storage/

### 9.2 권장 학습 순서
1. JavaScript ES6+ 문법
2. React 기초 (컴포넌트, Hooks)
3. React Native 기본
4. React Navigation
5. 상태 관리 (Context API, Redux)
6. 성능 최적화
7. 네이티브 모듈 사용

### 9.3 유용한 도구
- **React DevTools**: 컴포넌트 디버깅
- **Expo Go App**: 실제 기기 테스트
- **Flipper**: 네트워크, 로그 디버깅
- **VS Code Extensions**:
  - React Native Tools
  - ES7+ React/Redux/React-Native snippets

---

## 10. FAQ

### Q1: Expo와 순수 React Native의 차이는?
**A**: Expo는 React Native 위에 구축된 프레임워크로, 복잡한 네이티브 설정 없이 빠르게 개발할 수 있습니다. 단, 일부 네이티브 모듈 제약이 있습니다.

### Q2: Context API vs Redux?
**A**: 이 프로젝트는 Context API를 사용합니다. 소규모 앱이고 상태가 복잡하지 않아 Context API가 충분합니다. Redux는 대규모 앱에서 유리합니다.

### Q3: StyleSheet vs Styled Components?
**A**: 이 프로젝트는 React Native 기본 StyleSheet를 사용합니다. 성능이 좋고 간단합니다. Styled Components는 CSS-in-JS 방식을 선호할 때 사용합니다.

### Q4: AsyncStorage 용량 제한은?
**A**: 플랫폼마다 다르지만 일반적으로 6MB 정도입니다. 대용량 데이터는 SQLite나 Realm을 사용하세요.

### Q5: 실제 배포는 어떻게?
**A**: Expo를 사용하면 `expo build:android`, `expo build:ios` 명령으로 빌드할 수 있습니다. 또는 EAS Build를 사용합니다.

---

## 11. 프로젝트 개선 아이디어

### 단기 개선
- [ ] 다크 모드 구현
- [ ] 에러 바운더리 추가
- [ ] 로딩 스피너 통일
- [ ] 오프라인 모드 지원

### 중기 개선
- [ ] 실제 API 연동
- [ ] 푸시 알림
- [ ] 사용자 프로필 이미지 업로드
- [ ] 소셜 로그인 (Google, Apple)

### 장기 개선
- [ ] AI 챗봇 통합
- [ ] 실시간 업데이트 (WebSocket)
- [ ] 다국어 지원 (i18n)
- [ ] 앱 분석 (Firebase Analytics)

---

## 12. 정리

### 핵심 요약
1. **Expo + React Native**: 크로스 플랫폼 모바일 앱 개발
2. **React Navigation**: Stack + Tab 네비게이션
3. **Context API**: 간단한 전역 상태 관리
4. **AsyncStorage**: 로컬 데이터 저장
5. **SVG + Chart Kit**: 데이터 시각화
6. **디자인 시스템**: 일관된 UI/UX

### 학습 마인드셋
- 처음부터 모든 것을 이해하려 하지 마세요
- 작은 기능부터 하나씩 구현해보세요
- 공식 문서를 자주 참고하세요
- 에러를 두려워하지 마세요 (에러가 최고의 선생님)

### 다음 단계
1. 이 가이드를 따라 프로젝트 전체를 한 번 읽어보세요
2. 각 Phase별로 실습을 진행하세요
3. 작은 기능을 직접 추가해보세요
4. 커뮤니티에 질문하고 공유하세요

---

**작성일**: 2025-10-29
**버전**: 1.0.0
**문의**: 프로젝트 이슈 트래커 또는 개발자에게 문의

행운을 빕니다! 🚀
