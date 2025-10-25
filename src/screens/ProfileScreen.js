import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import { colors } from '../theme/colors';
import { textStyles } from '../theme/typography';
import { spacing, borderRadius } from '../theme/spacing';

const ProfileScreen = () => {
  // Mock user data - 실제로는 API에서 가져옴
  const userData = {
    name: '최수안',
    job: '소프트웨어 개발자',
    ageGroup: '30대',
    aiExperience: '중급',
    memberSince: '2025년 1월',
    interests: ['AI 기술', '직업 영향', '활용 팁'],
  };

  const jobAnalysis = {
    currentRisk: 82,
    trend: '+5',
    affectedAreas: [
      { area: '코드 생성', impact: '매우 높음', percentage: 90 },
      { area: '버그 수정', impact: '높음', percentage: 75 },
      { area: '코드 리뷰', impact: '중간', percentage: 60 },
    ],
    recommendations: [
      'AI 활용 능력 강화',
      '시스템 설계 능력 향상',
      'AI 윤리 및 거버넌스 학습',
    ],
  };

  const savedAI = [
    { name: 'ChatGPT', category: '글쓰기', lastUsed: '2일 전' },
    { name: 'Claude 3', category: '코딩', lastUsed: '5일 전' },
    { name: 'Midjourney', category: '이미지 생성', lastUsed: '1주일 전' },
  ];

  const myPosts = [
    { title: 'Claude로 코드 리뷰 자동화하기', likes: 45, comments: 12, date: '3일 전' },
    { title: 'AI 코딩 도구 비교 후기', likes: 89, comments: 23, date: '1주일 전' },
  ];

  const menuItems = [
    { id: 'notifications', icon: '🔔', title: '알림 설정', subtitle: '관심 이슈 알림 관리' },
    { id: 'preferences', icon: '⚙️', title: '추천 설정', subtitle: '우선순위 및 필터 설정' },
    { id: 'help', icon: '❓', title: '도움말', subtitle: 'Ainus 사용 가이드' },
    { id: 'privacy', icon: '🔒', title: '개인정보 처리방침', subtitle: '데이터 보호 및 보안' },
    { id: 'about', icon: 'ℹ️', title: 'Ainus 정보', subtitle: '버전 1.0.0' },
  ];

  const handleEditProfile = () => {
    // Navigate to edit profile screen
  };

  const handleMenuItem = (itemId) => {
    // Handle menu item navigation
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Header */}
        <Card style={styles.profileCard}>
          <View style={styles.profileHeader}>
            <View style={styles.avatarContainer}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>👤</Text>
              </View>
            </View>
            <View style={styles.profileInfo}>
              <Text style={styles.userName}>{userData.name}</Text>
              <Text style={styles.userJob}>{userData.job}</Text>
              <Text style={styles.userMeta}>
                {userData.ageGroup} • {userData.aiExperience} • {userData.memberSince} 가입
              </Text>
            </View>
          </View>

          <View style={styles.interestsContainer}>
            <Text style={styles.interestsLabel}>관심 분야:</Text>
            <View style={styles.interestTags}>
              {userData.interests.map((interest, index) => (
                <View key={index} style={styles.interestTag}>
                  <Text style={styles.interestText}>{interest}</Text>
                </View>
              ))}
            </View>
          </View>

          <Button
            title="프로필 수정"
            variant="outline"
            fullWidth
            onPress={handleEditProfile}
          />
        </Card>

        {/* Job Risk Analysis */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>💼 직업별 상세 분석</Text>
          <Card style={styles.analysisCard}>
            <View style={styles.riskHeader}>
              <Text style={styles.riskLabel}>현재 AI 영향도</Text>
              <Text style={styles.riskScore}>{jobAnalysis.currentRisk}점</Text>
              <Text style={styles.riskTrend}>(전일대비 {jobAnalysis.trend})</Text>
            </View>

            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: `${jobAnalysis.currentRisk}%` }]} />
            </View>

            <View style={styles.affectedAreas}>
              <Text style={styles.affectedTitle}>영향받는 업무 영역:</Text>
              {jobAnalysis.affectedAreas.map((area, index) => (
                <View key={index} style={styles.areaItem}>
                  <View style={styles.areaHeader}>
                    <Text style={styles.areaName}>• {area.area}</Text>
                    <Text style={[
                      styles.areaImpact,
                      area.impact === '매우 높음' ? styles.impactVeryHigh :
                      area.impact === '높음' ? styles.impactHigh : styles.impactMedium
                    ]}>
                      {area.impact}
                    </Text>
                  </View>
                  <View style={styles.areaProgress}>
                    <View style={[styles.areaProgressFill, { width: `${area.percentage}%` }]} />
                  </View>
                </View>
              ))}
            </View>

            <View style={styles.recommendations}>
              <Text style={styles.recommendTitle}>💡 추천 학습 방향:</Text>
              {jobAnalysis.recommendations.map((rec, index) => (
                <Text key={index} style={styles.recommendItem}>
                  {index + 1}. {rec}
                </Text>
              ))}
            </View>
          </Card>
        </View>

        {/* Saved AI Tools */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>💾 저장한 AI 도구</Text>
            <TouchableOpacity>
              <Text style={styles.viewAllText}>전체 보기 →</Text>
            </TouchableOpacity>
          </View>
          {savedAI.map((ai, index) => (
            <Card key={index} style={styles.savedAICard}>
              <View style={styles.savedAIInfo}>
                <Text style={styles.savedAIName}>{ai.name}</Text>
                <Text style={styles.savedAICategory}>{ai.category}</Text>
              </View>
              <Text style={styles.savedAITime}>{ai.lastUsed}</Text>
            </Card>
          ))}
        </View>

        {/* My Posts */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>📝 내가 쓴 글</Text>
            <TouchableOpacity>
              <Text style={styles.viewAllText}>전체 보기 →</Text>
            </TouchableOpacity>
          </View>
          {myPosts.map((post, index) => (
            <Card key={index} style={styles.postCard}>
              <Text style={styles.postTitle}>{post.title}</Text>
              <View style={styles.postStats}>
                <Text style={styles.postStat}>👍 {post.likes}</Text>
                <Text style={styles.postStat}>💬 {post.comments}</Text>
                <Text style={styles.postDate}>{post.date}</Text>
              </View>
            </Card>
          ))}
        </View>

        {/* Menu Items */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>⚙️ 설정</Text>
          {menuItems.map((item) => (
            <Card
              key={item.id}
              onPress={() => handleMenuItem(item.id)}
              style={styles.menuCard}
            >
              <View style={styles.menuIcon}>
                <Text style={styles.menuIconText}>{item.icon}</Text>
              </View>
              <View style={styles.menuInfo}>
                <Text style={styles.menuTitle}>{item.title}</Text>
                <Text style={styles.menuSubtitle}>{item.subtitle}</Text>
              </View>
              <Text style={styles.menuArrow}>→</Text>
            </Card>
          ))}
        </View>

        {/* Logout Button */}
        <View style={styles.section}>
          <Button
            title="로그아웃"
            variant="outline"
            fullWidth
            onPress={() => {/* Handle logout */}}
          />
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
    paddingTop: spacing.md,
  },
  section: {
    marginBottom: spacing.lg,
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
  viewAllText: {
    ...textStyles.body2,
    color: colors.primary,
    fontWeight: '600',
  },
  profileCard: {
    marginBottom: spacing.lg,
  },
  profileHeader: {
    flexDirection: 'row',
    marginBottom: spacing.md,
  },
  avatarContainer: {
    marginRight: spacing.md,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: borderRadius.full,
    backgroundColor: colors.primaryLight + '30',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 40,
  },
  profileInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  userName: {
    ...textStyles.h3,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  userJob: {
    ...textStyles.body1,
    color: colors.primary,
    fontWeight: '600',
    marginBottom: spacing.xs,
  },
  userMeta: {
    ...textStyles.body2,
    color: colors.textSecondary,
  },
  interestsContainer: {
    marginBottom: spacing.md,
  },
  interestsLabel: {
    ...textStyles.body1,
    color: colors.text,
    marginBottom: spacing.sm,
  },
  interestTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  interestTag: {
    backgroundColor: colors.primaryLight + '20',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.full,
    marginRight: spacing.sm,
    marginBottom: spacing.sm,
  },
  interestText: {
    ...textStyles.body2,
    color: colors.primary,
    fontWeight: '600',
  },
  analysisCard: {
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
  },
  riskHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  riskLabel: {
    ...textStyles.body1,
    color: colors.textSecondary,
    marginRight: spacing.sm,
  },
  riskScore: {
    ...textStyles.h2,
    color: colors.danger,
    fontWeight: '700',
  },
  riskTrend: {
    ...textStyles.body2,
    color: colors.textSecondary,
    marginLeft: spacing.sm,
  },
  progressBar: {
    height: 12,
    backgroundColor: colors.backgroundGray,
    borderRadius: borderRadius.full,
    overflow: 'hidden',
    marginBottom: spacing.lg,
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.danger,
  },
  affectedAreas: {
    marginBottom: spacing.lg,
  },
  affectedTitle: {
    ...textStyles.body1,
    fontWeight: '600',
    color: colors.text,
    marginBottom: spacing.md,
  },
  areaItem: {
    marginBottom: spacing.md,
  },
  areaHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  areaName: {
    ...textStyles.body2,
    color: colors.text,
  },
  areaImpact: {
    ...textStyles.body2,
    fontWeight: '600',
  },
  impactVeryHigh: {
    color: colors.riskVeryHigh,
  },
  impactHigh: {
    color: colors.riskHigh,
  },
  impactMedium: {
    color: colors.riskMedium,
  },
  areaProgress: {
    height: 6,
    backgroundColor: colors.backgroundGray,
    borderRadius: borderRadius.full,
    overflow: 'hidden',
  },
  areaProgressFill: {
    height: '100%',
    backgroundColor: colors.primary,
  },
  recommendations: {
    backgroundColor: colors.primaryLight + '20',
    borderRadius: borderRadius.md,
    padding: spacing.md,
  },
  recommendTitle: {
    ...textStyles.body1,
    fontWeight: '600',
    color: colors.text,
    marginBottom: spacing.sm,
  },
  recommendItem: {
    ...textStyles.body2,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
    lineHeight: 20,
  },
  savedAICard: {
    marginBottom: spacing.sm,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  savedAIInfo: {
    flex: 1,
  },
  savedAIName: {
    ...textStyles.body1,
    fontWeight: '600',
    color: colors.text,
    marginBottom: spacing.xs,
  },
  savedAICategory: {
    ...textStyles.body2,
    color: colors.textSecondary,
  },
  savedAITime: {
    ...textStyles.caption,
    color: colors.textLight,
  },
  postCard: {
    marginBottom: spacing.sm,
  },
  postTitle: {
    ...textStyles.body1,
    color: colors.text,
    marginBottom: spacing.sm,
  },
  postStats: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  postStat: {
    ...textStyles.body2,
    color: colors.textSecondary,
    marginRight: spacing.md,
  },
  postDate: {
    ...textStyles.caption,
    color: colors.textLight,
    marginLeft: 'auto',
  },
  menuCard: {
    marginBottom: spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuIcon: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.md,
    backgroundColor: colors.backgroundGray,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  menuIconText: {
    fontSize: 20,
  },
  menuInfo: {
    flex: 1,
  },
  menuTitle: {
    ...textStyles.body1,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  menuSubtitle: {
    ...textStyles.caption,
    color: colors.textSecondary,
  },
  menuArrow: {
    ...textStyles.h4,
    color: colors.textLight,
  },
});

export default ProfileScreen;
