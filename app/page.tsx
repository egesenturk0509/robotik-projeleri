"use client";
import React, { useState, useEffect } from 'react';
import SignupForm from '../SignupForm';
import LoginForm from '../LoginForm';
import ManagementContent from './ManagementContent';
import { auth, googleProvider, githubProvider, twitterProvider, facebookProvider, yahooProvider } from './firebase';
import { createUserWithEmailAndPassword, updateProfile, signInWithPopup, onAuthStateChanged, setPersistence, browserLocalPersistence, browserSessionPersistence, signInWithEmailAndPassword, signOut, sendPasswordResetEmail } from 'firebase/auth';

export default function HomePage() {
  const [error, setError] = useState<React.ReactNode>('');
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null); // null: yükleniyor, false: giriş yok, true: giriş var
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Uygulama açıldığında kayıtlı oturum olup olmadığını kontrol eder
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsLoggedIn(!!user);
    });
    return () => unsubscribe();
  }, []);

  const handleLogin = async (email: string, password: string, rememberMe: boolean) => {
    setIsLoading(true);
    try {
      // Beni hatırla işaretliyse yerel hafızayı, değilse oturum bazlı hafızayı kullanır
      await setPersistence(auth, rememberMe ? browserLocalPersistence : browserSessionPersistence);
      await signInWithEmailAndPassword(auth, email, password);
      setError('');
    } catch (err: any) {
      console.error("Giriş hatası:", err);
      setError('E-posta adresi veya şifre hatalı!');
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async (email: string) => {
    setIsLoading(true);
    try {
      await sendPasswordResetEmail(auth, email);
      alert('Şifre sıfırlama e-postası gönderildi! Lütfen gelen kutunuzu kontrol edin. 📧');
      setError('');
    } catch (err: any) {
      setError('Şifre sıfırlama e-postası gönderilirken bir hata oluştu. E-posta adresinizi kontrol edin.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailSignup = async (email: string, password: string, displayName: string) => {
    setIsLoading(true);
    try {
      await setPersistence(auth, browserLocalPersistence);
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(userCredential.user, { displayName });
      setError('');
    } catch (err: any) {
      setError(err.code === 'auth/email-already-in-use' ? 'Bu e-posta adresi zaten kullanımda!' : 'Kayıt hatası oluştu.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialAuth = async (provider: any, providerName: string) => {
    setIsLoading(true);
    try {
      await setPersistence(auth, browserLocalPersistence);
      await signInWithPopup(auth, provider);
      setError('');
    } catch (err: any) {
      console.error(`${providerName} hatası:`, err);
      let errorMessage = `${providerName} ile giriş yapılamadı.`;
      if (err.code) {
        switch (err.code) {
          case 'auth/popup-closed-by-user':
            errorMessage = 'Giriş penceresi kapatıldı.';
            break;
          case 'auth/account-exists-with-different-credential':
            errorMessage = `Bu e-posta adresi farklı bir sağlayıcı ile zaten kayıtlı. Lütfen ${providerName} yerine diğer giriş yöntemini kullanın.`;
            break;
        }
      }
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoggedIn === null) return null; // İlk yüklemede boş dön

  if (isLoggedIn) {
    return <ManagementContent onLogout={() => signOut(auth)} />;
  }

  return (
    authMode === 'login' ? (
      <LoginForm
        onLogin={handleLogin}
        onGoogleLogin={() => handleSocialAuth(googleProvider, 'Google')}
        onGithubLogin={() => handleSocialAuth(githubProvider, 'GitHub')}
        onTwitterLogin={() => handleSocialAuth(twitterProvider, 'X')}
        onFacebookLogin={() => handleSocialAuth(facebookProvider, 'Facebook')}
        onYahooLogin={() => handleSocialAuth(yahooProvider, 'Yahoo')}
        onSwitchToSignup={() => setAuthMode('signup')}
        onForgotPassword={handleForgotPassword}
        error={error}
        isLoading={isLoading}
      />
    ) : (
      <SignupForm 
        onSignup={handleEmailSignup} 
        onGoogleLogin={() => handleSocialAuth(googleProvider, 'Google')}
        onGithubLogin={() => handleSocialAuth(githubProvider, 'GitHub')}
        onTwitterLogin={() => handleSocialAuth(twitterProvider, 'X')}
        onFacebookLogin={() => handleSocialAuth(facebookProvider, 'Facebook')}
        onYahooLogin={() => handleSocialAuth(yahooProvider, 'Yahoo')}
        onSwitchToLogin={() => setAuthMode('login')}
        error={error} 
        isLoading={isLoading}
      />
    )
  );
}