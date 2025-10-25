import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';

const LoginSelectScreen = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* 로고 영역 */}
        <View style={styles.logoSection}>
          <Text style={styles.logo}>🤖 Ainus</Text>
          <Text style={styles.tagline}>AI 시대 네비게이터</Text>
        </View>

        {/* 간편 로그인 섹션 */}
        <View style={styles.loginSection}>
          <Text style={styles.sectionTitle}>간편하게 시작하기</Text>

          {/* Google 로그인 버튼 */}
          <TouchableOpacity
            style={[styles.socialButton, styles.googleButton]}
            disabled
          >
            <Text style={styles.socialButtonText}>🔵 Google로 계속하기</Text>
            <Text style={styles.comingSoon}>(준비중)</Text>
          </TouchableOpacity>

          {/* Kakao 로그인 버튼 */}
          <TouchableOpacity
            style={[styles.socialButton, styles.kakaoButton]}
            disabled
          >
            <Text style={styles.socialButtonText}>🟡 카카오로 계속하기</Text>
            <Text style={styles.comingSoon}>(준비중)</Text>
          </TouchableOpacity>

          {/* 구분선 */}
          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>또는 이메일로 로그인</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* 이메일 로그인 버튼 */}
          <TouchableOpacity
            style={styles.emailButton}
            onPress={() => navigation.navigate('Login')}
          >
            <Text style={styles.emailButtonText}>📧 이메일로 계속하기</Text>
          </TouchableOpacity>
        </View>

        {/* 하단 회원가입 링크 */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>아직 계정이 없으신가요?</Text>
          <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
            <Text style={styles.signUpLink}>회원가입</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    padding: spacing.lg,
    justifyContent: 'space-between',
  },
  logoSection: {
    alignItems: 'center',
    marginTop: spacing.xl * 2,
  },
  logo: {
    fontSize: 48,
    fontWeight: '700',
    color: colors.primary,
    marginBottom: spacing.sm,
  },
  tagline: {
    fontSize: 16,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  loginSection: {
    flex: 1,
    justifyContent: 'center',
    marginTop: spacing.xl,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: spacing.lg,
    textAlign: 'center',
  },
  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.md,
    borderRadius: 12,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    opacity: 0.6,
  },
  googleButton: {
    backgroundColor: '#f8f9fa',
  },
  kakaoButton: {
    backgroundColor: '#FEE500',
  },
  socialButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  comingSoon: {
    fontSize: 12,
    color: colors.textSecondary,
    marginLeft: spacing.xs,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: spacing.lg,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.border,
  },
  dividerText: {
    marginHorizontal: spacing.md,
    fontSize: 14,
    color: colors.textSecondary,
  },
  emailButton: {
    backgroundColor: colors.primary,
    padding: spacing.md,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emailButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textWhite,
  },
  footer: {
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  footerText: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  signUpLink: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.primary,
  },
});

export default LoginSelectScreen;
