import regularUpdates from '../data/issue_index_regular_updates.json';
import emergencyUpdates from '../data/issue_index_emergency_updates.json';

/**
 * AI 이슈 지수 데이터를 관리하는 서비스
 */
class IssueIndexService {
  /**
   * 모든 갱신 데이터를 날짜순으로 정렬하여 반환
   * @returns {Array} 정렬된 모든 갱신 데이터
   */
  getAllUpdates() {
    const allUpdates = [
      ...regularUpdates.regular_updates,
      ...emergencyUpdates.emergency_updates,
    ];

    // 날짜순으로 정렬
    return allUpdates.sort((a, b) =>
      new Date(a.index_date) - new Date(b.index_date)
    );
  }

  /**
   * 최신 이슈 지수 데이터를 반환
   * @returns {Object} 최신 갱신 데이터
   */
  getLatestUpdate() {
    const allUpdates = this.getAllUpdates();
    return allUpdates[allUpdates.length - 1];
  }

  /**
   * 지정된 기간 동안의 이슈 지수 데이터를 반환
   * @param {string} period - '3months', '6months', '1year', 'all' 중 하나
   * @returns {Array} 기간 내 갱신 데이터
   */
  getUpdatesByPeriod(period = '3months') {
    const allUpdates = this.getAllUpdates();
    const now = new Date();
    let startDate;

    switch (period) {
      case '3months':
        startDate = new Date(now.setMonth(now.getMonth() - 3));
        break;
      case '6months':
        startDate = new Date(now.setMonth(now.getMonth() - 6));
        break;
      case '1year':
        startDate = new Date(now.setFullYear(now.getFullYear() - 1));
        break;
      case 'all':
        return allUpdates;
      default:
        startDate = new Date(now.setMonth(now.getMonth() - 3));
    }

    return allUpdates.filter(update =>
      new Date(update.index_date) >= startDate
    );
  }

  /**
   * 특정 날짜의 상세 정보를 반환
   * @param {string} date - ISO 8601 형식의 날짜 (YYYY-MM-DD)
   * @returns {Object|null} 해당 날짜의 갱신 데이터 또는 null
   */
  getUpdateByDate(date) {
    const allUpdates = this.getAllUpdates();
    return allUpdates.find(update => update.index_date === date) || null;
  }

  /**
   * 정기 갱신 데이터만 반환
   * @returns {Array} 정기 갱신 데이터
   */
  getRegularUpdates() {
    return regularUpdates.regular_updates;
  }

  /**
   * 긴급 갱신 데이터만 반환
   * @returns {Array} 긴급 갱신 데이터
   */
  getEmergencyUpdates() {
    return emergencyUpdates.emergency_updates;
  }

  /**
   * 차트용 데이터 포맷으로 변환
   * @param {string} period - 기간
   * @returns {Array} 차트용 데이터 배열
   */
  getChartData(period = '3months') {
    const updates = this.getUpdatesByPeriod(period);

    return updates.map(update => ({
      date: update.index_date,
      score: update.current_score,
      trend: update.trend_direction,
      updateType: update.update_type,
      mainKeyword: update.main_keyword,
      comparisonPercentage: update.comparison_percentage,
    }));
  }

  /**
   * 급등/급락 구간 감지
   * @param {Array} updates - 갱신 데이터 배열
   * @param {number} threshold - 급변 감지 임계값 (기본값: 15%)
   * @returns {Array} 급변 구간 정보
   */
  detectSurgePeriods(updates = this.getAllUpdates(), threshold = 15) {
    const surgePeriods = [];

    updates.forEach((update, index) => {
      if (Math.abs(update.comparison_percentage) >= threshold) {
        surgePeriods.push({
          date: update.index_date,
          score: update.current_score,
          change: update.comparison_percentage,
          type: update.comparison_percentage > 0 ? 'surge' : 'drop',
          keyword: update.main_keyword,
          updateType: update.update_type,
        });
      }
    });

    return surgePeriods;
  }

