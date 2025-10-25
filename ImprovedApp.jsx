import React, { useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  ScrollView,
  StatusBar,
  FlatList,
} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { LineChart, BarChart, ProgressChart } from 'react-native-chart-kit';

// ==================== 디자인 시스템 ====================
const COLORS = {
  primary: '#4285F4',
  secondary: '#34A853',
  accent: '#FBBC04',
  danger: '#EA4335',
  
  background: '#F8F9FA',
  surface: '#FFFFFF',
  surfaceVariant: '#F1F3F4',
  
  onPrimary: '#FFFFFF',
  onSurface: '#202124',
  onSurfaceVariant: '#5F6368',
  
  border: '#DADCE0',
  divider: '#E8EAED',
  
  success: '#34A853',
  warning: '#FBBC04',
  error: '#EA4335',
  info: '#4285F4',
};

const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
};

const TYPOGRAPHY = {
  h1: { fontSize: 28, fontWeight: '700', lineHeight: 36 },
  h2: { fontSize: 24, fontWeight: '700', lineHeight: 32 },
  h3: { fontSize: 20, fontWeight: '600', lineHeight: 28 },
  h4: { fontSize: 18, fontWeight: '600', lineHeight: 24 },
  body1: { fontSize: 16, fontWeight: '400', lineHeight: 24 },
  body2: { fontSize: 14, fontWeight: '400', lineHeight: 20 },
  caption: { fontSize: 12, fontWeight: '400', lineHeight: 16 },
  button: { fontSize: 14, fontWeight: '600', lineHeight: 20 },
};

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_WIDTH = (SCREEN_WIDTH - SPACING.lg * 3) / 2;

// ==================== 공통 컴포넌트 ====================

// 카드 컨테이너
const Card = ({ children, style, onPress }) => {
  const Component = onPress ? TouchableOpacity : View;
  return (
    <Component
      style={[styles.card, style]}
      onPress={onPress}
      activeOpacity={onPress ? 0.7 : 1}
    >
      {children}
    </Component>
  );
};

// 섹션 헤더
const SectionHeader = ({ title, action, onActionPress }) => (
  <View style={styles.sectionHeader}>
    <Text style={styles.sectionTitle}>{title}</Text>
    {action && (
      <TouchableOpacity onPress={onActionPress}>
        <Text style={styles.sectionAction}>{action}</Text>
      </TouchableOpacity>
    )}
  </View>
);

// 검색바
const SearchBar = ({ placeholder, value, onChangeText }) => (
  <View style={styles.searchBar}>
    <Ionicons name="search" size={20} color={COLORS.onSurfaceVariant} />
    <TextInput
      style={styles.searchInput}
      placeholder={placeholder}
      placeholderTextColor={COLORS.onSurfaceVariant}
      value={value}
      onChangeText={onChangeText}
    />
  </View>
);

// 칩 (필터 버튼)
const Chip = ({ label, selected, onPress }) => (
  <TouchableOpacity
    style={[styles.chip, selected && styles.chipSelected]}
    onPress={onPress}
  >
    <Text style={[styles.chipText, selected && styles.chipTextSelected]}>
      {label}
    </Text>
  </TouchableOpacity>
);

// 스탯 카드 (숫자 표시용)
const StatCard = ({ icon, label, value, change, trend }) => (
  <Card style={styles.statCard}>
    <View style={styles.statIcon}>
      <Ionicons name={icon} size={24} color={COLORS.primary} />
    </View>
    <Text style={styles.statLabel}>{label}</Text>
    <Text style={styles.statValue}>{value}</Text>
    {change && (
      <View style={styles.statChange}>
        <Ionicons
          name={trend === 'up' ? 'trending-up' : 'trending-down'}
          size={16}
          color={trend === 'up' ? COLORS.success : COLORS.error}
        />
        <Text
          style={[
            styles.statChangeText,
            { color: trend === 'up' ? COLORS.success : COLORS.error },
          ]}
        >
          {change}
        </Text>
      </View>
    )}
  </Card>
);

// 모델 카드
const ModelCard = ({ model, onPress }) => (
  <Card style={styles.modelCard} onPress={onPress}>
    <View style={styles.modelHeader}>
      <Text style={styles.modelName}>{model.name}</Text>
      <Text style={styles.modelDeveloper}>{model.developer}</Text>
    </View>
    <View style={styles.modelScoreContainer}>
      <Text style={styles.modelScore}>{model.score}</Text>
      <Text style={styles.modelScoreLabel}>Overall Score</Text>
    </View>
    <View style={styles.modelTags}>
      {model.tags.map((tag, index) => (
        <View key={index} style={styles.modelTag}>
          <Text style={styles.modelTagText}>{tag}</Text>
        </View>
      ))}
    </View>
  </Card>
);

// 타임라인 아이템
const TimelineItem = ({ item, isLast }) => (
  <View style={styles.timelineItem}>
    <View style={styles.timelineIndicator}>
      <View style={styles.timelineDot} />
      {!isLast && <View style={styles.timelineLine} />}
    </View>
    <Card style={styles.timelineContent}>
      <Text style={styles.timelineTitle}>{item.title}</Text>
      <Text style={styles.timelineDate}>{item.date}</Text>
      <Text style={styles.timelineDescription}>{item.description}</Text>
      {item.improvements && (
        <View style={styles.timelineImprovements}>
          <Text style={styles.timelineImprovementsTitle}>Key Improvements:</Text>
          {item.improvements.map((improvement, index) => (
            <Text key={index} style={styles.timelineImprovement}>
              • {improvement}
            </Text>
          ))}
        </View>
      )}
    </Card>
  </View>
);

