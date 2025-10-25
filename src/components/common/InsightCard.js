import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors } from '../../theme/colors';
import { textStyles } from '../../theme/typography';
import { spacing, borderRadius } from '../../theme/spacing';

const InsightCard = ({
  category,
  title,
  description,
  timestamp,
  importance,
  riskLevel,
  likes,
  comments,
  onPress,
  onLike,
  onComment,
  onShare,
}) => {
  const getCategoryIcon = (cat) => {
    switch (cat) {
      case 'crime': return '🚨';
      case 'regulation': return '⚖️';
      case 'company': return '🚀';
      case 'technology': return '💡';
      case 'jobs': return '💼';
      case 'security': return '🔒';
      default: return '📰';
    }
  };

  const getCategoryColor = (cat) => {
    switch (cat) {
      case 'crime': return colors.danger;
      case 'regulation': return colors.warning;
      case 'company': return colors.info;
      case 'technology': return colors.success;
      case 'jobs': return colors.secondary;
      case 'security': return colors.primaryDark;
      default: return colors.textSecondary;
    }
  };

  const categoryColor = getCategoryColor(category);

  return (
    <TouchableOpacity
      style={[styles.card, { borderLeftColor: categoryColor }]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.categoryBadge}>
          <Text style={styles.categoryIcon}>{getCategoryIcon(category)}</Text>
          <Text style={[styles.categoryText, { color: categoryColor }]}>
            {category === 'crime' ? '범죄/경고' :
             category === 'regulation' ? '규제/법안' :
             category === 'company' ? '기업 발표' :
             category === 'technology' ? '기술/활용' :
             category === 'jobs' ? '직무 영향' :
             category === 'security' ? '보안' : '기타'}
          </Text>
        </View>
        <Text style={styles.timestamp}>{timestamp}</Text>
      </View>

      {/* Title */}
      <Text style={styles.title}>{title}</Text>

      {/* Description */}
      {description && (
        <Text style={styles.description} numberOfLines={2}>
          {description}
        </Text>
      )}

      {/* Risk Level */}
      {riskLevel && (
        <View style={styles.riskContainer}>
          <Text style={styles.riskLabel}>당신의 위험도:</Text>
          <Text style={[styles.riskValue, { color: categoryColor }]}>
            {riskLevel === 'very_high' ? '🔴🔴🔴 매우 높음' :
             riskLevel === 'high' ? '🔴🔴 높음' :
             riskLevel === 'medium' ? '🟡 중간' :
             '🟢 낮음'}
          </Text>
        </View>
      )}

      {/* Importance Stars */}
      {importance && (
        <View style={styles.importanceContainer}>
          <Text style={styles.importanceLabel}>중요도:</Text>
          <Text style={styles.stars}>{'⭐'.repeat(importance)}</Text>
        </View>
      )}

      {/* Actions */}
      <View style={styles.actions}>
        <TouchableOpacity style={styles.actionButton} onPress={onLike}>
          <Text style={styles.actionIcon}>👍</Text>
          <Text style={styles.actionText}>도움됨 ({likes || 0})</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton} onPress={onComment}>
          <Text style={styles.actionIcon}>💬</Text>
          <Text style={styles.actionText}>댓글 ({comments || 0})</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton} onPress={onShare}>
          <Text style={styles.actionIcon}>🔗</Text>
          <Text style={styles.actionText}>공유</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderLeftWidth: 4,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  categoryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    flexShrink: 1,
  },
  categoryIcon: {
    fontSize: 16,
    marginRight: spacing.xs,
  },
  categoryText: {
    ...textStyles.body2,
    fontWeight: '600',
    flexShrink: 1,
  },
  timestamp: {
    ...textStyles.caption,
    color: colors.textLight,
  },
  title: {
    ...textStyles.h4,
    color: colors.text,
    marginBottom: spacing.sm,
    flexShrink: 1,
  },
  description: {
    ...textStyles.body2,
    color: colors.textSecondary,
    marginBottom: spacing.md,
    flexShrink: 1,
  },
  riskContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  riskLabel: {
    ...textStyles.body2,
    color: colors.textSecondary,
    marginRight: spacing.sm,
  },
  riskValue: {
    ...textStyles.body2,
    fontWeight: '600',
  },
  importanceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  importanceLabel: {
    ...textStyles.body2,
    color: colors.textSecondary,
    marginRight: spacing.sm,
  },
  stars: {
    fontSize: 14,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionIcon: {
    fontSize: 16,
    marginRight: spacing.xs,
  },
  actionText: {
    ...textStyles.body2,
    color: colors.textSecondary,
  },
});

export default InsightCard;
