import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useAuth } from '../../contexts/AuthContext';
import { isValidEmail, isValidNickname, calculatePasswordStrength } from '../../utils/validation';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';

const SignUpScreen = ({ navigation }) => {
  const { register } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [nickname, setNickname] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [agreedToPrivacy, setAgreedToPrivacy] = useState(false);
  const [agreedToMarketing, setAgreedToMarketing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const passwordStrength = calculatePasswordStrength(password);
  const isPasswordMatch = password && confirmPassword && password === confirmPassword;
  const isEmailValid = email && isValidEmail(email);
  const isNicknameValid = isValidNickname(nickname);

  const isFormValid =
    isEmailValid &&
    passwordStrength.score === 5 &&
    isPasswordMatch &&
    isNicknameValid &&
    agreedToTerms &&
    agreedToPrivacy;

  const handleSignUp = async () => {
    if (!isFormValid) {
      Alert.alert('오류', '모든 필수 항목을 올바르게 입력해주세요.');
      return;
    }

    setIsLoading(true);
    const result = await register(email, password, nickname);
    setIsLoading(false);

    if (result.success) {
      Alert.alert('가입 완료', '환영합니다! Ainus와 함께 시작해보세요.', [
        { text: '확인' },
      ]);
    } else {
      Alert.alert('가입 실패', result.error.message);
    }
  };

  const renderPasswordStrengthIndicator = () => {
    const { score, label, checks } = passwordStrength;

    return (
      <View style={styles.strengthContainer}>
        <Text style={styles.strengthLabel}>비밀번호 강도:</Text>
        <View style={styles.strengthBar}>
          {[1, 2, 3, 4, 5].map((i) => (
            <View
              key={i}
              style={[
                styles.strengthDot,
                i <= score && styles.strengthDotActive,
                i <= score && score <= 2 && styles.strengthDotWeak,
                i <= score && score === 3 && styles.strengthDotMedium,
                i <= score && score >= 4 && styles.strengthDotStrong,
              ]}
            />
          ))}
        </View>
        <Text style={styles.strengthText}>{label}</Text>
      </View>
    );
  };

  const renderPasswordChecks = () => {
    const { checks } = passwordStrength;

    return (
      <View style={styles.checksContainer}>
        <Text style={[styles.checkItem, checks.length && styles.checkItemValid]}>
          {checks.length ? '✅' : '❌'} 8자 이상
        </Text>
        <Text style={[styles.checkItem, checks.uppercase && styles.checkItemValid]}>
          {checks.uppercase ? '✅' : '❌'} 대문자 포함
        </Text>
        <Text style={[styles.checkItem, checks.lowercase && styles.checkItemValid]}>
          {checks.lowercase ? '✅' : '❌'} 소문자 포함
        </Text>
        <Text style={[styles.checkItem, checks.number && styles.checkItemValid]}>
          {checks.number ? '✅' : '❌'} 숫자 포함
        </Text>
        <Text style={[styles.checkItem, checks.special && styles.checkItemValid]}>
          {checks.special ? '✅' : '❌'} 특수문자 포함
        </Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          {/* 헤더 */}
          <View style={styles.header}>
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={styles.backButton}
            >
              <Text style={styles.backButtonText}>←</Text>
            </TouchableOpacity>
            <Text style={styles.headerTitle}>회원가입</Text>
            <View style={styles.headerRight} />
          </View>

          {/* 환영 메시지 */}
          <View style={styles.welcomeSection}>
            <Text style={styles.welcomeTitle}>환영합니다! 👋</Text>
            <Text style={styles.welcomeSubtitle}>
              Ainus와 함께 AI 시대를 준비하세요
            </Text>
          </View>

          {/* 회원가입 폼 */}
          <View style={styles.formSection}>
            {/* 이메일 입력 */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>이메일 *</Text>
              <TextInput
                style={styles.input}
                placeholder="example@domain.com"
                placeholderTextColor={colors.textSecondary}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />
              {email && (
                <Text
                  style={[
                    styles.validationText,
                    isEmailValid ? styles.validationValid : styles.validationInvalid,
                  ]}
                >
                  {isEmailValid
                    ? '✅ 사용 가능한 이메일입니다'
                    : '❌ 올바른 이메일 형식이 아닙니다'}
                </Text>
              )}
            </View>

            {/* 비밀번호 입력 */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>비밀번호 *</Text>
              <View style={styles.passwordContainer}>
                <TextInput
                  style={styles.passwordInput}
                  placeholder="••••••••••"
                  placeholderTextColor={colors.textSecondary}
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                />
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                  style={styles.eyeButton}
                >
                  <Text style={styles.eyeIcon}>{showPassword ? '👁️' : '👁️‍🗨️'}</Text>
                </TouchableOpacity>
              </View>
              {password && renderPasswordStrengthIndicator()}
              {password && renderPasswordChecks()}
            </View>

            {/* 비밀번호 확인 */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>비밀번호 확인 *</Text>
              <View style={styles.passwordContainer}>
                <TextInput
                  style={styles.passwordInput}
                  placeholder="••••••••••"
                  placeholderTextColor={colors.textSecondary}
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry={!showConfirmPassword}
                  autoCapitalize="none"
                />
                <TouchableOpacity
                  onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                  style={styles.eyeButton}
                >
                  <Text style={styles.eyeIcon}>
                    {showConfirmPassword ? '👁️' : '👁️‍🗨️'}
                  </Text>
                </TouchableOpacity>
              </View>
              {confirmPassword && (
                <Text
                  style={[
                    styles.validationText,
                    isPasswordMatch ? styles.validationValid : styles.validationInvalid,
                  ]}
                >
                  {isPasswordMatch
                    ? '✅ 비밀번호가 일치합니다'
                    : '❌ 비밀번호가 일치하지 않습니다'}
                </Text>
              )}
            </View>

            {/* 닉네임 입력 */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>닉네임 *</Text>
              <TextInput
                style={styles.input}
                placeholder="최수안"
                placeholderTextColor={colors.textSecondary}
                value={nickname}
                onChangeText={setNickname}
                autoCapitalize="words"
              />
              <Text style={styles.hint}>2-50자 이내</Text>
            </View>

            {/* 약관 동의 */}
            <View style={styles.agreementSection}>
              <TouchableOpacity
                style={styles.checkboxContainer}
                onPress={() => setAgreedToTerms(!agreedToTerms)}
              >
                <View style={[styles.checkbox, agreedToTerms && styles.checkboxChecked]}>
                  {agreedToTerms && <Text style={styles.checkmark}>✓</Text>}
                </View>
                <Text style={styles.checkboxLabel}>서비스 이용약관 동의 (필수)</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.checkboxContainer}
                onPress={() => setAgreedToPrivacy(!agreedToPrivacy)}
              >
                <View
                  style={[styles.checkbox, agreedToPrivacy && styles.checkboxChecked]}
                >
                  {agreedToPrivacy && <Text style={styles.checkmark}>✓</Text>}
                </View>
                <Text style={styles.checkboxLabel}>
                  개인정보 처리방침 동의 (필수)
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.checkboxContainer}
                onPress={() => setAgreedToMarketing(!agreedToMarketing)}
              >
                <View
                  style={[styles.checkbox, agreedToMarketing && styles.checkboxChecked]}
                >
                  {agreedToMarketing && <Text style={styles.checkmark}>✓</Text>}
                </View>
                <Text style={styles.checkboxLabel}>마케팅 정보 수신 동의 (선택)</Text>
              </TouchableOpacity>
            </View>

            {/* 회원가입 버튼 */}
            <TouchableOpacity
              style={[
                styles.signUpButton,
                !isFormValid && styles.signUpButtonDisabled,
              ]}
              onPress={handleSignUp}
              disabled={!isFormValid || isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color={colors.textWhite} />
              ) : (
                <Text style={styles.signUpButtonText}>회원가입 완료하기</Text>
              )}
            </TouchableOpacity>
          </View>

          {/* 하단 로그인 링크 */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>이미 계정이 있으신가요?</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text style={styles.loginLink}>로그인</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: spacing.lg,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.lg,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButtonText: {
    fontSize: 28,
    color: colors.textPrimary,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  headerRight: {
    width: 40,
  },
  welcomeSection: {
    marginBottom: spacing.lg,
  },
  welcomeTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  welcomeSubtitle: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  formSection: {
    flex: 1,
  },
  inputGroup: {
    marginBottom: spacing.lg,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  input: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    padding: spacing.md,
    fontSize: 16,
    color: colors.textPrimary,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
  },
  passwordInput: {
    flex: 1,
    padding: spacing.md,
    fontSize: 16,
    color: colors.textPrimary,
  },
  eyeButton: {
    padding: spacing.md,
  },
  eyeIcon: {
    fontSize: 20,
  },
  validationText: {
    fontSize: 12,
    marginTop: spacing.xs,
  },
  validationValid: {
    color: colors.success,
  },
  validationInvalid: {
    color: colors.error,
  },
  hint: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  strengthContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.sm,
  },
  strengthLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginRight: spacing.xs,
  },
  strengthBar: {
    flexDirection: 'row',
    gap: 4,
    marginRight: spacing.xs,
  },
  strengthDot: {
    width: 20,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.border,
  },
  strengthDotActive: {
    backgroundColor: colors.primary,
  },
  strengthDotWeak: {
    backgroundColor: colors.error,
  },
  strengthDotMedium: {
    backgroundColor: '#FFA500',
  },
  strengthDotStrong: {
    backgroundColor: colors.success,
  },
  strengthText: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  checksContainer: {
    marginTop: spacing.sm,
  },
  checkItem: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: spacing.xs / 2,
  },
  checkItemValid: {
    color: colors.success,
  },
  agreementSection: {
    marginBottom: spacing.lg,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderColor: colors.border,
    borderRadius: 6,
    marginRight: spacing.sm,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  checkmark: {
    color: colors.textWhite,
    fontSize: 16,
    fontWeight: '700',
  },
  checkboxLabel: {
    fontSize: 14,
    color: colors.textPrimary,
    flex: 1,
  },
  signUpButton: {
    backgroundColor: colors.primary,
    padding: spacing.md,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
  },
  signUpButtonDisabled: {
    opacity: 0.4,
  },
  signUpButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textWhite,
  },
  footer: {
    alignItems: 'center',
    marginTop: spacing.lg,
    marginBottom: spacing.lg,
  },
  footerText: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  loginLink: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.primary,
  },
});

export default SignUpScreen;
