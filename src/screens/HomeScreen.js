import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import IssueIndexCard from '../components/common/IssueIndexCard';
import InsightCard from '../components/common/InsightCard';
import Button from '../components/common/Button';
import { colors } from '../theme/colors';
import { textStyles } from '../theme/typography';
import { spacing, borderRadius } from '../theme/spacing';

const HomeScreen = ({ navigation }) => {
  // Mock data - 실제 앱에서는 API에서 가져옴
  const userName = '최수안';
  const userJob = '소프트웨어 개발자';

  const globalIssueIndex = {
    score: 78,
    trend: 3,
    riskLevel: 'high',
    mainIssues: [
      'Gemini 3 발표',
      'AI 딥페이크 사기 급증',
      'EU AI 규제 강화',
    ],
  };

  const jobIssueIndex = {
    score: 82,
    trend: 5,
    riskLevel: 'very_high',
    mainIssues: [
      '🚀 Gemini 3 코딩 능력 30% 향상',
      '⚖️ AI 저작권 규제 법안 발표',
      '💼 AI로 코딩 업무 50% 자동화',
    ],
  };

  const latestInsights = [
    {
      id: 1,
      category: 'crime',
      title: '[긴급] AI 딥페이크 사기',
      description: '피해자 3,000명 적발, 총 피해액 50억원',
      timestamp: '2시간 전',
      importance: 5,
      riskLevel: 'very_high',
      likes: 234,
      comments: 12,
    },
    {
      id: 2,
      category: 'company',
      title: 'Gemini 3 공개 (Google)',
      description: '성능 30% 향상, 코딩 능력 대폭 개선',
      timestamp: '5시간 전',
      importance: 5,
      riskLevel: 'high',
      likes: 1234,
      comments: 89,
    },
    {
      id: 3,
      category: 'regulation',
      title: '한국 생성AI 규제안 발표',
      description: '2025년 6월 시행 예정',
      timestamp: '1일 전',
      importance: 4,
      riskLevel: 'medium',
      likes: 567,
      comments: 45,
    },
  ];

  const quickTasks = [
    { label: '이미지 편집', icon: '🎨' },
    { label: '글쓰기', icon: '📝' },
    { label: '코딩', icon: '💻' },
    { label: '번역', icon: '🌐' },
    { label: '요약', icon: '📊' },
    { label: '기타 작업...', icon: '⚙️' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Greeting */}
        <View style={styles.greeting}>
          <Text style={styles.greetingText}>👋 안녕하세요, {userName}님!</Text>
        </View>

        {/* Divider */}
        <View style={styles.divider} />

        {/* Global Issue Index */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🌐 통합 AI 이슈 지수</Text>
          <IssueIndexCard
            title=""
            score={globalIssueIndex.score}
            trend={globalIssueIndex.trend}
            riskLevel={globalIssueIndex.riskLevel}
            mainIssues={globalIssueIndex.mainIssues}
            onPress={() => {/* Navigate to detail */}}
          />
        </View>

        {/* Divider */}
        <View style={styles.divider} />

        {/* Job-Specific Issue Index */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>💼 당신의 직업별 이슈 지수</Text>
          <IssueIndexCard
            title=""
            subtitle={userJob}
            score={jobIssueIndex.score}
            trend={jobIssueIndex.trend}
            riskLevel={jobIssueIndex.riskLevel}
            mainIssues={jobIssueIndex.mainIssues}
            onPress={() => {/* Navigate to detail */}}
          />
          <View style={styles.insightBox}>
            <Text style={styles.insightText}>
              💡 AI 코딩 도구가 크게 발전했습니다. 새로운 스킬 학습을 권장합니다.
            </Text>
          </View>
        </View>

        {/* Divider */}
        <View style={styles.divider} />

        {/* AI Progress Comparison */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📈 AI 발전 비교 (과거 vs 현재)</Text>
          <View style={styles.progressCard}>
            <View style={styles.progressImagePlaceholder}>
              <Text style={styles.placeholderText}>📊 차트/이미지 영역</Text>
            </View>
            <Text style={styles.progressStat}>평균 성능 향상: +210%</Text>
            <Text style={styles.progressDetail}>
              • 이미지 생성: +320%{'\n'}
              • 글쓰기: +180%{'\n'}
              • 코딩: +210%{'\n'}
              • 추론: +150%
            </Text>
            <TouchableOpacity style={styles.progressButton}>
              <Text style={styles.progressButtonText}>더 자세히 보기 →</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Divider */}
        <View style={styles.divider} />

        {/* Latest Insights */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>📰 최신 인사이트</Text>
          </View>
          {latestInsights.map((insight) => (
            <InsightCard
              key={insight.id}
              {...insight}
              onPress={() => navigation.navigate('Insights')}
              onLike={() => {/* Handle like */}}
              onComment={() => {/* Handle comment */}}
              onShare={() => {/* Handle share */}}
            />
          ))}
          <Button
            title="더 많은 인사이트 보기"
            variant="outline"
            fullWidth
            onPress={() => navigation.navigate('Insights')}
          />
        </View>

        {/* Divider */}
        <View style={styles.divider} />

        {/* Quick AI Recommendation */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🎯 빠른 AI 추천</Text>
          <View style={styles.quickRecommendCard}>
            <Text style={styles.quickRecommendTitle}>
              오늘 무슨 작업을 하시나요?
            </Text>
            <View style={styles.taskButtons}>
              {quickTasks.map((task, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.taskButton}
                  onPress={() => navigation.navigate('AIRecommend')}
                >
                  <Text style={styles.taskIcon}>{task.icon}</Text>
                  <Text style={styles.taskLabel}>{task.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <Button
              title="추천받기"
              variant="primary"
              fullWidth
              onPress={() => navigation.navigate('AIRecommend')}
              style={styles.recommendButton}
            />
          </View>
        </View>

        {/* Bottom Padding */}
        <View style={{ height: spacing.xl }} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundGray,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: spacing.md,
  },
  greeting: {
    paddingVertical: spacing.lg,
  },
  greetingText: {
    ...textStyles.h3,
    color: colors.text,
  },
  divider: {
    height: 1,
    backgroundColor: colors.divider,
    marginVertical: spacing.lg,
  },
  section: {
    marginBottom: spacing.md,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  sectionTitle: {
    ...textStyles.h3,
    color: colors.text,
    marginBottom: spacing.md,
  },
  insightBox: {
    backgroundColor: colors.primaryLight + '20',
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginTop: spacing.md,
  },
  insightText: {
    ...textStyles.body2,
    color: colors.text,
    lineHeight: 20,
  },
  progressCard: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  progressImagePlaceholder: {
    height: 150,
    backgroundColor: colors.backgroundGray,
    borderRadius: borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  placeholderText: {
    ...textStyles.body1,
    color: colors.textSecondary,
  },
  progressStat: {
    ...textStyles.h4,
    color: colors.primary,
    marginBottom: spacing.sm,
  },
  progressDetail: {
    ...textStyles.body2,
    color: colors.textSecondary,
    lineHeight: 20,
    marginBottom: spacing.md,
  },
  progressButton: {
    paddingVertical: spacing.sm,
  },
  progressButtonText: {
    ...textStyles.body1,
    color: colors.primary,
    fontWeight: '600',
    textAlign: 'center',
  },
  quickRecommendCard: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  quickRecommendTitle: {
    ...textStyles.h4,
    color: colors.text,
    marginBottom: spacing.md,
    textAlign: 'center',
  },
  taskButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  taskButton: {
    width: '31%',
    backgroundColor: colors.backgroundGray,
    borderRadius: borderRadius.md,
    padding: spacing.sm,
    marginBottom: spacing.sm,
    alignItems: 'center',
  },
  taskIcon: {
    fontSize: 24,
    marginBottom: spacing.xs,
  },
  taskLabel: {
    ...textStyles.caption,
    color: colors.text,
    textAlign: 'center',
  },
  recommendButton: {
    marginTop: spacing.sm,
  },
});

export default HomeScreen;
