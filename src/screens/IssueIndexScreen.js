import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import IssueIndexChart from '../components/common/IssueIndexChart';
import IssueIndexDetailModal from '../components/common/IssueIndexDetailModal';
import issueIndexService from '../services/issueIndexService';
import { colors } from '../theme/colors';
import { textStyles } from '../theme/typography';
import { spacing, borderRadius } from '../theme/spacing';

const IssueIndexScreen = () => {
  const [period, setPeriod] = useState('3months');
  const [chartData, setChartData] = useState([]);
  const [latestUpdate, setLatestUpdate] = useState(null);
  const [statistics, setStatistics] = useState(null);
  const [selectedDetail, setSelectedDetail] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // 데이터 로드
  const loadData = async () => {
    try {
      const latest = issueIndexService.getLatestUpdate();
      const chart = issueIndexService.getChartData(period);
      const stats = issueIndexService.getStatistics(period);

      setLatestUpdate(latest);
      setChartData(chart);
      setStatistics(stats);
    } catch (error) {
      console.error('데이터 로드 오류:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [period]);

  // 새로고침
  const handleRefresh = () => {
    setRefreshing(true);
    loadData();
  };

  // 기간 변경
  const handlePeriodChange = (newPeriod) => {
    setPeriod(newPeriod);
  };

  // 노드 클릭 핸들러
  const handleNodePress = (item) => {
    const detail = issueIndexService.getUpdateByDate(item.date);
    setSelectedDetail(detail);
    setModalVisible(true);
  };

  // 상세 보기 닫기
  const handleCloseModal = () => {
    setModalVisible(false);
    setSelectedDetail(null);
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>데이터를 불러오는 중...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />}
      >
        {/* 헤더 */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>AI 이슈 지수</Text>
          <TouchableOpacity onPress={handleRefresh}>
            <Text style={styles.refreshButton}>🔄 새로고침</Text>
          </TouchableOpacity>
        </View>

        {/* 갱신 정보 */}
        <View style={styles.updateInfo}>
          <Text style={styles.updateInfoText}>⏰ 매주 일요일 자동 갱신</Text>
          {latestUpdate && (
            <Text style={styles.lastUpdateText}>
              마지막 갱신: {latestUpdate.index_date}
            </Text>
          )}
        </View>

        {/* 현재 지수 현황 */}
        {latestUpdate && (
          <View style={styles.currentIndexCard}>
            <Text style={styles.cardTitle}>지수 점수 현황</Text>
            <View style={styles.currentIndexContent}>
              <View style={styles.currentScoreContainer}>
                <Text style={styles.currentScoreLabel}>현재 지수:</Text>
                <Text style={styles.currentScoreValue}>{latestUpdate.current_score}</Text>
              </View>
              <View style={styles.comparisonContainer}>
                <Text
                  style={[
                    styles.comparisonText,
                    latestUpdate.comparison_percentage > 0
                      ? styles.comparisonPositive
                      : styles.comparisonNegative,
                  ]}
                >
                  {latestUpdate.comparison_percentage > 0 ? '↑' : '↓'}{' '}
                  {latestUpdate.comparison_percentage > 0 ? '+' : ''}
                  {latestUpdate.comparison_percentage.toFixed(2)}% vs 지난주
                </Text>
              </View>
            </View>
            <View style={styles.trendStatus}>
              <Text style={styles.trendStatusLabel}>상태:</Text>
              <Text
                style={[
                  styles.trendStatusValue,
                  latestUpdate.trend_direction === 'up'
                    ? styles.trendUp
                    : styles.trendDown,
                ]}
              >
                {latestUpdate.trend_direction === 'up' ? '상승 추세 🔴' : '하락 추세 🔵'}
              </Text>
            </View>
          </View>
        )}

        {/* 기간 선택 */}
        <View style={styles.periodSelector}>
          {[
            { label: '최근 3개월', value: '3months' },
            { label: '최근 6개월', value: '6months' },
            { label: '1년', value: '1year' },
            { label: '전체', value: 'all' },
          ].map((p) => (
            <TouchableOpacity
              key={p.value}
              style={[
                styles.periodButton,
                period === p.value && styles.periodButtonActive,
              ]}
              onPress={() => handlePeriodChange(p.value)}
            >
              <Text
                style={[
                  styles.periodButtonText,
                  period === p.value && styles.periodButtonTextActive,
                ]}
              >
                {p.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* 차트 */}
        <View style={styles.chartCard}>
          <Text style={styles.cardTitle}>이슈 추이 그래프</Text>
          <IssueIndexChart data={chartData} onNodePress={handleNodePress} />
        </View>

        {/* 통계 정보 */}
        {statistics && (
          <View style={styles.statsCard}>
            <Text style={styles.cardTitle}>통계 정보</Text>
            <View style={styles.statsGrid}>
              <View style={styles.statItem}>
                <Text style={styles.statLabel}>총 갱신 횟수</Text>
                <Text style={styles.statValue}>{statistics.totalUpdates}회</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statLabel}>정기 갱신</Text>
                <Text style={styles.statValue}>{statistics.regularUpdates}회</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statLabel}>긴급 갱신</Text>
                <Text style={styles.statValue}>{statistics.emergencyUpdates}회</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statLabel}>평균 지수</Text>
                <Text style={styles.statValue}>{statistics.avgScore}점</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statLabel}>최고 지수</Text>
                <Text style={styles.statValue}>{statistics.maxScore.score}점</Text>
                <Text style={styles.statSubtext}>
                  {statistics.maxScore.keyword}
                </Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statLabel}>최저 지수</Text>
                <Text style={styles.statValue}>{statistics.minScore.score}점</Text>
                <Text style={styles.statSubtext}>
                  {statistics.minScore.keyword}
                </Text>
              </View>
            </View>
          </View>
        )}

        {/* 최신 이슈 키워드 */}
        {latestUpdate && latestUpdate.top_keywords && (
          <View style={styles.keywordsCard}>
            <Text style={styles.cardTitle}>최신 이슈 키워드</Text>
            <View style={styles.keywordsList}>
              {latestUpdate.top_keywords.slice(0, 5).map((keyword, index) => (
                <View key={index} style={styles.keywordChip}>
                  <Text style={styles.keywordText}>
                    {index === 0 && '🔥 '}
                    {keyword.keyword}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* 하단 여백 */}
        <View style={styles.bottomSpacing} />
      </ScrollView>

      {/* 상세 정보 모달 */}
      <IssueIndexDetailModal
        visible={modalVisible}
        onClose={handleCloseModal}
        data={selectedDetail}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollView: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    ...textStyles.body1,
    color: colors.textSecondary,
    marginTop: spacing.md,
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
    ...textStyles.h2,
    color: colors.text,
    fontWeight: '700',
  },
  refreshButton: {
    ...textStyles.body1,
    color: colors.primary,
  },
  updateInfo: {
    padding: spacing.lg,
    backgroundColor: colors.backgroundGray,
  },
  updateInfoText: {
    ...textStyles.body2,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  lastUpdateText: {
    ...textStyles.body2,
    color: colors.text,
  },
  currentIndexCard: {
    backgroundColor: colors.backgroundGray,
    margin: spacing.lg,
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
  },
  cardTitle: {
    ...textStyles.h4,
    color: colors.text,
    fontWeight: '600',
    marginBottom: spacing.md,
  },
  currentIndexContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  currentScoreContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  currentScoreLabel: {
    ...textStyles.body1,
    color: colors.textSecondary,
    marginRight: spacing.sm,
  },
  currentScoreValue: {
    ...textStyles.h1,
    color: colors.text,
    fontWeight: '700',
  },
  comparisonContainer: {
    alignItems: 'flex-end',
  },
  comparisonText: {
    ...textStyles.h4,
    fontWeight: '600',
  },
  comparisonPositive: {
    color: colors.riskVeryHigh,
  },
  comparisonNegative: {
    color: colors.success,
  },
  trendStatus: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  trendStatusLabel: {
    ...textStyles.body1,
    color: colors.textSecondary,
    marginRight: spacing.sm,
  },
  trendStatusValue: {
    ...textStyles.body1,
    fontWeight: '600',
  },
  trendUp: {
    color: colors.riskVeryHigh,
  },
  trendDown: {
    color: colors.success,
  },
  periodSelector: {
    flexDirection: 'row',
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.md,
  },
  periodButton: {
    flex: 1,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.xs,
    marginHorizontal: spacing.xs,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.background,
    alignItems: 'center',
  },
  periodButtonActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  periodButtonText: {
    ...textStyles.body2,
    color: colors.textSecondary,
  },
  periodButtonTextActive: {
    color: colors.textWhite,
    fontWeight: '600',
  },
  chartCard: {
    backgroundColor: colors.background,
    margin: spacing.lg,
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  statsCard: {
    backgroundColor: colors.background,
    margin: spacing.lg,
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -spacing.xs,
  },
  statItem: {
    width: '50%',
    padding: spacing.xs,
    marginBottom: spacing.md,
  },
  statLabel: {
    ...textStyles.body2,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  statValue: {
    ...textStyles.h3,
    color: colors.text,
    fontWeight: '700',
  },
  statSubtext: {
    ...textStyles.caption,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  keywordsCard: {
    backgroundColor: colors.background,
    margin: spacing.lg,
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  keywordsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  keywordChip: {
    backgroundColor: colors.backgroundGray,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.full,
    marginRight: spacing.sm,
    marginBottom: spacing.sm,
  },
  keywordText: {
    ...textStyles.body2,
    color: colors.text,
  },
  bottomSpacing: {
    height: spacing.xl,
  },
});

export default IssueIndexScreen;
