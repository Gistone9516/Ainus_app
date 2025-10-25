import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [accessToken, setAccessToken] = useState(null);

  // 앱 시작 시 자동 로그인 확인
  useEffect(() => {
    checkAutoLogin();
  }, []);

  const checkAutoLogin = async () => {
    try {
      const savedUser = await AsyncStorage.getItem('user');
      const savedToken = await AsyncStorage.getItem('accessToken');

      if (savedUser && savedToken) {
        setUser(JSON.parse(savedUser));
        setAccessToken(savedToken);
      }
    } catch (error) {
      console.error('Auto login check failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // 로그인
  const login = async (email, password) => {
    try {
      // 테스트용 하드코딩 - 실제로는 API 호출
      if (email === 'admin' && password === 'admin') {
        const mockUser = {
          user_id: 'test-user-001',
          email: 'admin',
          nickname: '관리자',
          auth_provider: 'email',
        };

        const mockToken = 'mock-jwt-token-' + Date.now();

        setUser(mockUser);
        setAccessToken(mockToken);

        // AsyncStorage에 저장 (자동 로그인용)
        await AsyncStorage.setItem('user', JSON.stringify(mockUser));
        await AsyncStorage.setItem('accessToken', mockToken);

        return { success: true, user: mockUser };
      } else {
        return {
          success: false,
          error: {
            code: 'INVALID_CREDENTIALS',
            message: '이메일 또는 비밀번호가 올바르지 않습니다.',
          },
        };
      }
    } catch (error) {
      return {
        success: false,
        error: {
          code: 'NETWORK_ERROR',
          message: '네트워크 오류가 발생했습니다.',
        },
      };
    }
  };

  // 회원가입
  const register = async (email, password, nickname) => {
    try {
      // 테스트용 하드코딩 - 실제로는 API 호출
      const mockUser = {
        user_id: 'user-' + Date.now(),
        email,
        nickname,
        auth_provider: 'email',
      };

      const mockToken = 'mock-jwt-token-' + Date.now();

      setUser(mockUser);
      setAccessToken(mockToken);

      await AsyncStorage.setItem('user', JSON.stringify(mockUser));
      await AsyncStorage.setItem('accessToken', mockToken);

      return { success: true, user: mockUser };
    } catch (error) {
      return {
        success: false,
        error: {
          code: 'SERVER_ERROR',
          message: '회원가입에 실패했습니다.',
        },
      };
    }
  };

  // 로그아웃
  const logout = async () => {
    try {
      setUser(null);
      setAccessToken(null);
      await AsyncStorage.removeItem('user');
      await AsyncStorage.removeItem('accessToken');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const value = {
    user,
    accessToken,
    isLoading,
    login,
    register,
    logout,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
