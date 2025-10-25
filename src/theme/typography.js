// Ainus 앱 타이포그래피 시스템
export const typography = {
  // Font Sizes
  fontSize: {
    xs: 12,
    sm: 14,
    base: 16,
    lg: 18,
    xl: 20,
    xxl: 24,
    xxxl: 32,
    huge: 48,
  },

  // Font Weights
  fontWeight: {
    regular: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
    extrabold: '800',
  },

  // Line Heights (픽셀 값으로 설정)
  lineHeight: {
    xs: 16,      // 12px 폰트용
    sm: 20,      // 14px 폰트용
    base: 24,    // 16px 폰트용
    lg: 26,      // 18px 폰트용
    xl: 28,      // 20px 폰트용
    xxl: 32,     // 24px 폰트용
    xxxl: 40,    // 32px 폰트용
    huge: 56,    // 48px 폰트용
  },

  // Letter Spacing
  letterSpacing: {
    tight: -0.5,
    normal: 0,
    wide: 0.5,
    wider: 1,
  },
};

// Text Styles
export const textStyles = {
  // Headings
  h1: {
    fontSize: typography.fontSize.xxxl,
    fontWeight: typography.fontWeight.bold,
    lineHeight: typography.lineHeight.xxxl,
    includeFontPadding: false,
    textAlignVertical: 'center',
  },
  h2: {
    fontSize: typography.fontSize.xxl,
    fontWeight: typography.fontWeight.bold,
    lineHeight: typography.lineHeight.xxl,
    includeFontPadding: false,
    textAlignVertical: 'center',
  },
  h3: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.semibold,
    lineHeight: typography.lineHeight.xl,
    includeFontPadding: false,
    textAlignVertical: 'center',
  },
  h4: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.semibold,
    lineHeight: typography.lineHeight.lg,
    includeFontPadding: false,
    textAlignVertical: 'center',
  },

  // Body
  body1: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.regular,
    lineHeight: typography.lineHeight.base,
    includeFontPadding: false,
    textAlignVertical: 'center',
  },
  body2: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.regular,
    lineHeight: typography.lineHeight.sm,
    includeFontPadding: false,
    textAlignVertical: 'center',
  },

  // Caption
  caption: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.regular,
    lineHeight: typography.lineHeight.xs,
    includeFontPadding: false,
    textAlignVertical: 'center',
  },

  // Button
  button: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semibold,
    lineHeight: typography.lineHeight.base,
    includeFontPadding: false,
    textAlignVertical: 'center',
  },
};

export default { typography, textStyles };