  /**
   * 통계 정보 계산
   * @param {string} period - 기간
   * @returns {Object} 통계 정보
   */
  getStatistics(period = '3months') {
    const updates = this.getUpdatesByPeriod(period);

    if (updates.length === 0) {
      return null;
    }

    const scores = updates.map(u => u.current_score);
    const maxScore = Math.max(...scores);
    const minScore = Math.min(...scores);
    const avgScore = scores.reduce((a, b) => a + b, 0) / scores.length;

    const maxUpdate = updates.find(u => u.current_score === maxScore);
    const minUpdate = updates.find(u => u.current_score === minScore);

    return {
      period,
      totalUpdates: updates.length,
      regularUpdates: updates.filter(u => u.update_type === 'regular').length,
      emergencyUpdates: updates.filter(u => u.update_type === 'emergency').length,
      maxScore: {
        score: maxScore,
        date: maxUpdate.index_date,
        keyword: maxUpdate.main_keyword,
      },
      minScore: {
        score: minScore,
        date: minUpdate.index_date,
        keyword: minUpdate.main_keyword,
      },
      avgScore: Math.round(avgScore * 10) / 10,
      currentScore: updates[updates.length - 1].current_score,
      trend: this.calculateTrend(updates),
    };
  }

  /**
   * 전체 트렌드 방향 계산
   * @param {Array} updates - 갱신 데이터 배열
   * @returns {string} 'increasing', 'decreasing', 'stable'
   */
  calculateTrend(updates) {
    if (updates.length < 2) return 'stable';

    const recentUpdates = updates.slice(-5); // 최근 5개 데이터
    let increasingCount = 0;
    let decreasingCount = 0;

    for (let i = 1; i < recentUpdates.length; i++) {
      if (recentUpdates[i].current_score > recentUpdates[i - 1].current_score) {
        increasingCount++;
      } else if (recentUpdates[i].current_score < recentUpdates[i - 1].current_score) {
        decreasingCount++;
      }
    }

    if (increasingCount > decreasingCount) return 'increasing';
    if (decreasingCount > increasingCount) return 'decreasing';
    return 'stable';
  }

  /**
   * 키워드 빈도 분석
   * @param {string} period - 기간
   * @returns {Array} 키워드와 빈도
   */
  getKeywordFrequency(period = '3months') {
    const updates = this.getUpdatesByPeriod(period);
    const keywordMap = new Map();

    updates.forEach(update => {
      update.top_keywords.forEach(keyword => {
        const key = keyword.keyword;
        if (keywordMap.has(key)) {
          keywordMap.set(key, {
            count: keywordMap.get(key).count + 1,
            totalContribution: keywordMap.get(key).totalContribution + keyword.contribution,
            maxTrendLevel: this.getHigherTrendLevel(
              keywordMap.get(key).maxTrendLevel,
              keyword.trend_level
            ),
          });
        } else {
          keywordMap.set(key, {
            count: 1,
            totalContribution: keyword.contribution,
            maxTrendLevel: keyword.trend_level,
          });
        }
      });
    });

    return Array.from(keywordMap.entries())
      .map(([keyword, data]) => ({
        keyword,
        frequency: data.count,
        avgContribution: Math.round(data.totalContribution / data.count * 100) / 100,
        trendLevel: data.maxTrendLevel,
      }))
      .sort((a, b) => b.frequency - a.frequency);
  }

  /**
   * 두 트렌드 레벨 중 더 높은 것을 반환
   * @param {string} level1
   * @param {string} level2
   * @returns {string}
   */
  getHigherTrendLevel(level1, level2) {
    const levels = { very_high: 4, high: 3, medium: 2, low: 1 };
    return levels[level1] >= levels[level2] ? level1 : level2;
  }
}

// 싱글톤 인스턴스 생성
const issueIndexService = new IssueIndexService();

export default issueIndexService;
