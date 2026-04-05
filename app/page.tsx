"use client";
import React, { useState, useEffect } from 'react';
import LoginForm from '../LoginForm';
import SignupForm from '../SignupForm';
import ManagementContent from './ManagementContent';
import { auth, googleProvider, githubProvider, twitterProvider, facebookProvider, yahooProvider } from './firebase';
import { 
  createUserWithEmailAndPassword, 
  updateProfile, 
  signInWithPopup, 
  onAuthStateChanged, 
  setPersistence, 
  browserLocalPersistence, 
  browserSessionPersistence,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  linkWithCredential,
  AuthCredential 
} from 'firebase/auth';

export default function HomePage() {
  const [error, setError] = useState<React.ReactNode>('');
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null); // null: kontrol ediliyor
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [isLoading, setIsLoading] = useState(false);
  const [pendingCredential, setPendingCredential] = useState<AuthCredential | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsLoggedIn(!!user);
    });
    return () => unsubscribe();
  }, []);

  const handleLogin = async (email: string, password: string, rememberMe: boolean) => {
    setIsLoading(true);
    try {
      await setPersistence(auth, rememberMe ? browserLocalPersistence : browserSessionPersistence);
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      
      // Eğer bekleyen bir sosyal medya bağlama işlemi varsa bağla
      if (pendingCredential) {
        await linkWithCredential(userCredential.user, pendingCredential);
        setPendingCredential(null);
        alert("Hesabınız başarıyla bağlandı!");
      }
      setError('');
    } catch (err: any) {
      setError('E-posta adresi veya şifre hatalı!');
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
      setError(err.code === 'auth/email-already-in-use' ? 'Bu e-posta zaten kullanımda.' : 'Kayıt sırasında bir hata oluştu.');
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
      if (err.code === 'auth/account-exists-with-different-credential') {
        setPendingCredential(err.credential);
        setError(`Bu e-posta zaten başka bir yöntemle kayıtlı. Lütfen şifrenizle giriş yapın, hesabınız otomatik olarak bağlanacaktır.`);
        setAuthMode('login');
      } else if (err.code === 'auth/popup-closed-by-user') {
        setError('Giriş penceresi kapatıldı.');
      } else {
        setError(`${providerName} ile işlem yapılamadı.`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async (email: string) => {
    if (!email) return setError("Lütfen e-posta adresinizi girin.");
    setIsLoading(true);
    try {
      await sendPasswordResetEmail(auth, email);
      alert("Şifre sıfırlama bağlantısı e-posta adresinize gönderildi.");
      setError('');
    } catch (err: any) {
      setError("Sıfırlama e-postası gönderilemedi. Adresi kontrol edin.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoggedIn === null) return null; // Yüklenme anında boş sayfa göster

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