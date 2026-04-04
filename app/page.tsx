"use client";

import React, { useState, useEffect } from 'react';
import LoginForm from '../LoginForm';
import SignupForm from '../SignupForm';
import ManagementContent from './ManagementContent';
import { auth, googleProvider, githubProvider, appleProvider, microsoftProvider } from './firebase';
import { signInWithEmailAndPassword, signInWithPopup, createUserWithEmailAndPassword, updateProfile, signOut, onAuthStateChanged, setPersistence, browserLocalPersistence, browserSessionPersistence, User, AuthError } from 'firebase/auth';

// --- ANA SAYFA (Main Page) ---

export default function RobotikProje() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [error, setError] = useState('');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user: User | null) => {
      setIsLoggedIn(!!user);
    });
    return () => unsubscribe();
  }, []);

  const handleLogin = async (email: string, password: string, rememberMe: boolean) => {
    try {
      await setPersistence(auth, rememberMe ? browserLocalPersistence : browserSessionPersistence);
      await signInWithEmailAndPassword(auth, email, password);
      setError('');
    } catch (err) {
      setError('Hatalı e-posta veya şifre!');
    }
  };

  const handleSocialLogin = async (provider: any, providerName: string) => {
    try {
      await setPersistence(auth, browserLocalPersistence); // Sosyal girişlerde de beni hatırla
      await signInWithPopup(auth, provider);
      setError('');
    } catch (err: any) {
      console.error(`Error during ${providerName} login:`, err);
      let errorMessage = `${providerName} ile giriş yapılamadı.`;
      if (err.code) {
        switch (err.code) {
          case 'auth/popup-closed-by-user':
            errorMessage = 'Giriş penceresi kapatıldı.';
            break;
          case 'auth/cancelled-popup-request':
            errorMessage = 'Giriş isteği iptal edildi.';
            break;
          case 'auth/account-exists-with-different-credential':
            errorMessage = 'Bu e-posta adresi farklı bir sağlayıcı ile zaten kayıtlı.';
            break;
          default:
            errorMessage = `${providerName} ile giriş yapılırken bir hata oluştu: ${err.message}`;
        }
      }
      setError(errorMessage);
    }
  };

  const handleGoogleLogin = () => handleSocialLogin(googleProvider, 'Google');
  const handleGithubLogin = () => handleSocialLogin(githubProvider, 'GitHub');
  const handleAppleLogin = () => handleSocialLogin(appleProvider, 'Apple');
  const handleMicrosoftLogin = () => handleSocialLogin(microsoftProvider, 'Microsoft');

  const handleSignup = async (email: string, password: string, displayName: string) => {
    try {
      await setPersistence(auth, browserLocalPersistence); // Kayıt olurken de beni hatırla
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      // Kullanıcının adını Firebase profiline kaydet
      await updateProfile(userCredential.user, { displayName });
      setError('');
    } catch (err: any) {
      console.error("Error during email/password signup:", err);
      let errorMessage = 'Kayıt sırasında bir hata oluştu.';
      if (err.code === 'auth/email-already-in-use') {
        errorMessage = 'Bu e-posta adresi zaten kullanımda!';
      } else if (err.code === 'auth/weak-password') {
        errorMessage = 'Şifre en az 6 karakter olmalıdır!';
      } else if (err.message) {
        errorMessage = `Kayıt sırasında bir hata oluştu: ${err.message}`;
      }
      setError(errorMessage);
    }
  };

  const handleLogout = () => {
    signOut(auth);
  };

  if (!isLoggedIn) {
    return authMode === 'login' 
      ? <LoginForm 
          onLogin={handleLogin} 
          onGoogleLogin={handleGoogleLogin} 
          onGithubLogin={handleGithubLogin}
          onAppleLogin={handleAppleLogin}
          onMicrosoftLogin={handleMicrosoftLogin}
          onSwitchToSignup={() => setAuthMode('signup')} 
          error={error} 
        />
      : <SignupForm 
          onSignup={handleSignup} 
          onGoogleLogin={handleGoogleLogin}
          onGithubLogin={handleGithubLogin}
          onAppleLogin={handleAppleLogin}
          onMicrosoftLogin={handleMicrosoftLogin}
          onSwitchToLogin={() => setAuthMode('login')} 
          error={error} 
        />;
  }

  return <ManagementContent onLogout={handleLogout} />;
}