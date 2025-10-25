import React, { useState } from 'react';
import { View, Text, StyleSheet, Dimensions, ScrollView, TouchableOpacity } from 'react-native';
import Svg, { Line, Circle, Path, G, Text as SvgText } from 'react-native-svg';
import { colors } from '../../theme/colors';
import { textStyles } from '../../theme/typography';
import { spacing } from '../../theme/spacing';

const CHART_WIDTH = Dimensions.get('window').width - spacing.xl * 2;
const CHART_HEIGHT = 250;
const PADDING = { top: 20, right: 20, bottom: 40, left: 40 };

const IssueIndexChart = ({ data = [], onNodePress }) => {
  const [selectedNode, setSelectedNode] = useState(null);

  if (!data || data.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>데이터가 없습니다</Text>
      </View>
    );
  }

  // 데이터 범위 계산
  const scores = data.map(d => d.score);
  const minScore = Math.min(...scores);
  const maxScore = Math.max(...scores);
  const scoreRange = maxScore - minScore || 1;

  // 차트 영역 계산
  const chartWidth = CHART_WIDTH - PADDING.left - PADDING.right;
  const chartHeight = CHART_HEIGHT - PADDING.top - PADDING.bottom;

  // 좌표 변환 함수
  const getX = (index) => {
    return PADDING.left + (chartWidth / (data.length - 1)) * index;
  };

  const getY = (score) => {
    // Y축은 위에서 아래로 증가하므로 반전
    const normalizedScore = (score - minScore) / scoreRange;
    return PADDING.top + chartHeight * (1 - normalizedScore);
  };

  // 경로 생성
  const createPath = () => {
    let path = `M ${getX(0)} ${getY(data[0].score)}`;
    for (let i = 1; i < data.length; i++) {
      path += ` L ${getX(i)} ${getY(data[i].score)}`;
    }
    return path;
  };

  // 기울기 계산 및 색상 결정
  const getSegmentColor = (index) => {
    if (index === 0) return colors.primary;

    const currentScore = data[index].score;
    const previousScore = data[index - 1].score;
    const slope = (currentScore - previousScore) / previousScore;

    if (slope > 0.15) return colors.riskVeryHigh; // 매우 가파른 상승
    if (slope > 0.05) return colors.riskHigh; // 가파른 상승
    if (slope > 0) return '#FFB84D'; // 완만한 상승
    if (slope > -0.05) return '#95A5A6'; // 평탄
    if (slope > -0.15) return '#3498DB'; // 완만한 하강
    return '#2C3E50'; // 가파른 하강
  };

  // Y축 레이블 생성
  const yAxisLabels = [maxScore, (maxScore + minScore) / 2, minScore].map(
    value => Math.round(value)
  );

  // 날짜 포맷 (MM/DD)
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return `${date.getMonth() + 1}/${date.getDate()}`;
  };

  // 노드 클릭 핸들러
  const handleNodePress = (item, index) => {
    setSelectedNode(index);
    if (onNodePress) {
      onNodePress(item);
    }
  };

  // 노드 색상 결정
  const getNodeColor = (item, index) => {
    if (selectedNode === index) return colors.primary;
    if (item.updateType === 'emergency') return colors.riskVeryHigh;
    if (Math.abs(item.comparisonPercentage) >= 15) return colors.riskHigh;
    return colors.primary;
  };

  // 노드 크기 결정
  const getNodeSize = (item, index) => {
    if (selectedNode === index) return 8;
    if (item.updateType === 'emergency') return 7;
    if (Math.abs(item.comparisonPercentage) >= 15) return 6;
    return 5;
  };

  return (
    <View style={styles.container}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={styles.chartContainer}>
          <Svg width={CHART_WIDTH} height={CHART_HEIGHT}>
            {/* Y축 그리드 라인 */}
            {yAxisLabels.map((label, i) => {
              const y = PADDING.top + (chartHeight / (yAxisLabels.length - 1)) * i;
              return (
                <G key={`grid-${i}`}>
                  <Line
                    x1={PADDING.left}
                    y1={y}
                    x2={CHART_WIDTH - PADDING.right}
                    y2={y}
                    stroke="#E0E0E0"
                    strokeWidth="1"
                    strokeDasharray="4,4"
                  />
                  <SvgText
                    x={PADDING.left - 10}
                    y={y + 5}
                    fill={colors.textSecondary}
                    fontSize="10"
                    textAnchor="end"
                  >
                    {label}
                  </SvgText>
                </G>
              );
            })}

            {/* 라인 그래프 경로 */}
            <Path
              d={createPath()}
              stroke={colors.primary}
              strokeWidth="2"
              fill="none"
            />

            {/* 세그먼트별 색상 라인 */}
            {data.map((item, index) => {
              if (index === 0) return null;
              const color = getSegmentColor(index);
              return (
                <Line
                  key={`segment-${index}`}
                  x1={getX(index - 1)}
                  y1={getY(data[index - 1].score)}
                  x2={getX(index)}
                  y2={getY(item.score)}
                  stroke={color}
                  strokeWidth="3"
                />
              );
            })}

            {/* 데이터 포인트 (노드) */}
            {data.map((item, index) => (
              <G key={`node-${index}`}>
                <Circle
                  cx={getX(index)}
                  cy={getY(item.score)}
                  r={getNodeSize(item, index)}
                  fill={getNodeColor(item, index)}
                  onPress={() => handleNodePress(item, index)}
                />
                {/* X축 날짜 레이블 */}
                {(index % Math.ceil(data.length / 6) === 0 || index === data.length - 1) && (
                  <SvgText
                    x={getX(index)}
                    y={CHART_HEIGHT - PADDING.bottom + 20}
                    fill={colors.textSecondary}
                    fontSize="10"
                    textAnchor="middle"
                  >
                    {formatDate(item.date)}
                  </SvgText>
                )}
              </G>
            ))}
          </Svg>

          {/* 노드 설명 (차트 하단) */}
          <View style={styles.legendContainer}>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: colors.primary }]} />
              <Text style={styles.legendText}>정상 갱신</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: colors.riskVeryHigh }]} />
              <Text style={styles.legendText}>긴급 갱신</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: colors.riskHigh }]} />
              <Text style={styles.legendText}>급변 구간</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* 선택된 노드 정보 */}
      {selectedNode !== null && (
        <View style={styles.selectedNodeInfo}>
          <Text style={styles.selectedNodeDate}>{data[selectedNode].date}</Text>
          <Text style={styles.selectedNodeScore}>
            지수: {data[selectedNode].score}점
          </Text>
          <Text style={styles.selectedNodeKeyword}>
            주요 이슈: {data[selectedNode].mainKeyword}
          </Text>
          <Text style={styles.selectedNodeChange}>
            변화율: {data[selectedNode].comparisonPercentage > 0 ? '+' : ''}
            {data[selectedNode].comparisonPercentage.toFixed(2)}%
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: spacing.md,
  },
  chartContainer: {
    paddingVertical: spacing.md,
  },
  emptyContainer: {
    height: CHART_HEIGHT,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.backgroundGray,
    borderRadius: 8,
  },
  emptyText: {
    ...textStyles.body1,
    color: colors.textSecondary,
  },
  legendContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: spacing.md,
    flexWrap: 'wrap',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: spacing.sm,
    marginVertical: spacing.xs,
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: spacing.xs,
  },
  legendText: {
    ...textStyles.body2,
    color: colors.textSecondary,
  },
  selectedNodeInfo: {
    backgroundColor: colors.backgroundGray,
    padding: spacing.md,
    borderRadius: 8,
    marginTop: spacing.md,
  },
  selectedNodeDate: {
    ...textStyles.h4,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  selectedNodeScore: {
    ...textStyles.body1,
    color: colors.text,
    fontWeight: '600',
  },
  selectedNodeKeyword: {
    ...textStyles.body2,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  selectedNodeChange: {
    ...textStyles.body2,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
});

export default IssueIndexChart;
