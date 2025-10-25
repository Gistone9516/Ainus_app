import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Card from './Card';
import { colors } from '../../theme/colors';
import { textStyles } from '../../theme/typography';
import { spacing, borderRadius } from '../../theme/spacing';

const IssueIndexCard = ({
  title,
  score,
  trend,
  riskLevel,
  mainIssues = [],
  onPress,
  subtitle,
}) => {
  const getRiskColor = (level) => {
    switch (level) {
      case 'very_high': return colors.riskVeryHigh;
      case 'high': return colors.riskHigh;
      case 'medium': return colors.riskMedium;
      case 'low': return colors.riskLow;
      default: return colors.textSecondary;
    }
  };

  const getRiskLabel = (level) => {
    switch (level) {
      case 'very_high': return '매우 높음';
      case 'high': return '높음';
      case 'medium': return '중간';
      case 'low': return '낮음';
      default: return '알 수 없음';
    }
  };

  const riskColor = getRiskColor(riskLevel);
  const riskLabel = getRiskLabel(riskLevel);

  return (
    <Card onPress={onPress} style={styles.card}>
      <Text style={styles.title}>{title}</Text>
      {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}

      <View style={styles.scoreContainer}>
        <View style={styles.scoreBox}>
          <Text style={styles.scoreValue}>{score}점</Text>
          <View style={styles.trendContainer}>
            <Text style={[styles.trendText, trend >= 0 ? styles.trendUp : styles.trendDown]}>
              전일대비 {trend >= 0 ? '+' : ''}{trend}
            </Text>
          </View>
        </View>

        <View style={[styles.riskBadge, { backgroundColor: riskColor }]}>
          <Text style={styles.riskText}>🔴 {riskLabel}</Text>
        </View>
      </View>

      {/* Progress Bar */}
      <View style={styles.progressBarContainer}>
        <View style={[styles.progressBar, { width: `${score}%`, backgroundColor: riskColor }]} />
      </View>

      {/* Main Issues */}
      {mainIssues.length > 0 && (
        <View style={styles.issuesContainer}>
          <Text style={styles.issuesTitle}>주요 이슈:</Text>
          {mainIssues.map((issue, index) => (
            <Text key={index} style={styles.issueItem}>
              • {issue}
            </Text>
          ))}
        </View>
      )}

      {onPress && (
        <View style={styles.actionButton}>
          <Text style={styles.actionText}>자세히 보기 →</Text>
        </View>
      )}
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: spacing.lg,
  },
  title: {
    ...textStyles.h3,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  subtitle: {
    ...textStyles.body2,
    color: colors.textSecondary,
    marginBottom: spacing.md,
  },
  scoreContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: spacing.md,
  },
  scoreBox: {
    alignItems: 'flex-start',
  },
  scoreValue: {
    ...textStyles.h1,
    color: colors.text,
  },
  trendContainer: {
    marginTop: spacing.xs,
  },
  trendText: {
    ...textStyles.body2,
    fontWeight: '600',
  },
  trendUp: {
    color: colors.danger,
  },
  trendDown: {
    color: colors.success,
  },
  riskBadge: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.full,
  },
  riskText: {
    ...textStyles.body2,
    color: colors.textWhite,
    fontWeight: '600',
  },
  progressBarContainer: {
    height: 8,
    backgroundColor: colors.backgroundGray,
    borderRadius: borderRadius.full,
    overflow: 'hidden',
    marginVertical: spacing.md,
  },
  progressBar: {
    height: '100%',
    borderRadius: borderRadius.full,
  },
  issuesContainer: {
    marginTop: spacing.md,
  },
  issuesTitle: {
    ...textStyles.body1,
    fontWeight: '600',
    color: colors.text,
    marginBottom: spacing.sm,
  },
  issueItem: {
    ...textStyles.body2,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  actionButton: {
    marginTop: spacing.md,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  actionText: {
    ...textStyles.body1,
    color: colors.primary,
    fontWeight: '600',
    textAlign: 'center',
  },
});

export default IssueIndexCard;