// 커뮤니티 포스트 카드
const CommunityPostCard = ({ post, onPress, onLike }) => (
  <Card style={styles.postCard} onPress={onPress}>
    <View style={styles.postHeader}>
      <Text style={styles.postAuthor}>{post.author}</Text>
      <Text style={styles.postDate}>{post.date}</Text>
    </View>
    <Text style={styles.postTitle}>{post.title}</Text>
    <Text style={styles.postContent} numberOfLines={3}>
      {post.content}
    </Text>
    <View style={styles.postFooter}>
      <TouchableOpacity style={styles.postAction} onPress={onLike}>
        <Ionicons
          name={post.isLiked ? 'heart' : 'heart-outline'}
          size={20}
          color={post.isLiked ? COLORS.danger : COLORS.onSurfaceVariant}
        />
        <Text style={styles.postActionText}>{post.likes}</Text>
      </TouchableOpacity>
      <View style={styles.postAction}>
        <Ionicons name="chatbubble-outline" size={20} color={COLORS.onSurfaceVariant} />
        <Text style={styles.postActionText}>{post.comments}</Text>
      </View>
    </View>
  </Card>
);

// ==================== 화면 컴포넌트 ====================

// 1. 로그인 화면
const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    navigation.replace('Main');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.loginContainer}>
        <Ionicons name="analytics-outline" size={60} color={COLORS.primary} />
        <Text style={styles.loginTitle}>AI Trends</Text>
        <Text style={styles.loginSubtitle}>
          AI 모델 성능과 이슈를 한눈에
        </Text>

        <View style={styles.loginForm}>
          <TextInput
            style={styles.input}
            placeholder="이메일"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <TextInput
            style={styles.input}
            placeholder="비밀번호"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
          
          <TouchableOpacity style={styles.primaryButton} onPress={handleLogin}>
            <Text style={styles.primaryButtonText}>로그인</Text>
          </TouchableOpacity>

          <View style={styles.socialLogin}>
            <Text style={styles.socialLoginText}>간편 로그인</Text>
            <View style={styles.socialButtons}>
              <TouchableOpacity style={styles.socialButton}>
                <Ionicons name="logo-google" size={24} color={COLORS.error} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.socialButton}>
                <Text style={styles.kakaoText}>K</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

