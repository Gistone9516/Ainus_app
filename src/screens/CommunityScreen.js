import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import { colors } from '../theme/colors';
import { textStyles } from '../theme/typography';
import { spacing, borderRadius } from '../theme/spacing';

const CommunityScreen = () => {
  // Mock data - 실제로는 API에서 가져옴
  const liveBoards = [
    {
      id: 1,
      title: '🔥 [HOT] Sora 2 발표',
      participants: 234,
      posts: 45,
      createdAt: '2시간 전',
      isHot: true,
    },
    {
      id: 2,
      title: '🆕 [NEW] Gemini 3 업데이트',
      participants: 156,
      posts: 28,
      createdAt: '5시간 전',
      isNew: true,
    },
    {
      id: 3,
      title: '⚠️ [이슈] AI 딥페이크 대응법',
      participants: 89,
      posts: 34,
      createdAt: '1일 전',
      isIssue: true,
    },
  ];

  const categories = [
    { id: 'prompt', icon: '💡', title: '프롬프트 공유', count: '베스트 프롬프트 20개' },
    { id: 'tips', icon: '🔧', title: '꿀팁 & 활용법', count: '실전 AI 활용 팁 156개' },
    { id: 'qna', icon: '❓', title: '질문 & 답변', count: '답변 대기중 23개' },
    { id: 'best', icon: '🏆', title: '베스트 글 모음', count: '이번 주 인기글 TOP 10' },
  ];

  const handleEnterBoard = (boardId) => {
    // Navigate to board detail
  };

  const handleCategory = (categoryId) => {
    // Navigate to category
  };

  const handleWritePost = () => {
    // Navigate to write post screen
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Live Generated Boards */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📌 실시간 생성 게시판</Text>
          <Text style={styles.sectionDescription}>
            AI 이슈가 발생하면 자동으로 게시판이 생성됩니다
          </Text>

          {liveBoards.map((board) => (
            <Card key={board.id} style={styles.liveBoardCard}>
              <View style={styles.boardHeader}>
                <Text style={styles.boardTitle}>{board.title}</Text>
                {board.isHot && <View style={styles.hotBadge}><Text style={styles.hotText}>HOT</Text></View>}
                {board.isNew && <View style={styles.newBadge}><Text style={styles.newText}>NEW</Text></View>}
              </View>

              <View style={styles.boardStats}>
                <Text style={styles.statItem}>👥 {board.participants}명 참여</Text>
                <Text style={styles.statItem}>📝 {board.posts}개 글</Text>
              </View>

              <Text style={styles.boardTime}>{board.createdAt} 생성</Text>

              <Button
                title="입장하기 →"
                variant="primary"
                fullWidth
                onPress={() => handleEnterBoard(board.id)}
                style={styles.enterButton}
              />
            </Card>
          ))}
        </View>

        {/* Divider */}
        <View style={styles.divider} />

        {/* Category Boards */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📂 카테고리별 게시판</Text>

          {categories.map((category) => (
            <Card
              key={category.id}
              onPress={() => handleCategory(category.id)}
              style={styles.categoryCard}
            >
              <View style={styles.categoryHeader}>
                <View style={styles.categoryIcon}>
                  <Text style={styles.iconText}>{category.icon}</Text>
                </View>
                <View style={styles.categoryInfo}>
                  <Text style={styles.categoryTitle}>{category.title}</Text>
                  <Text style={styles.categoryCount}>{category.count}</Text>
                </View>
              </View>
              <Text style={styles.categoryArrow}>→</Text>
            </Card>
          ))}
        </View>

        {/* Divider */}
        <View style={styles.divider} />

        {/* Popular Posts Preview */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🔥 인기 게시글</Text>

          <Card style={styles.postCard}>
            <View style={styles.postHeader}>
              <Text style={styles.postCategory}>[프롬프트]</Text>
              <Text style={styles.postTime}>1시간 전</Text>
            </View>
            <Text style={styles.postTitle}>ChatGPT로 마케팅 카피 10배 빨리 작성하는 법</Text>
            <Text style={styles.postPreview} numberOfLines={2}>
              제가 실제로 사용하는 프롬프트 템플릿을 공유합니다. 이걸 쓰고나서 작업 시간이...
            </Text>
            <View style={styles.postFooter}>
              <Text style={styles.postAuthor}>@마케터_A</Text>
              <View style={styles.postStats}>
                <Text style={styles.postStat}>👍 234</Text>
                <Text style={styles.postStat}>💬 45</Text>
              </View>
            </View>
          </Card>

          <Card style={styles.postCard}>
            <View style={styles.postHeader}>
              <Text style={styles.postCategory}>[꿀팁]</Text>
              <Text style={styles.postTime}>3시간 전</Text>
            </View>
            <Text style={styles.postTitle}>무료로 쓸 수 있는 AI 도구 총정리</Text>
            <Text style={styles.postPreview} numberOfLines={2}>
              유료 버전 못지않은 무료 AI 도구들을 정리해봤습니다. 1. ChatGPT 무료 버전...
            </Text>
            <View style={styles.postFooter}>
              <Text style={styles.postAuthor}>@학생_B</Text>
              <View style={styles.postStats}>
                <Text style={styles.postStat}>👍 567</Text>
                <Text style={styles.postStat}>💬 89</Text>
              </View>
            </View>
          </Card>

          <Card style={styles.postCard}>
            <View style={styles.postHeader}>
              <Text style={styles.postCategory}>[질문]</Text>
              <Text style={styles.postTime}>5시간 전</Text>
            </View>
            <Text style={styles.postTitle}>Claude와 ChatGPT 중 뭐가 더 좋나요?</Text>
            <Text style={styles.postPreview} numberOfLines={2}>
              글쓰기 용도로 쓰려고 하는데 둘 중 어떤 게 더 나을까요? 경험 있으신 분들...
            </Text>
            <View style={styles.postFooter}>
              <Text style={styles.postAuthor}>@초보자_C</Text>
              <View style={styles.postStats}>
                <Text style={styles.postStat}>👍 45</Text>
                <Text style={styles.postStat}>💬 23</Text>
              </View>
            </View>
          </Card>
        </View>

        {/* Bottom Padding */}
        <View style={{ height: spacing.xxxl }} />
      </ScrollView>

      {/* Floating Write Button */}
      <TouchableOpacity style={styles.floatingButton} onPress={handleWritePost}>
        <Text style={styles.floatingButtonIcon}>✍️</Text>
        <Text style={styles.floatingButtonText}>글 작성</Text>
      </TouchableOpacity>
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
    marginBottom: spacing.md,
  },
  sectionTitle: {
    ...textStyles.h3,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  sectionDescription: {
    ...textStyles.body2,
    color: colors.textSecondary,
    marginBottom: spacing.md,
  },
  divider: {
    height: 1,
    backgroundColor: colors.divider,
    marginVertical: spacing.lg,
  },
  liveBoardCard: {
    marginBottom: spacing.md,
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
  },
  boardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  boardTitle: {
    ...textStyles.h4,
    color: colors.text,
    flex: 1,
  },
  hotBadge: {
    backgroundColor: colors.danger,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
    marginLeft: spacing.sm,
  },
  hotText: {
    ...textStyles.caption,
    color: colors.textWhite,
    fontWeight: '600',
  },
  newBadge: {
    backgroundColor: colors.success,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
    marginLeft: spacing.sm,
  },
  newText: {
    ...textStyles.caption,
    color: colors.textWhite,
    fontWeight: '600',
  },
  boardStats: {
    flexDirection: 'row',
    marginBottom: spacing.sm,
  },
  statItem: {
    ...textStyles.body2,
    color: colors.textSecondary,
    marginRight: spacing.md,
  },
  boardTime: {
    ...textStyles.caption,
    color: colors.textLight,
    marginBottom: spacing.md,
  },
  enterButton: {
    marginTop: spacing.sm,
  },
  categoryCard: {
    marginBottom: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  categoryIcon: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.md,
    backgroundColor: colors.backgroundGray,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  iconText: {
    fontSize: 24,
  },
  categoryInfo: {
    flex: 1,
  },
  categoryTitle: {
    ...textStyles.h4,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  categoryCount: {
    ...textStyles.body2,
    color: colors.textSecondary,
  },
  categoryArrow: {
    ...textStyles.h4,
    color: colors.primary,
  },
  postCard: {
    marginBottom: spacing.md,
  },
  postHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  postCategory: {
    ...textStyles.body2,
    color: colors.primary,
    fontWeight: '600',
  },
  postTime: {
    ...textStyles.caption,
    color: colors.textLight,
  },
  postTitle: {
    ...textStyles.h4,
    color: colors.text,
    marginBottom: spacing.sm,
  },
  postPreview: {
    ...textStyles.body2,
    color: colors.textSecondary,
    marginBottom: spacing.md,
    lineHeight: 20,
  },
  postFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  postAuthor: {
    ...textStyles.body2,
    color: colors.textSecondary,
  },
  postStats: {
    flexDirection: 'row',
  },
  postStat: {
    ...textStyles.body2,
    color: colors.textSecondary,
    marginLeft: spacing.md,
  },
  floatingButton: {
    position: 'absolute',
    bottom: spacing.xl,
    right: spacing.md,
    backgroundColor: colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.full,
    shadowColor: colors.shadowDark,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  floatingButtonIcon: {
    fontSize: 20,
    marginRight: spacing.sm,
  },
  floatingButtonText: {
    ...textStyles.button,
    color: colors.textWhite,
  },
});

export default CommunityScreen;
