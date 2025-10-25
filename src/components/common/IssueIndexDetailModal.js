import React from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { colors } from '../../theme/colors';
import { textStyles } from '../../theme/typography';
import { spacing, borderRadius } from '../../theme/spacing';

const IssueIndexDetailModal = ({ visible, onClose, data }) => {
  if (!data) return null;

  // 트렌드 레벨 한글 변환
  const getTrendLevelText = (level) => {
    const levels = {
      very_high: '매우 높음',
      high: '높음',
      medium: '중간',
      low: '낮음',
    };
    return levels[level] || level;
  };

  // 트렌드 레벨 색상
  const getTrendLevelColor = (level) => {
    const colors_map = {
      very_high: colors.riskVeryHigh,
      high: colors.riskHigh,
      medium: '#FFB84D',
      low: colors.textSecondary,
    };
    return colors_map[level] || colors.textSecondary;
  };

  // 날짜 포맷
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const days = ['일', '월', '화', '수', '목', '금', '토'];
    return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(
      date.getDate()
    ).padStart(2, '0')} (${days[date.getDay()]}요일)`;
  };

  // 시간 포맷
  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(
      2,
      '0'
    )}`;
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          {/* 헤더 */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>AI 이슈 지수 상세 정보</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
            {/* 기본 정보 */}
            <View style={styles.section}>
              <Text style={styles.dateText}>{formatDate(data.index_date)}</Text>
              <View style={styles.updateTypeContainer}>
                <View
                  style={[
                    styles.updateTypeBadge,
                    data.update_type === 'emergency'
                      ? styles.emergencyBadge
                      : styles.regularBadge,
                  ]}
                >
                  <Text style={styles.updateTypeText}>
                    {data.update_type === 'emergency' ? '긴급 갱신' : '정기 갱신'}
                  </Text>
                </View>
              </View>

              <View style={styles.scoreRow}>
                <Text style={styles.scoreLabel}>이슈 지수:</Text>
                <Text style={styles.scoreValue}>{data.current_score}점</Text>
              </View>

              <View style={styles.comparisonRow}>
                <Text style={styles.comparisonLabel}>이전 주 대비:</Text>
                <Text
                  style={[
                    styles.comparisonValue,
                    data.comparison_percentage > 0 ? styles.positive : styles.negative,
                  ]}
                >
                  {data.comparison_percentage > 0 ? '↑' : '↓'}{' '}
                  {data.comparison_percentage > 0 ? '+' : ''}
                  {data.comparison_percentage.toFixed(2)}%
                </Text>
              </View>

              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>갱신 시간:</Text>
                <Text style={styles.infoValue}>{formatTime(data.update_time)}</Text>
              </View>

              {data.update_type === 'emergency' && (
                <View style={styles.emergencyInfo}>
                  <Text style={styles.emergencyTitle}>긴급 상황 정보</Text>
                  <Text style={styles.emergencyNotes}>{data.emergency_notes}</Text>
                  <Text style={styles.emergencyReason}>
                    발생 원인: {data.trigger_reason}
                  </Text>
                  <Text style={styles.emergencyStatus}>
                    상태: {data.status}
                  </Text>
                </View>
              )}
            </View>

            {/* 상위 뉴스 기사 */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>상위 뉴스 기사</Text>
              {data.top_articles.map((article, index) => (
                <View key={index} style={styles.articleCard}>
                  <View style={styles.articleHeader}>
                    <Text style={styles.articleRank}>{article.rank}️⃣</Text>
                    <View style={styles.articleTitleContainer}>
                      <Text style={styles.articleTitle}>{article.title}</Text>
                      <Text style={styles.articleSource}>
                        {article.source} · {formatTime(article.published_at)}
                      </Text>
                    </View>
                  </View>
                  <Text style={styles.articleSummary}>{article.summary}</Text>
                  <View style={styles.contributionBar}>
                    <View style={styles.contributionBarLabel}>
                      <Text style={styles.contributionText}>기여도</Text>
                      <Text style={styles.contributionValue}>
                        {Math.round(article.contribution * 100)}%
                      </Text>
                    </View>
                    <View style={styles.contributionBarContainer}>
                      <View
                        style={[
                          styles.contributionBarFill,
                          { width: `${article.contribution * 100}%` },
                        ]}
                      />
                    </View>
                  </View>
                </View>
              ))}
            </View>

            {/* 주요 키워드 트렌드 */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>주요 키워드 트렌드</Text>
              {data.top_keywords.map((keyword, index) => (
                <View key={index} style={styles.keywordRow}>
                  <View style={styles.keywordLeft}>
                    <Text style={styles.keywordText}>{keyword.keyword}</Text>
                    <View
                      style={[
                        styles.trendLevelBadge,
                        { backgroundColor: getTrendLevelColor(keyword.trend_level) },
                      ]}
                    >
                      <Text style={styles.trendLevelText}>
                        {getTrendLevelText(keyword.trend_level)}
                      </Text>
                    </View>
                  </View>
                  <Text style={styles.keywordContribution}>
                    기여도 {Math.round(keyword.contribution * 100)}%
                  </Text>
                </View>
              ))}
            </View>

            {/* 가중치 분석 */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>가중치 분석 (투명성)</Text>

              {/* 뉴스 기사 가중치 */}
              <View style={styles.weightCard}>
                <View style={styles.weightHeader}>
                  <Text style={styles.weightTitle}>뉴스 기사 가중치</Text>
                  <Text style={styles.weightScore}>
                    {data.weight_breakdown.news_weight.score}점 (40%)
                  </Text>
                </View>
                <View style={styles.weightDetails}>
                  <Text style={styles.weightDetail}>
                    • 기사 수: {data.weight_breakdown.news_weight.details.article_count}개 (
                    {data.weight_breakdown.news_weight.details.article_count_score}점)
                  </Text>
                  <Text style={styles.weightDetail}>
                    • 발행 빈도: ×
                    {data.weight_breakdown.news_weight.details.publishing_frequency_multiplier}배
                  </Text>
                  <Text style={styles.weightDetail}>
                    • 키워드 다양성:{' '}
                    {data.weight_breakdown.news_weight.details.keyword_diversity}개 (×
                    {data.weight_breakdown.news_weight.details.keyword_diversity_multiplier}배)
                  </Text>
                  <Text style={styles.weightDetail}>
                    • 신선도: ×
                    {data.weight_breakdown.news_weight.details.freshness_multiplier}배
                  </Text>
                </View>
              </View>

              {/* Google Trends 가중치 */}
              <View style={styles.weightCard}>
                <View style={styles.weightHeader}>
                  <Text style={styles.weightTitle}>Google Trends 가중치</Text>
                  <Text style={styles.weightScore}>
                    {data.weight_breakdown.trend_weight.score}점 (40%)
                  </Text>
                </View>
                <View style={styles.weightDetails}>
                  <Text style={styles.weightDetail}>
                    • 상승도: {data.weight_breakdown.trend_weight.details.trend_growth}% (
                    {data.weight_breakdown.trend_weight.details.trend_growth_score}점)
                  </Text>
                  <Text style={styles.weightDetail}>
                    • 키워드 수렴:{' '}
                    {data.weight_breakdown.trend_weight.details.keyword_convergence}개 (×
                    {data.weight_breakdown.trend_weight.details.keyword_convergence_multiplier}배)
                  </Text>
                  <Text style={styles.weightDetail}>
                    • 뉴스 연관도: ×
                    {data.weight_breakdown.trend_weight.details.news_correlation_multiplier}배
                  </Text>
                </View>
              </View>

              {/* 변동성 가중치 */}
              <View style={styles.weightCard}>
                <View style={styles.weightHeader}>
                  <Text style={styles.weightTitle}>변동성 가중치</Text>
                  <Text style={styles.weightScore}>
                    {data.weight_breakdown.volatility_weight.score}점 (20%)
                  </Text>
                </View>
                <View style={styles.weightDetails}>
                  <Text style={styles.weightDetail}>
                    • 변화율: {data.weight_breakdown.volatility_weight.details.change_rate}% (
                    {data.weight_breakdown.volatility_weight.details.change_rate_score}점)
                  </Text>
                  <Text style={styles.weightDetail}>
                    • 지속성:{' '}
                    {data.weight_breakdown.volatility_weight.details.continuity_weeks}주 (×
                    {data.weight_breakdown.volatility_weight.details.continuity_multiplier}배)
                  </Text>
                </View>
              </View>

              {/* 최종 계산식 */}
              <View style={styles.finalCalculation}>
                <Text style={styles.finalCalculationTitle}>최종 이슈 지수</Text>
                <Text style={styles.finalCalculationFormula}>
                  {data.total_calculation.formula}
                </Text>
                <Text style={styles.finalCalculationResult}>= {data.current_score}점</Text>
              </View>
            </View>

            {/* 데이터 출처 */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>데이터 출처</Text>
              <Text style={styles.sourceText}>
                • 뉴스 분석: {data.source_references.news_analysis}
              </Text>
              <Text style={styles.sourceText}>
                • 트렌드 분석: {data.source_references.trend_analysis}
              </Text>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: colors.background,
    borderTopLeftRadius: borderRadius.xl,
    borderTopRightRadius: borderRadius.xl,
    maxHeight: Dimensions.get('window').height * 0.9,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerTitle: {
    ...textStyles.h3,
    color: colors.text,
  },
  closeButton: {
    padding: spacing.xs,
  },
  closeButtonText: {
    ...textStyles.h3,
    color: colors.textSecondary,
  },
  content: {
    padding: spacing.lg,
  },
  section: {
    marginBottom: spacing.xl,
  },
  dateText: {
    ...textStyles.h4,
    color: colors.text,
    marginBottom: spacing.sm,
  },
  updateTypeContainer: {
    marginBottom: spacing.md,
  },
  updateTypeBadge: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
    alignSelf: 'flex-start',
  },
  regularBadge: {
    backgroundColor: colors.primary,
  },
  emergencyBadge: {
    backgroundColor: colors.riskVeryHigh,
  },
  updateTypeText: {
    ...textStyles.body2,
    color: colors.textWhite,
    fontWeight: '600',
  },
  scoreRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: spacing.sm,
  },
  scoreLabel: {
    ...textStyles.body1,
    color: colors.textSecondary,
    marginRight: spacing.sm,
  },
  scoreValue: {
    ...textStyles.h2,
    color: colors.text,
    fontWeight: '700',
  },
  comparisonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  comparisonLabel: {
    ...textStyles.body1,
    color: colors.textSecondary,
    marginRight: spacing.sm,
  },
  comparisonValue: {
    ...textStyles.h4,
    fontWeight: '600',
  },
  positive: {
    color: colors.riskVeryHigh,
  },
  negative: {
    color: colors.success,
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: spacing.xs,
  },
  infoLabel: {
    ...textStyles.body2,
    color: colors.textSecondary,
    marginRight: spacing.sm,
  },
  infoValue: {
    ...textStyles.body2,
    color: colors.text,
  },
  emergencyInfo: {
    backgroundColor: colors.backgroundGray,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    marginTop: spacing.md,
  },
  emergencyTitle: {
    ...textStyles.body1,
    color: colors.text,
    fontWeight: '600',
    marginBottom: spacing.sm,
  },
  emergencyNotes: {
    ...textStyles.body2,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  emergencyReason: {
    ...textStyles.body2,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  emergencyStatus: {
    ...textStyles.body2,
    color: colors.textSecondary,
  },
  sectionTitle: {
    ...textStyles.h4,
    color: colors.text,
    fontWeight: '600',
    marginBottom: spacing.md,
  },
  articleCard: {
    backgroundColor: colors.backgroundGray,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    marginBottom: spacing.md,
  },
  articleHeader: {
    flexDirection: 'row',
    marginBottom: spacing.sm,
  },
  articleRank: {
    ...textStyles.h4,
    marginRight: spacing.sm,
  },
  articleTitleContainer: {
    flex: 1,
  },
  articleTitle: {
    ...textStyles.body1,
    color: colors.text,
    fontWeight: '600',
    marginBottom: spacing.xs,
  },
  articleSource: {
    ...textStyles.body2,
    color: colors.textSecondary,
  },
  articleSummary: {
    ...textStyles.body2,
    color: colors.text,
    marginBottom: spacing.md,
  },
  contributionBar: {
    marginTop: spacing.sm,
  },
  contributionBarLabel: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.xs,
  },
  contributionText: {
    ...textStyles.body2,
    color: colors.textSecondary,
  },
  contributionValue: {
    ...textStyles.body2,
    color: colors.text,
    fontWeight: '600',
  },
  contributionBarContainer: {
    height: 6,
    backgroundColor: colors.border,
    borderRadius: borderRadius.full,
    overflow: 'hidden',
  },
  contributionBarFill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: borderRadius.full,
  },
  keywordRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  keywordLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  keywordText: {
    ...textStyles.body1,
    color: colors.text,
    marginRight: spacing.sm,
  },
  trendLevelBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: borderRadius.full,
  },
  trendLevelText: {
    ...textStyles.caption,
    color: colors.textWhite,
    fontSize: 10,
  },
  keywordContribution: {
    ...textStyles.body2,
    color: colors.textSecondary,
  },
  weightCard: {
    backgroundColor: colors.backgroundGray,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    marginBottom: spacing.md,
  },
  weightHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  weightTitle: {
    ...textStyles.body1,
    color: colors.text,
    fontWeight: '600',
  },
  weightScore: {
    ...textStyles.body1,
    color: colors.primary,
    fontWeight: '700',
  },
  weightDetails: {
    paddingLeft: spacing.sm,
  },
  weightDetail: {
    ...textStyles.body2,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  finalCalculation: {
    backgroundColor: colors.primary,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    marginTop: spacing.md,
  },
  finalCalculationTitle: {
    ...textStyles.h4,
    color: colors.textWhite,
    fontWeight: '600',
    marginBottom: spacing.xs,
  },
  finalCalculationFormula: {
    ...textStyles.body2,
    color: colors.textWhite,
    fontFamily: 'monospace',
    marginBottom: spacing.xs,
  },
  finalCalculationResult: {
    ...textStyles.h3,
    color: colors.textWhite,
    fontWeight: '700',
  },
  sourceText: {
    ...textStyles.body2,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
});

export default IssueIndexDetailModal;