// 2. 홈 화면 (대시보드)
const HomeScreen = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState('');

  // 모의 데이터
  const issueIndex = {
    current: 75,
    change: '+2.3%',
    trend: 'up',
    mainKeyword: '윤리적 AI',
  };

  const topModels = [
    { id: 1, name: 'GPT-4 Turbo', developer: 'OpenAI', score: '92.5', tags: ['Writing', 'Coding'] },
    { id: 2, name: 'Claude 3 Opus', developer: 'Anthropic', score: '91.8', tags: ['Reasoning', 'Analysis'] },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* 헤더 */}
        <View style={styles.homeHeader}>
          <View>
            <Text style={styles.greeting}>안녕하세요!</Text>
            <Text style={styles.homeTitle}>AI Trends</Text>
          </View>
          <TouchableOpacity>
            <Ionicons name="notifications-outline" size={24} color={COLORS.onSurface} />
          </TouchableOpacity>
        </View>

        {/* 검색바 */}
        <SearchBar
          placeholder="AI 모델 검색..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />

        {/* AI 이슈 지수 요약 */}
        <SectionHeader
          title="AI 이슈 지수"
          action="자세히"
          onActionPress={() => navigation.navigate('IssueIndex')}
        />
        <Card style={styles.issueIndexCard}>
          <View style={styles.issueIndexHeader}>
            <View>
              <Text style={styles.issueIndexLabel}>현재 지수</Text>
              <Text style={styles.issueIndexValue}>{issueIndex.current}</Text>
            </View>
            <View style={styles.issueIndexChange}>
              <Ionicons
                name="trending-up"
                size={20}
                color={COLORS.success}
              />
              <Text style={styles.issueIndexChangeText}>{issueIndex.change}</Text>
            </View>
          </View>
          <Text style={styles.issueIndexKeyword}>
            주요 키워드: {issueIndex.mainKeyword}
          </Text>
        </Card>

        {/* 빠른 메뉴 */}
        <SectionHeader title="빠른 메뉴" />
        <View style={styles.quickMenu}>
          <TouchableOpacity
            style={styles.quickMenuItem}
            onPress={() => navigation.navigate('Performance')}
          >
            <View style={styles.quickMenuIcon}>
              <Ionicons name="git-compare-outline" size={28} color={COLORS.primary} />
            </View>
            <Text style={styles.quickMenuText}>모델 비교</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.quickMenuItem}
            onPress={() => navigation.navigate('Timeline')}
          >
            <View style={styles.quickMenuIcon}>
              <Ionicons name="time-outline" size={28} color={COLORS.secondary} />
            </View>
            <Text style={styles.quickMenuText}>발전사</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.quickMenuItem}
            onPress={() => navigation.navigate('AiSearch')}
          >
            <View style={styles.quickMenuIcon}>
              <Ionicons name="search-circle-outline" size={28} color={COLORS.accent} />
            </View>
            <Text style={styles.quickMenuText}>AI 검색</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.quickMenuItem}
            onPress={() => navigation.navigate('Community')}
          >
            <View style={styles.quickMenuIcon}>
              <Ionicons name="people-outline" size={28} color={COLORS.info} />
            </View>
            <Text style={styles.quickMenuText}>커뮤니티</Text>
          </TouchableOpacity>
        </View>

        {/* 상위 모델 */}
        <SectionHeader
          title="상위 AI 모델"
          action="전체보기"
          onActionPress={() => navigation.navigate('Models')}
        />
        {topModels.map(model => (
          <ModelCard
            key={model.id}
            model={model}
            onPress={() => navigation.navigate('ModelDetail', { model })}
          />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

// 3. AI 모델 목록 화면
const ModelsScreen = ({ navigation }) => {
  const [selectedSeries, setSelectedSeries] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const series = ['All', 'GPT', 'Claude', 'Gemini', 'LLaMA'];
  
  const models = [
    { id: 1, name: 'GPT-4 Turbo', developer: 'OpenAI', score: '92.5', tags: ['Writing', 'Coding'], series: 'GPT' },
    { id: 2, name: 'Claude 3 Opus', developer: 'Anthropic', score: '91.8', tags: ['Reasoning'], series: 'Claude' },
    { id: 3, name: 'Gemini Pro', developer: 'Google', score: '90.2', tags: ['Multimodal'], series: 'Gemini' },
    { id: 4, name: 'GPT-3.5', developer: 'OpenAI', score: '85.0', tags: ['General'], series: 'GPT' },
  ];

  const filteredModels = models.filter(
    model =>
      (selectedSeries === 'All' || model.series === selectedSeries) &&
      model.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.modelsHeader}>
        <SearchBar
          placeholder="모델 검색..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.filterScroll}
        >
          {series.map(s => (
            <Chip
              key={s}
              label={s}
              selected={selectedSeries === s}
              onPress={() => setSelectedSeries(s)}
            />
          ))}
        </ScrollView>
      </View>

      <FlatList
        data={filteredModels}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => (
          <ModelCard
            model={item}
            onPress={() => navigation.navigate('ModelDetail', { model: item })}
          />
        )}
        contentContainerStyle={styles.modelsList}
      />
    </SafeAreaView>
  );
};

// 4. 모델 상세 화면
const ModelDetailScreen = ({ route, navigation }) => {
  const { model } = route.params;

  const benchmarks = [
    { name: 'MMLU', score: 90.1 },
    { name: 'HumanEval', score: 88.5 },
    { name: 'GSM8K', score: 92.3 },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <Card style={styles.modelDetailCard}>
          <Text style={styles.modelDetailName}>{model.name}</Text>
          <Text style={styles.modelDetailDeveloper}>{model.developer}</Text>
          
          <View style={styles.modelDetailScore}>
            <Text style={styles.modelDetailScoreValue}>{model.score}</Text>
            <Text style={styles.modelDetailScoreLabel}>Overall Score</Text>
          </View>
        </Card>

        <SectionHeader title="벤치마크 점수" />
        <Card>
          {benchmarks.map((benchmark, index) => (
            <View key={index} style={styles.benchmarkItem}>
              <Text style={styles.benchmarkName}>{benchmark.name}</Text>
              <View style={styles.benchmarkBar}>
                <View
                  style={[
                    styles.benchmarkProgress,
                    { width: `${benchmark.score}%` },
                  ]}
                />
              </View>
              <Text style={styles.benchmarkScore}>{benchmark.score}</Text>
            </View>
          ))}
        </Card>

        <TouchableOpacity
          style={styles.primaryButton}
          onPress={() => navigation.navigate('Performance', { preselected: model })}
        >
          <Text style={styles.primaryButtonText}>다른 모델과 비교하기</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

// 5. 성능 비교 화면
const PerformanceScreen = ({ navigation }) => {
  const [model1, setModel1] = useState('GPT-4');
  const [model2, setModel2] = useState('Claude 3');

  const comparisonData = {
    labels: ['Writing', 'Coding', 'Reasoning', 'Analysis'],
    datasets: [
      {
        data: [90, 88, 82, 85],
        color: () => COLORS.primary,
      },
      {
        data: [85, 92, 89, 87],
        color: () => COLORS.secondary,
      },
    ],
  };

  const chartConfig = {
    backgroundColor: COLORS.surface,
    backgroundGradientFrom: COLORS.surface,
    backgroundGradientTo: COLORS.surface,
    color: (opacity = 1) => `rgba(66, 133, 244, ${opacity})`,
    strokeWidth: 2,
    barPercentage: 0.5,
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* 모델 선택 */}
        <View style={styles.modelSelector}>
          <TouchableOpacity style={styles.modelSelectButton}>
            <Text style={styles.modelSelectText}>{model1}</Text>
            <Ionicons name="chevron-down" size={20} color={COLORS.onSurface} />
          </TouchableOpacity>
          <Text style={styles.vsText}>VS</Text>
          <TouchableOpacity style={styles.modelSelectButton}>
            <Text style={styles.modelSelectText}>{model2}</Text>
            <Ionicons name="chevron-down" size={20} color={COLORS.onSurface} />
          </TouchableOpacity>
        </View>

        {/* 비교 차트 */}
        <SectionHeader title="성능 비교" />
        <Card>
          <BarChart
            data={comparisonData}
            width={SCREEN_WIDTH - SPACING.lg * 4}
            height={220}
            chartConfig={chartConfig}
            style={styles.chart}
            showValuesOnTopOfBars
          />
        </Card>

        {/* 상세 비교 */}
        <SectionHeader title="상세 비교" />
        {comparisonData.labels.map((label, index) => (
          <Card key={index} style={styles.detailComparisonCard}>
            <Text style={styles.detailComparisonTitle}>{label}</Text>
            <View style={styles.detailComparisonRow}>
              <View style={styles.detailComparisonItem}>
                <Text style={styles.detailComparisonModel}>{model1}</Text>
                <Text style={[styles.detailComparisonScore, { color: COLORS.primary }]}>
                  {comparisonData.datasets[0].data[index]}
                </Text>
              </View>
              <View style={styles.detailComparisonItem}>
                <Text style={styles.detailComparisonModel}>{model2}</Text>
                <Text style={[styles.detailComparisonScore, { color: COLORS.secondary }]}>
                  {comparisonData.datasets[1].data[index]}
                </Text>
              </View>
            </View>
          </Card>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

// 6. 이슈 지수 화면
const IssueIndexScreen = ({ navigation }) => {
  const issueData = {
    labels: ['1주', '2주', '3주', '4주'],
    datasets: [
      {
        data: [65, 68, 72, 75],
      },
    ],
  };

  const chartConfig = {
    backgroundColor: COLORS.surface,
    backgroundGradientFrom: COLORS.surface,
    backgroundGradientTo: COLORS.surface,
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(66, 133, 244, ${opacity})`,
    strokeWidth: 2,
  };

  const evidences = [
    {
      type: 'News',
      title: 'AI 윤리 규제 법안 통과',
      summary: 'AI 개발과 사용에 대한 새로운 윤리 규제가 통과되었습니다...',
      source: '테크뉴스',
      date: '2025.10.20',
    },
    {
      type: 'Trend',
      title: 'AI 일자리 검색량 증가',
      summary: 'Google Trends에서 "AI 일자리" 키워드 검색이 전주 대비 35% 증가...',
      source: 'Google Trends',
      date: '2025.10.18',
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* 현재 지수 */}
        <Card style={styles.currentIndexCard}>
          <Text style={styles.currentIndexLabel}>현재 AI 이슈 지수</Text>
          <View style={styles.currentIndexValue}>
            <Text style={styles.currentIndexNumber}>75</Text>
            <View style={styles.currentIndexChange}>
              <Ionicons name="trending-up" size={24} color={COLORS.success} />
              <Text style={styles.currentIndexChangeText}>+2.3%</Text>
            </View>
          </View>
          <Text style={styles.currentIndexDate}>2025년 10월 4주차</Text>
        </Card>

        {/* 추이 그래프 */}
        <SectionHeader title="이슈 지수 추이" />
        <Card>
          <LineChart
            data={issueData}
            width={SCREEN_WIDTH - SPACING.lg * 4}
            height={220}
            chartConfig={chartConfig}
            bezier
            style={styles.chart}
          />
        </Card>

        {/* 근거 데이터 */}
        <SectionHeader title="근거 데이터" />
        {evidences.map((evidence, index) => (
          <Card key={index} style={styles.evidenceCard}>
            <View style={styles.evidenceHeader}>
              <View style={styles.evidenceTypeBadge}>
                <Text style={styles.evidenceTypeText}>{evidence.type}</Text>
              </View>
              <Text style={styles.evidenceDate}>{evidence.date}</Text>
            </View>
            <Text style={styles.evidenceTitle}>{evidence.title}</Text>
            <Text style={styles.evidenceSummary}>{evidence.summary}</Text>
            <TouchableOpacity style={styles.evidenceLink}>
              <Text style={styles.evidenceLinkText}>자세히 보기</Text>
              <Ionicons name="arrow-forward" size={16} color={COLORS.primary} />
            </TouchableOpacity>
          </Card>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

// 7. 타임라인 화면
const TimelineScreen = ({ navigation }) => {
  const [selectedSeries, setSelectedSeries] = useState('GPT');

  const series = ['GPT', 'Claude', 'Gemini'];
  
  const timelineData = {
    GPT: [
      {
        title: 'GPT-4 Turbo',
        date: '2023년 11월',
        description: '128K 컨텍스트 윈도우, 멀티모달 기능 강화',
        improvements: [
          '컨텍스트 윈도우 확장 (8K → 128K)',
          '이미지 입력 지원',
          '함수 호출 기능 개선',
        ],
      },
      {
        title: 'GPT-4',
        date: '2023년 3월',
        description: '멀티모달 기능, 향상된 추론 능력',
        improvements: [
          '멀티모달 입력 지원',
          '추론 능력 대폭 향상',
          '안전성 개선',
        ],
      },
      {
        title: 'GPT-3.5',
        date: '2022년 11월',
        description: 'ChatGPT 출시, 대화형 AI의 시작',
        improvements: [
          '대화형 인터페이스',
          'RLHF 적용',
          '빠른 응답 속도',
        ],
      },
    ],
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.timelineContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.seriesSelector}
        >
          {series.map(s => (
            <Chip
              key={s}
              label={s}
              selected={selectedSeries === s}
              onPress={() => setSelectedSeries(s)}
            />
          ))}
        </ScrollView>

        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          {timelineData[selectedSeries]?.map((item, index) => (
            <TimelineItem
              key={index}
              item={item}
              isLast={index === timelineData[selectedSeries].length - 1}
            />
          ))}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

// 8. AI 검색 화면
const AiSearchScreen = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', 'Writing', 'Coding', 'Analysis', 'Image'];
  
  const searchResults = [
    {
      id: 1,
      rank: 1,
      name: 'GPT-4 Turbo',
      developer: 'OpenAI',
      score: '92.5',
      category: 'Writing',
      description: '뛰어난 글쓰기 능력과 긴 컨텍스트 지원',
    },
    {
      id: 2,
      rank: 2,
      name: 'Claude 3 Opus',
      developer: 'Anthropic',
      score: '91.8',
      category: 'Analysis',
      description: '복잡한 분석과 추론에 특화',
    },
  ];

  const filteredResults = searchResults.filter(
    result =>
      (selectedCategory === 'All' || result.category === selectedCategory) &&
      result.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.searchContainer}>
        <SearchBar
          placeholder="작업 또는 모델 검색 (예: 블로그 글 작성)"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.filterScroll}
        >
          {categories.map(category => (
            <Chip
              key={category}
              label={category}
              selected={selectedCategory === category}
              onPress={() => setSelectedCategory(category)}
            />
          ))}
        </ScrollView>
      </View>

      <FlatList
        data={filteredResults}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => (
          <Card style={styles.searchResultCard}>
            <View style={styles.searchResultHeader}>
              <Text style={styles.searchResultRank}>#{item.rank}</Text>
              <View style={styles.searchResultInfo}>
                <Text style={styles.searchResultName}>{item.name}</Text>
                <Text style={styles.searchResultDeveloper}>{item.developer}</Text>
              </View>
              <Text style={styles.searchResultScore}>{item.score}</Text>
            </View>
            <Text style={styles.searchResultDescription}>{item.description}</Text>
            <View style={styles.searchResultActions}>
              <TouchableOpacity
                style={styles.secondaryButton}
                onPress={() => navigation.navigate('ModelDetail', { model: item })}
              >
                <Text style={styles.secondaryButtonText}>상세보기</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.primaryButtonSmall}
                onPress={() => navigation.navigate('Performance', { preselected: item })}
              >
                <Text style={styles.primaryButtonTextSmall}>비교하기</Text>
              </TouchableOpacity>
            </View>
          </Card>
        )}
        contentContainerStyle={styles.searchResultsList}
      />
    </SafeAreaView>
  );
};

// 9. 커뮤니티 화면
const CommunityScreen = ({ navigation }) => {
  const [selectedTab, setSelectedTab] = useState('popular');

  const posts = [
    {
      id: 1,
      author: '홍길동',
      date: '2시간 전',
      title: 'ChatGPT로 블로그 글 10분 만에 작성하는 프롬프트',
      content: '제가 사용하는 블로그 글 작성 프롬프트를 공유합니다. 먼저 주제를 정하고...',
      likes: 42,
      comments: 15,
      isLiked: false,
    },
    {
      id: 2,
      author: '김철수',
      date: '5시간 전',
      title: 'Claude vs GPT-4, 코딩 실력 비교 후기',
      content: '두 모델로 같은 프로젝트를 만들어봤는데, 각각 장단점이 있네요...',
      likes: 38,
      comments: 12,
      isLiked: true,
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.communityHeader}>
        <View style={styles.communityTabs}>
          <TouchableOpacity
            style={[styles.communityTab, selectedTab === 'popular' && styles.communityTabActive]}
            onPress={() => setSelectedTab('popular')}
          >
            <Text
              style={[
                styles.communityTabText,
                selectedTab === 'popular' && styles.communityTabTextActive,
              ]}
            >
              인기
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.communityTab, selectedTab === 'recent' && styles.communityTabActive]}
            onPress={() => setSelectedTab('recent')}
          >
            <Text
              style={[
                styles.communityTabText,
                selectedTab === 'recent' && styles.communityTabTextActive,
              ]}
            >
              최신
            </Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          style={styles.writeButton}
          onPress={() => navigation.navigate('WritePost')}
        >
          <Ionicons name="create-outline" size={24} color={COLORS.primary} />
        </TouchableOpacity>
      </View>

      <FlatList
        data={posts}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => (
          <CommunityPostCard
            post={item}
            onPress={() => navigation.navigate('PostDetail', { post: item })}
            onLike={() => console.log('Like:', item.id)}
          />
        )}
        contentContainerStyle={styles.postsList}
      />
    </SafeAreaView>
  );
};

// 10. 마이페이지 화면
const ProfileScreen = ({ navigation }) => {
  const menuItems = [
    { icon: 'person-outline', title: '프로필 수정', screen: 'EditProfile' },
    { icon: 'bookmark-outline', title: '저장한 모델', screen: 'SavedModels' },
    { icon: 'document-text-outline', title: '내 게시글', screen: 'MyPosts' },
    { icon: 'settings-outline', title: '설정', screen: 'Settings' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <Card style={styles.profileCard}>
          <View style={styles.profileAvatar}>
            <Ionicons name="person" size={40} color={COLORS.primary} />
          </View>
          <Text style={styles.profileName}>사용자</Text>
          <Text style={styles.profileEmail}>user@example.com</Text>
        </Card>

        <View style={styles.menuList}>
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.menuItem}
              onPress={() => console.log('Navigate:', item.screen)}
            >
              <View style={styles.menuItemLeft}>
                <Ionicons name={item.icon} size={24} color={COLORS.onSurface} />
                <Text style={styles.menuItemText}>{item.title}</Text>
              </View>
              <Ionicons name="chevron-forward" size={24} color={COLORS.onSurfaceVariant} />
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity style={styles.logoutButton}>
          <Text style={styles.logoutButtonText}>로그아웃</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

// ==================== 네비게이션 설정 ====================

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const MainTabs = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      tabBarIcon: ({ focused, color, size }) => {
        let iconName;
        if (route.name === 'Home') iconName = 'home';
        else if (route.name === 'Models') iconName = 'cube';
        else if (route.name === 'Community') iconName = 'people';
        else if (route.name === 'Profile') iconName = 'person';

        return (
          <Ionicons
            name={focused ? iconName : `${iconName}-outline`}
            size={size}
            color={color}
          />
        );
      },
      tabBarActiveTintColor: COLORS.primary,
      tabBarInactiveTintColor: COLORS.onSurfaceVariant,
      tabBarStyle: styles.tabBar,
      tabBarLabelStyle: styles.tabBarLabel,
      headerShown: false,
    })}
  >
    <Tab.Screen name="Home" component={HomeScreen} options={{ title: '홈' }} />
    <Tab.Screen name="Models" component={ModelsScreen} options={{ title: '모델' }} />
    <Tab.Screen name="Community" component={CommunityScreen} options={{ title: '커뮤니티' }} />
    <Tab.Screen name="Profile" component={ProfileScreen} options={{ title: '마이' }} />
  </Tab.Navigator>
);

const App = () => (
  <NavigationContainer>
    <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: COLORS.surface },
        headerTintColor: COLORS.onSurface,
        headerTitleStyle: { fontWeight: '600' },
      }}
    >
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Main"
        component={MainTabs}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ModelDetail"
        component={ModelDetailScreen}
        options={{ title: '모델 상세' }}
      />
      <Stack.Screen
        name="Performance"
        component={PerformanceScreen}
        options={{ title: '성능 비교' }}
      />
      <Stack.Screen
        name="IssueIndex"
        component={IssueIndexScreen}
        options={{ title: 'AI 이슈 지수' }}
      />
      <Stack.Screen
        name="Timeline"
        component={TimelineScreen}
        options={{ title: '모델 발전사' }}
      />
      <Stack.Screen
        name="AiSearch"
        component={AiSearchScreen}
        options={{ title: 'AI 검색' }}
      />
    </Stack.Navigator>
  </NavigationContainer>
);

// ==================== 스타일 ====================

const styles = StyleSheet.create({
  // 기본 레이아웃
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: SPACING.md,
  },
  
  // 카드
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },

  // 섹션 헤더
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: SPACING.lg,
    marginBottom: SPACING.md,
  },
  sectionTitle: {
    ...TYPOGRAPHY.h3,
    color: COLORS.onSurface,
  },
  sectionAction: {
    ...TYPOGRAPHY.button,
    color: COLORS.primary,
  },

  // 검색바
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    marginBottom: SPACING.md,
  },
  searchInput: {
    flex: 1,
    marginLeft: SPACING.sm,
    ...TYPOGRAPHY.body1,
    color: COLORS.onSurface,
  },

  // 칩
  chip: {
    backgroundColor: COLORS.surface,
    borderRadius: 20,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    marginRight: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  chipSelected: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  chipText: {
    ...TYPOGRAPHY.body2,
    color: COLORS.onSurface,
  },
  chipTextSelected: {
    color: COLORS.onPrimary,
  },

  // 버튼
  primaryButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    paddingVertical: SPACING.md,
    alignItems: 'center',
    marginTop: SPACING.md,
  },
  primaryButtonText: {
    ...TYPOGRAPHY.button,
    color: COLORS.onPrimary,
  },
  primaryButtonSmall: {
    backgroundColor: COLORS.primary,
    borderRadius: 8,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
  },
  primaryButtonTextSmall: {
    ...TYPOGRAPHY.button,
    fontSize: 12,
    color: COLORS.onPrimary,
  },
  secondaryButton: {
    backgroundColor: COLORS.surface,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
  },
  secondaryButtonText: {
    ...TYPOGRAPHY.button,
    fontSize: 12,
    color: COLORS.onSurface,
  },

  // 스탯 카드
  statCard: {
    alignItems: 'center',
    minWidth: CARD_WIDTH,
  },
  statIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.surfaceVariant,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  statLabel: {
    ...TYPOGRAPHY.caption,
    color: COLORS.onSurfaceVariant,
    marginBottom: SPACING.xs,
  },
  statValue: {
    ...TYPOGRAPHY.h2,
    color: COLORS.onSurface,
  },
  statChange: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: SPACING.xs,
  },
  statChangeText: {
    ...TYPOGRAPHY.body2,
    fontWeight: '600',
    marginLeft: SPACING.xs,
  },

  // 모델 카드
  modelCard: {
    marginBottom: SPACING.md,
  },
  modelHeader: {
    marginBottom: SPACING.md,
  },
  modelName: {
    ...TYPOGRAPHY.h4,
    color: COLORS.onSurface,
    marginBottom: SPACING.xs,
  },
  modelDeveloper: {
    ...TYPOGRAPHY.body2,
    color: COLORS.onSurfaceVariant,
  },
  modelScoreContainer: {
    alignItems: 'center',
    paddingVertical: SPACING.md,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: COLORS.divider,
    marginBottom: SPACING.md,
  },
  modelScore: {
    ...TYPOGRAPHY.h1,
    color: COLORS.primary,
    marginBottom: SPACING.xs,
  },
  modelScoreLabel: {
    ...TYPOGRAPHY.caption,
    color: COLORS.onSurfaceVariant,
  },
  modelTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  modelTag: {
    backgroundColor: COLORS.surfaceVariant,
    borderRadius: 4,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    marginRight: SPACING.sm,
    marginBottom: SPACING.sm,
  },
  modelTagText: {
    ...TYPOGRAPHY.caption,
    color: COLORS.onSurface,
  },

  // 타임라인
  timelineItem: {
    flexDirection: 'row',
    marginBottom: SPACING.lg,
  },
  timelineIndicator: {
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  timelineDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: COLORS.primary,
  },
  timelineLine: {
    width: 2,
    flex: 1,
    backgroundColor: COLORS.divider,
    marginTop: SPACING.sm,
  },
  timelineContent: {
    flex: 1,
    padding: SPACING.md,
  },
  timelineTitle: {
    ...TYPOGRAPHY.h4,
    color: COLORS.onSurface,
    marginBottom: SPACING.xs,
  },
  timelineDate: {
    ...TYPOGRAPHY.body2,
    color: COLORS.onSurfaceVariant,
    marginBottom: SPACING.sm,
  },
  timelineDescription: {
    ...TYPOGRAPHY.body2,
    color: COLORS.onSurface,
  },
  timelineImprovements: {
    marginTop: SPACING.sm,
    paddingTop: SPACING.sm,
    borderTopWidth: 1,
    borderColor: COLORS.divider,
  },
  timelineImprovementsTitle: {
    ...TYPOGRAPHY.body2,
    fontWeight: '600',
    color: COLORS.onSurface,
    marginBottom: SPACING.xs,
  },
  timelineImprovement: {
    ...TYPOGRAPHY.caption,
    color: COLORS.onSurfaceVariant,
    marginBottom: SPACING.xs,
  },

  // 커뮤니티 포스트
  postCard: {
    marginBottom: SPACING.md,
  },
  postHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.sm,
  },
  postAuthor: {
    ...TYPOGRAPHY.body2,
    fontWeight: '600',
    color: COLORS.onSurface,
  },
  postDate: {
    ...TYPOGRAPHY.caption,
    color: COLORS.onSurfaceVariant,
  },
  postTitle: {
    ...TYPOGRAPHY.h4,
    color: COLORS.onSurface,
    marginBottom: SPACING.sm,
  },
  postContent: {
    ...TYPOGRAPHY.body2,
    color: COLORS.onSurfaceVariant,
    marginBottom: SPACING.md,
  },
  postFooter: {
    flexDirection: 'row',
    paddingTop: SPACING.md,
    borderTopWidth: 1,
    borderColor: COLORS.divider,
  },
  postAction: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: SPACING.lg,
  },
  postActionText: {
    ...TYPOGRAPHY.caption,
    color: COLORS.onSurfaceVariant,
    marginLeft: SPACING.xs,
  },

  // 로그인 화면
  loginContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.lg,
  },
  loginTitle: {
    ...TYPOGRAPHY.h1,
    color: COLORS.onSurface,
    marginTop: SPACING.md,
    marginBottom: SPACING.xs,
  },
  loginSubtitle: {
    ...TYPOGRAPHY.body1,
    color: COLORS.onSurfaceVariant,
    marginBottom: SPACING.xl,
  },
  loginForm: {
    width: '100%',
  },
  input: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    ...TYPOGRAPHY.body1,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  socialLogin: {
    alignItems: 'center',
    marginTop: SPACING.xl,
  },
  socialLoginText: {
    ...TYPOGRAPHY.body2,
    color: COLORS.onSurfaceVariant,
    marginBottom: SPACING.md,
  },
  socialButtons: {
    flexDirection: 'row',
  },
  socialButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: COLORS.surface,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  kakaoText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#3C1E1E',
  },

  // 홈 화면
  homeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SPACING.md,
  },
  greeting: {
    ...TYPOGRAPHY.body1,
    color: COLORS.onSurfaceVariant,
  },
  homeTitle: {
    ...TYPOGRAPHY.h2,
    color: COLORS.onSurface,
  },
  issueIndexCard: {
    backgroundColor: COLORS.primary,
  },
  issueIndexHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  issueIndexLabel: {
    ...TYPOGRAPHY.body2,
    color: COLORS.onPrimary,
    opacity: 0.8,
  },
  issueIndexValue: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  issueIndexNumber: {
    ...TYPOGRAPHY.h1,
    fontSize: 48,
    color: COLORS.onPrimary,
  },
  issueIndexChange: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  issueIndexChangeText: {
    ...TYPOGRAPHY.h4,
    color: COLORS.onPrimary,
    marginLeft: SPACING.xs,
  },
  issueIndexKeyword: {
    ...TYPOGRAPHY.body2,
    color: COLORS.onPrimary,
    opacity: 0.9,
  },
  issueIndexDate: {
    ...TYPOGRAPHY.caption,
    color: COLORS.onPrimary,
    opacity: 0.7,
    marginTop: SPACING.xs,
  },
  quickMenu: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  quickMenuItem: {
    width: CARD_WIDTH,
    aspectRatio: 1,
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: SPACING.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  quickMenuIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: COLORS.surfaceVariant,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  quickMenuText: {
    ...TYPOGRAPHY.body2,
    fontWeight: '600',
    color: COLORS.onSurface,
    textAlign: 'center',
  },

  // 모델 목록 화면
  modelsHeader: {
    padding: SPACING.md,
  },
  filterScroll: {
    flexDirection: 'row',
  },
  modelsList: {
    padding: SPACING.md,
  },

  // 모델 상세 화면
  modelDetailCard: {
    alignItems: 'center',
    padding: SPACING.xl,
  },
  modelDetailName: {
    ...TYPOGRAPHY.h2,
    color: COLORS.onSurface,
    marginBottom: SPACING.xs,
  },
  modelDetailDeveloper: {
    ...TYPOGRAPHY.body1,
    color: COLORS.onSurfaceVariant,
    marginBottom: SPACING.lg,
  },
  modelDetailScore: {
    alignItems: 'center',
  },
  modelDetailScoreValue: {
    ...TYPOGRAPHY.h1,
    fontSize: 64,
    color: COLORS.primary,
  },
  modelDetailScoreLabel: {
    ...TYPOGRAPHY.body2,
    color: COLORS.onSurfaceVariant,
  },
  benchmarkItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  benchmarkName: {
    ...TYPOGRAPHY.body2,
    color: COLORS.onSurface,
    width: 80,
  },
  benchmarkBar: {
    flex: 1,
    height: 8,
    backgroundColor: COLORS.surfaceVariant,
    borderRadius: 4,
    overflow: 'hidden',
    marginHorizontal: SPACING.md,
  },
  benchmarkProgress: {
    height: '100%',
    backgroundColor: COLORS.primary,
  },
  benchmarkScore: {
    ...TYPOGRAPHY.body2,
    fontWeight: '600',
    color: COLORS.onSurface,
    width: 40,
    textAlign: 'right',
  },

  // 성능 비교 화면
  modelSelector: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  modelSelectButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: SPACING.md,
    minWidth: 120,
    justifyContent: 'space-between',
  },
  modelSelectText: {
    ...TYPOGRAPHY.body1,
    fontWeight: '600',
    color: COLORS.onSurface,
  },
  vsText: {
    ...TYPOGRAPHY.h4,
    color: COLORS.onSurfaceVariant,
  },
  chart: {
    marginVertical: SPACING.md,
    borderRadius: 12,
  },
  detailComparisonCard: {
    marginBottom: SPACING.md,
  },
  detailComparisonTitle: {
    ...TYPOGRAPHY.h4,
    color: COLORS.onSurface,
    marginBottom: SPACING.md,
  },
  detailComparisonRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  detailComparisonItem: {
    alignItems: 'center',
  },
  detailComparisonModel: {
    ...TYPOGRAPHY.body2,
    color: COLORS.onSurfaceVariant,
    marginBottom: SPACING.xs,
  },
  detailComparisonScore: {
    ...TYPOGRAPHY.h3,
    fontWeight: '700',
  },

  // 이슈 지수 화면
  currentIndexCard: {
    backgroundColor: COLORS.surface,
    padding: SPACING.xl,
  },
  currentIndexLabel: {
    ...TYPOGRAPHY.body1,
    color: COLORS.onSurfaceVariant,
    marginBottom: SPACING.sm,
  },
  currentIndexValue: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SPACING.md,
  },
  currentIndexNumber: {
    ...TYPOGRAPHY.h1,
    fontSize: 64,
    color: COLORS.primary,
  },
  currentIndexKeyword: {
    ...TYPOGRAPHY.body1,
    color: COLORS.onSurface,
  },
  evidenceCard: {
    marginBottom: SPACING.md,
  },
  evidenceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  evidenceTypeBadge: {
    backgroundColor: COLORS.primary,
    borderRadius: 4,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
  },
  evidenceTypeText: {
    ...TYPOGRAPHY.caption,
    fontWeight: '600',
    color: COLORS.onPrimary,
  },
  evidenceDate: {
    ...TYPOGRAPHY.caption,
    color: COLORS.onSurfaceVariant,
  },
  evidenceTitle: {
    ...TYPOGRAPHY.h4,
    color: COLORS.onSurface,
    marginBottom: SPACING.sm,
  },
  evidenceSummary: {
    ...TYPOGRAPHY.body2,
    color: COLORS.onSurfaceVariant,
    marginBottom: SPACING.md,
  },
  evidenceLink: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  evidenceLinkText: {
    ...TYPOGRAPHY.button,
    color: COLORS.primary,
    marginRight: SPACING.xs,
  },

  // 타임라인 화면
  timelineContainer: {
    flex: 1,
    padding: SPACING.md,
  },
  seriesSelector: {
    marginBottom: SPACING.md,
  },

  // AI 검색 화면
  searchContainer: {
    padding: SPACING.md,
  },
  searchResultCard: {
    marginBottom: SPACING.md,
  },
  searchResultHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  searchResultRank: {
    ...TYPOGRAPHY.h3,
    color: COLORS.primary,
    marginRight: SPACING.md,
  },
  searchResultInfo: {
    flex: 1,
  },
  searchResultName: {
    ...TYPOGRAPHY.h4,
    color: COLORS.onSurface,
  },
  searchResultDeveloper: {
    ...TYPOGRAPHY.body2,
    color: COLORS.onSurfaceVariant,
  },
  searchResultScore: {
    ...TYPOGRAPHY.h4,
    color: COLORS.primary,
  },
  searchResultDescription: {
    ...TYPOGRAPHY.body2,
    color: COLORS.onSurfaceVariant,
    marginBottom: SPACING.md,
  },
  searchResultActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: SPACING.sm,
  },
  searchResultsList: {
    padding: SPACING.md,
  },

  // 커뮤니티 화면
  communityHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SPACING.md,
    backgroundColor: COLORS.surface,
    borderBottomWidth: 1,
    borderColor: COLORS.border,
  },
  communityTabs: {
    flexDirection: 'row',
  },
  communityTab: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
  },
  communityTabActive: {
    borderBottomWidth: 2,
    borderColor: COLORS.primary,
  },
  communityTabText: {
    ...TYPOGRAPHY.body1,
    color: COLORS.onSurfaceVariant,
  },
  communityTabTextActive: {
    color: COLORS.primary,
    fontWeight: '600',
  },
  writeButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  postsList: {
    padding: SPACING.md,
  },

  // 마이페이지
  profileCard: {
    alignItems: 'center',
    padding: SPACING.xl,
  },
  profileAvatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.surfaceVariant,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  profileName: {
    ...TYPOGRAPHY.h3,
    color: COLORS.onSurface,
    marginBottom: SPACING.xs,
  },
  profileEmail: {
    ...TYPOGRAPHY.body2,
    color: COLORS.onSurfaceVariant,
  },
  menuList: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    marginTop: SPACING.lg,
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: SPACING.md,
    borderBottomWidth: 1,
    borderColor: COLORS.divider,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuItemText: {
    ...TYPOGRAPHY.body1,
    color: COLORS.onSurface,
    marginLeft: SPACING.md,
  },
  logoutButton: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: SPACING.md,
    alignItems: 'center',
    marginTop: SPACING.lg,
    marginBottom: SPACING.xl,
    borderWidth: 1,
    borderColor: COLORS.error,
  },
  logoutButtonText: {
    ...TYPOGRAPHY.button,
    color: COLORS.error,
  },

  // 탭 바
  tabBar: {
    height: 60,
    paddingBottom: 8,
    backgroundColor: COLORS.surface,
    borderTopColor: COLORS.border,
  },
  tabBarLabel: {
    ...TYPOGRAPHY.caption,
    fontWeight: '600',
  },
});

export default App;
