// 이메일 형식 검증
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// 비밀번호 강도 검증
export const calculatePasswordStrength = (password) => {
  const checks = {
    length: password.length >= 8,
    lowercase: /[a-z]/.test(password),
    uppercase: /[A-Z]/.test(password),
    number: /\d/.test(password),
    special: /[!@#$%^&*()_+\-=\[\]{}|;:,.<>?]/.test(password),
  };

  const score = Object.values(checks).filter(Boolean).length;

  const labels = ['매우 약함', '약함', '보통', '강함', '매우 강함'];
  let label = labels[0];

  if (score === 5) label = labels[4];
  else if (score === 4) label = labels[3];
  else if (score === 3) label = labels[2];
  else if (score === 2) label = labels[1];

  return { score, label, checks };
};

// 닉네임 유효성 검증
export const isValidNickname = (nickname) => {
  return nickname && nickname.length >= 2 && nickname.length <= 50;
};

// 비밀번호 유효성 검증
export const isValidPassword = (password) => {
  const strength = calculatePasswordStrength(password);
  return strength.score >= 5; // 모든 조건 만족해야 함
};
