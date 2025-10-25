import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import InsightCard from '../components/common/InsightCard';
import { colors } from '../theme/colors';
import { textStyles } from '../theme/typography';
import { spacing, borderRadius } from '../theme/spacing';

const { width } = Dimensions.get('window');

const InsightFeedScreen = () => {
  const [selectedFilter, setSelectedFilter] = useState('all');

  const filters = [
    { id: 'all', label: '전체', icon: '📰' },
    { id: 'crime', label: '범죄⚠️', icon: '🚨' },
    { id: 'regulation', label: '규제', icon: '⚖️' },
    { id: 'company', label: '기업', icon: '🚀' },
    { id: 'technology', label: '기술', icon: '💡' },
    { id: 'jobs', label: '일자리', icon: '💼' },
  ];

  // Mock data - 실제로는 API에서 가져옴
  const insights = [
    {
      id: 1,
      category: 'crime',
      title: '🚨 [경고] AI 딥페이크 사기',
      description: 'CEO나 고관직자 음성을 AI로 복제하여 긴급 송금을 요청하는 사기 수법이 급증하고 있습니다. 최근 3개월간 3,000명 이상의 피해자가 발생했으며, 총 피해액은 약 50억원에 달합니다.',
      timestamp: '1시간 전',
      importance: 5,
      riskLevel: 'very_high',
      likes: 234,
      comments: 12,
      source: '경찰청 사이버범죄 분석',
    },
    {
      id: 2,
      category: 'company',
      title: '🚀 Gemini 3 공개 - 성능 30% 향상',
      description: 'Google이 Gemini 3를 공개했습니다. 정확도 92.3% → 94.8%, 처리 속도 0.8초 → 0.4초로 대폭 개선되었으며, 가격은 50% 인하되었습니다.',
      timestamp: '3시간 전',
      importance: 5,
      riskLevel: 'high',
      likes: 1234,
      comments: 89,
      source: 'Google 공식 발표',
    },
    {
      id: 3,
      category: 'regulation',
      title: '⚖️ 한국 생성AI 규제안 발표',
      description: '2025년 6월부터 시행될 생성AI 규제안이 발표되었습니다. AI 생성 콘텐츠는 의무적으로 표시해야 하며, 딥페이크 불법 사용 시 처벌이 강화됩니다.',
      timestamp: '1일 전',
      importance: 4,
      riskLevel: 'medium',
      likes: 567,
      comments: 45,
      source: '과학기술정보통신부',
    },
    {
      id: 4,
      category: 'jobs',
      title: '💼 AI로 일자리 32% 감소 예상',
      description: '맥킨지 보고서에 따르면 2030년까지 반복적인 업무를 중심으로 32%의 일자리가 AI로 대체될 것으로 예상됩니다. 특히 데이터 입력, 고객 상담, 번역 분야가 가장 큰 영향을 받을 것으로 보입니다.',
      timestamp: '2일 전',
      importance: 5,
      riskLevel: 'very_high',
      likes: 2345,
      comments: 234,
      source: 'McKinsey & Company',
    },
    {
      id: 5,
      category: 'technology',
      title: '💡 의료 AI 진단 정확도 98% 달성',
      description: '서울대병원이 개발한 AI 진단 시스템이 폐암 조기 진단에서 98%의 정확도를 달성했습니다. 기존 전문의 진단(92%)보다 높은 정확도를 보였습니다.',
      timestamp: '3일 전',
      importance: 4,
      riskLevel: 'low',
      likes: 890,
      comments: 67,
      source: '서울대학교병원',
    },
    {
      id: 6,
      category: 'company',
      title: '🚀 OpenAI Sora 2 발표',
      description: 'OpenAI가 비디오 생성 AI Sora 2를 발표했습니다. 고화질 1080p 비디오 생성, 물리 엔진 시뮬레이션 강화, 생성 시간 30초 → 5초로 단축.',
      timestamp: '4일 전',
      importance: 5,
      riskLevel: 'high',
      likes: 3456,
      comments: 178,
      source: 'OpenAI 공식 발표',
    },
  ];

  const filteredInsights =
    selectedFilter === 'all'
      ? insights
      : insights.filter((insight) => insight.category === selectedFilter);

  return (
    <SafeAreaView style={styles.container}>
      {/* Filter Bar */}
      <View style={styles.filterContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterScrollContent}
        >
          {filters.map((filter) => (
            <TouchableOpacity
              key={filter.id}
              style={[
                styles.filterButton,
                selectedFilter === filter.id && styles.filterButtonActive,
              ]}
              onPress={() => setSelectedFilter(filter.id)}
            >
              <Text
                style={[
                  styles.filterText,
                  selectedFilter === filter.id && styles.filterTextActive,
                ]}
              >
                {filter.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Swipe Instruction */}
      <View style={styles.instructionContainer}>
        <Text style={styles.instructionText}>👆 위로 스와이프해서 다음 카드 보기</Text>
      </View>

      {/* Insight Cards */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {filteredInsights.map((insight) => (
          <InsightCard
            key={insight.id}
            {...insight}
            onPress={() => {/* Navigate to detail */}}
            onLike={() => {/* Handle like */}}
            onComment={() => {/* Handle comment */}}
            onShare={() => {/* Handle share */}}
          />
        ))}

        {filteredInsights.length === 0 && (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>해당 카테고리의 인사이트가 없습니다.</Text>
          </View>
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
  filterContainer: {
    backgroundColor: colors.background,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    paddingVertical: spacing.sm,
  },
  filterScrollContent: {
    paddingHorizontal: spacing.md,
  },
  filterButton: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    marginRight: spacing.sm,
    borderRadius: borderRadius.full,
    backgroundColor: colors.backgroundGray,
  },
  filterButtonActive: {
    backgroundColor: colors.primary,
  },
  filterText: {
    ...textStyles.body2,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  filterTextActive: {
    color: colors.textWhite,
  },
  instructionContainer: {
    backgroundColor: colors.primaryLight + '20',
    paddingVertical: spacing.sm,
    alignItems: 'center',
  },
  instructionText: {
    ...textStyles.body2,
    color: colors.primary,
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
  },
  emptyContainer: {
    paddingVertical: spacing.xxxl,
    alignItems: 'center',
  },
  emptyText: {
    ...textStyles.body1,
    color: colors.textSecondary,
  },
});

export default InsightFeedScreen;
