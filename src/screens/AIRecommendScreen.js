import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Button from '../components/common/Button';
import Card from '../components/common/Card';
import { colors } from '../theme/colors';
import { textStyles } from '../theme/typography';
import { spacing, borderRadius } from '../theme/spacing';

const AIRecommendScreen = () => {
  const [taskInput, setTaskInput] = useState('');
  const [showResults, setShowResults] = useState(false);

  const quickTasks = [
    { id: 'writing', label: '글쓰기', icon: '📝' },
    { id: 'image', label: '이미지', icon: '🎨' },
    { id: 'coding', label: '코딩', icon: '💻' },
    { id: 'translate', label: '번역', icon: '🌐' },
    { id: 'data', label: '데이터', icon: '📊' },
    { id: 'video', label: '비디오', icon: '🎬' },
    { id: 'summary', label: '요약', icon: '📱' },
    { id: 'idea', label: '아이디어', icon: '💡' },
  ];

  const recentRecommendations = [
    { task: '마케팅 카피 작성', ai: 'ChatGPT' },
    { task: '이미지 배경 제거', ai: 'remove.bg' },
    { task: '코드 버그 찾기', ai: 'Claude' },
  ];

  const savedRecommendations = [
    { ai: 'Google Vision API', category: 'OCR' },
    { ai: 'Claude 3', category: '글쓰기' },
    { ai: 'Midjourney', category: '이미지 생성' },
  ];

  // Mock recommendation results
  const recommendationResults = [
    {
      rank: 1,
      name: 'Google Vision API',
      score: 98.5,
      accuracy: '98.5%',
      speed: '0.2초/이미지',
      cost: '$1.50/1000 요청',
      languages: '138개 언어',
      pros: ['가장 정확함', '가장 빠름', '다양한 언어 지원'],
      cons: ['상대적으로 비용 높음'],
      rating: 9.5,
    },
    {
      rank: 2,
      name: 'Claude 3 Vision',
      score: 97.2,
      accuracy: '97.2%',
      speed: '0.5초/이미지',
      cost: '$0.003/입력 토큰',
      languages: '95개 언어',
      pros: ['가성비 최고', '이미지 설명도 우수', '오류율 낮음'],
      cons: ['조금 느림 (0.5초)', '특수 형식 지원 제한'],
      rating: 8.5,
    },
    {
      rank: 3,
      name: 'GPT-4 Vision',
      score: 96.8,
      accuracy: '96.8%',
      speed: '1초/이미지',
      cost: '$0.01/입력 토큰',
      languages: '150개 언어',
      pros: ['가장 다양한 언어 지원', '이미지 설명도 우수', '맥락 이해 능력'],
      cons: ['가장 느림', '비용도 중간 정도'],
      rating: 7.5,
    },
  ];

  const handleRecommend = () => {
    if (taskInput.trim()) {
      setShowResults(true);
    }
  };

  const handleQuickTask = (taskId) => {
    setTaskInput(quickTasks.find((t) => t.id === taskId)?.label || '');
    setShowResults(true);
  };

  const getRankIcon = (rank) => {
    switch (rank) {
      case 1: return '🥇';
      case 2: return '🥈';
      case 3: return '🥉';
      default: return '';
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {!showResults ? (
          <>
            {/* Task Input Section */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>🎯 오늘 무슨 작업을 하시나요?</Text>

              {/* Quick Task Buttons */}
              <Text style={styles.label}>빠른 선택:</Text>
              <View style={styles.taskButtons}>
                {quickTasks.map((task) => (
                  <TouchableOpacity
                    key={task.id}
                    style={styles.taskButton}
                    onPress={() => handleQuickTask(task.id)}
                  >
                    <Text style={styles.taskIcon}>{task.icon}</Text>
                    <Text style={styles.taskLabel}>{task.label}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Text Input */}
              <Text style={styles.label}>또는 직접 입력:</Text>
              <TextInput
                style={styles.input}
                placeholder='예: "이미지에서 텍스트 추출"'
                placeholderTextColor={colors.textLight}
                value={taskInput}
                onChangeText={setTaskInput}
              />

              <Button
                title="🔍 추천받기"
                onPress={handleRecommend}
                fullWidth
                disabled={!taskInput.trim()}
              />
            </View>

            {/* Recent Recommendations */}
            {recentRecommendations.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>📌 최근 추천 기록</Text>
                {recentRecommendations.map((rec, index) => (
                  <Card key={index} style={styles.historyCard}>
                    <View style={styles.historyItem}>
                      <Text style={styles.historyTask}>• "{rec.task}"</Text>
                      <Text style={styles.historyAI}>→ {rec.ai}</Text>
                    </View>
                  </Card>
                ))}
              </View>
            )}

            {/* Saved Recommendations */}
            {savedRecommendations.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>💾 저장한 추천</Text>
                {savedRecommendations.map((rec, index) => (
                  <Card key={index} style={styles.savedCard}>
                    <Text style={styles.savedAI}>• {rec.ai}</Text>
                    <Text style={styles.savedCategory}>({rec.category})</Text>
                  </Card>
                ))}
                <Button title="전체 보기 →" variant="outline" fullWidth />
              </View>
            )}
          </>
        ) : (
          <>
            {/* Results Section */}
            <View style={styles.resultsHeader}>
              <TouchableOpacity onPress={() => setShowResults(false)}>
                <Text style={styles.backButton}>← 돌아가기</Text>
              </TouchableOpacity>
              <Text style={styles.taskQuery}>🎯 작업: "{taskInput}"</Text>
            </View>

            {/* Recommendation Results */}
            {recommendationResults.map((result) => (
              <Card key={result.rank} style={styles.resultCard}>
                <View style={styles.resultHeader}>
                  <Text style={styles.rankIcon}>{getRankIcon(result.rank)}</Text>
                  <Text style={styles.rankText}>{result.rank}위: {result.name}</Text>
                </View>

                <View style={styles.scoreContainer}>
                  <Text style={styles.scoreLabel}>성능 점수:</Text>
                  <Text style={styles.scoreValue}>{result.score}/100</Text>
                  <Text style={styles.stars}>{'⭐'.repeat(Math.floor(result.score / 20))}</Text>
                </View>

                {/* Benchmarks */}
                <View style={styles.benchmarkSection}>
                  <Text style={styles.benchmarkTitle}>📊 벤치마크:</Text>
                  <Text style={styles.benchmarkItem}>• 텍스트 인식 정확도: {result.accuracy}</Text>
                  <Text style={styles.benchmarkItem}>• 다국어 지원: {result.languages}</Text>
                  <Text style={styles.benchmarkItem}>• 처리 속도: {result.speed}</Text>
                  <Text style={styles.benchmarkItem}>• 비용: {result.cost}</Text>
                </View>

                {/* Pros */}
                <View style={styles.prosConsSection}>
                  <Text style={styles.prosTitle}>💚 장점:</Text>
                  {result.pros.map((pro, index) => (
                    <Text key={index} style={styles.prosItem}>✓ {pro}</Text>
                  ))}
                </View>

                {/* Cons */}
                <View style={styles.prosConsSection}>
                  <Text style={styles.consTitle}>⚠️ 단점:</Text>
                  {result.cons.map((con, index) => (
                    <Text key={index} style={styles.consItem}>• {con}</Text>
                  ))}
                </View>

                {/* Overall Rating */}
                <View style={styles.ratingSection}>
                  <Text style={styles.ratingText}>
                    📈 종합 평가: {result.rating}/10
                  </Text>
                </View>

                {/* Action Buttons */}
                <View style={styles.actionButtons}>
                  <Button title="시작하기" variant="primary" style={styles.actionButton} />
                  <Button title="자세한 튜토리얼" variant="outline" style={styles.actionButton} />
                </View>
              </Card>
            ))}

            {/* Comparison Table */}
            <Card style={styles.comparisonCard}>
              <Text style={styles.comparisonTitle}>📊 전체 비교 분석</Text>
              <View style={styles.comparisonTable}>
                <View style={styles.tableRow}>
                  <Text style={styles.tableHeader}>지표</Text>
                  <Text style={styles.tableHeader}>1위(Google)</Text>
                  <Text style={styles.tableHeader}>2위(Claude)</Text>
                </View>
                <View style={styles.tableRow}>
                  <Text style={styles.tableCell}>정확도</Text>
                  <Text style={styles.tableCell}>98.5%</Text>
                  <Text style={styles.tableCell}>97.2%</Text>
                </View>
                <View style={styles.tableRow}>
                  <Text style={styles.tableCell}>속도</Text>
                  <Text style={styles.tableCell}>0.2초</Text>
                  <Text style={styles.tableCell}>0.5초</Text>
                </View>
                <View style={styles.tableRow}>
                  <Text style={styles.tableCell}>가격</Text>
                  <Text style={styles.tableCell}>$1.5</Text>
                  <Text style={styles.tableCell}>$0.003</Text>
                </View>
              </View>

              <View style={styles.priorityNote}>
                <Text style={styles.priorityText}>
                  💡 당신의 우선순위 반영됨:{'\n'}
                  정확도 {'>'} 속도 {'>'} 비용{'\n'}
                  → 따라서 Google이 1위입니다
                </Text>
              </View>
            </Card>

            {/* Transparency */}
            <Card style={styles.transparencyCard}>
              <Text style={styles.transparencyTitle}>📌 투명성 보장</Text>
              <Text style={styles.transparencyItem}>├─ 모든 벤치마크는 공개 출처</Text>
              <Text style={styles.transparencyItem}>├─ Artificial Analysis (2025.01)</Text>
              <Text style={styles.transparencyItem}>├─ GitHub 커뮤니티 리뷰</Text>
              <Text style={styles.transparencyItem}>├─ 학술 논문 (IEEE, NeurIPS)</Text>
              <Text style={styles.transparencyItem}>└─ 마지막 업데이트: 1일 전</Text>
            </Card>
          </>
        )}

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
    paddingTop: spacing.md,
  },
  section: {
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    ...textStyles.h3,
    color: colors.text,
    marginBottom: spacing.md,
  },
  label: {
    ...textStyles.body1,
    color: colors.text,
    marginBottom: spacing.sm,
    marginTop: spacing.md,
  },
  taskButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  taskButton: {
    width: '23%',
    aspectRatio: 1,
    backgroundColor: colors.card,
    borderRadius: borderRadius.md,
    padding: spacing.sm,
    marginBottom: spacing.sm,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  taskIcon: {
    fontSize: 28,
    marginBottom: spacing.xs,
  },
  taskLabel: {
    ...textStyles.caption,
    color: colors.text,
    textAlign: 'center',
  },
  input: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.md,
    ...textStyles.body1,
    color: colors.text,
    borderWidth: 1,
    borderColor: colors.border,
  },
  historyCard: {
    marginBottom: spacing.sm,
  },
  historyItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  historyTask: {
    ...textStyles.body2,
    color: colors.textSecondary,
    flex: 1,
  },
  historyAI: {
    ...textStyles.body2,
    color: colors.primary,
    fontWeight: '600',
  },
  savedCard: {
    marginBottom: spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  savedAI: {
    ...textStyles.body1,
    color: colors.text,
    fontWeight: '600',
  },
  savedCategory: {
    ...textStyles.body2,
    color: colors.textSecondary,
  },
  resultsHeader: {
    marginBottom: spacing.lg,
  },
  backButton: {
    ...textStyles.body1,
    color: colors.primary,
    fontWeight: '600',
    marginBottom: spacing.sm,
  },
  taskQuery: {
    ...textStyles.h4,
    color: colors.text,
  },
  resultCard: {
    marginBottom: spacing.lg,
  },
  resultHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  rankIcon: {
    fontSize: 24,
    marginRight: spacing.sm,
  },
  rankText: {
    ...textStyles.h4,
    color: colors.text,
  },
  scoreContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: colors.backgroundGray,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
  },
  scoreLabel: {
    ...textStyles.body1,
    color: colors.textSecondary,
    marginRight: spacing.sm,
  },
  scoreValue: {
    ...textStyles.h4,
    color: colors.primary,
    marginRight: spacing.sm,
  },
  stars: {
    fontSize: 16,
  },
  benchmarkSection: {
    marginBottom: spacing.md,
  },
  benchmarkTitle: {
    ...textStyles.body1,
    fontWeight: '600',
    color: colors.text,
    marginBottom: spacing.sm,
  },
  benchmarkItem: {
    ...textStyles.body2,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
    paddingLeft: spacing.sm,
  },
  prosConsSection: {
    marginBottom: spacing.md,
  },
  prosTitle: {
    ...textStyles.body1,
    fontWeight: '600',
    color: colors.success,
    marginBottom: spacing.sm,
  },
  prosItem: {
    ...textStyles.body2,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
    paddingLeft: spacing.sm,
  },
  consTitle: {
    ...textStyles.body1,
    fontWeight: '600',
    color: colors.warning,
    marginBottom: spacing.sm,
  },
  consItem: {
    ...textStyles.body2,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
    paddingLeft: spacing.sm,
  },
  ratingSection: {
    backgroundColor: colors.primaryLight + '20',
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  ratingText: {
    ...textStyles.body1,
    color: colors.primary,
    fontWeight: '600',
    textAlign: 'center',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    flex: 1,
    marginHorizontal: spacing.xs,
  },
  comparisonCard: {
    marginBottom: spacing.lg,
  },
  comparisonTitle: {
    ...textStyles.h4,
    color: colors.text,
    marginBottom: spacing.md,
  },
  comparisonTable: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    overflow: 'hidden',
    marginBottom: spacing.md,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  tableHeader: {
    ...textStyles.body2,
    fontWeight: '600',
    color: colors.text,
    flex: 1,
    padding: spacing.sm,
    backgroundColor: colors.backgroundGray,
  },
  tableCell: {
    ...textStyles.body2,
    color: colors.textSecondary,
    flex: 1,
    padding: spacing.sm,
  },
  priorityNote: {
    backgroundColor: colors.primaryLight + '20',
    borderRadius: borderRadius.md,
    padding: spacing.md,
  },
  priorityText: {
    ...textStyles.body2,
    color: colors.primary,
    lineHeight: 20,
  },
  transparencyCard: {
    backgroundColor: colors.backgroundGray,
    marginBottom: spacing.lg,
  },
  transparencyTitle: {
    ...textStyles.h4,
    color: colors.text,
    marginBottom: spacing.sm,
  },
  transparencyItem: {
    ...textStyles.body2,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
});

export default AIRecommendScreen;
