"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import SignupForm from '../SignupForm';
import LoginForm from '../LoginForm';
import ManagementContent from './ManagementContent';

// DİKKAT: Eğer hata devam ederse './lib/firebase' kısmını '../lib/firebase' olarak değiştir!
import { auth, googleProvider, githubProvider, twitterProvider, facebookProvider, yahooProvider } from './lib/firebase';

import { 
  onAuthStateChanged, 
  setPersistence, 
  browserLocalPersistence, 
  browserSessionPersistence, 
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  sendEmailVerification,
  RecaptchaVerifier
} from 'firebase/auth';

export default function SignupPage() {
  const [error, setError] = useState<React.ReactNode>('');
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [isRecaptchaResolved, setIsRecaptchaResolved] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsLoggedIn(!!user);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const container = document.getElementById('recaptcha-container');
    if (typeof window !== 'undefined' && container && !container.hasChildNodes()) {
      try {
        const verifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
          'size': 'normal',
          'callback': () => setIsRecaptchaResolved(true),
          'expired-callback': () => setIsRecaptchaResolved(false)
        });
        verifier.render();
      } catch (err) {
        console.error("ReCAPTCHA yüklenemedi:", err);
      }
    }
  }, [isLogin]);

  const handleSocialSignup = async (provider: any, providerName: string) => {
    setIsLoading(true);
    try {
      await setPersistence(auth, browserLocalPersistence);
      const result = await signInWithPopup(auth, provider);
      if (result.user) {
        setIsLoggedIn(true);
        router.refresh();
      }
    } catch (err: any) {
      if (err.code !== 'auth/popup-closed-by-user') {
        setError(`${providerName} hatası oluştu.`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailLogin = async (email: string, password: string, rememberMe: boolean) => {
    setIsLoading(true);
    try {
      await setPersistence(auth, rememberMe ? browserLocalPersistence : browserSessionPersistence);
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err: any) {
      setError('Giriş bilgileri hatalı.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async (email: string) => {
    if (!email) return alert("E-posta gerekli.");
    setIsLoading(true);
    try {
      const res = await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, type: 'reset' }),
      });
      if (res.ok) alert("Şifre sıfırlama maili Brevo ile gönderildi! 🚀");
      else throw new Error();
    } catch (err) {
      setError("Mail gönderilemedi.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoggedIn === null) return <div className="loading-screen">Yükleniyor... 🤖</div>;

  if (isLoggedIn) {
    return <ManagementContent onLogout={() => auth.signOut()} />;
  }

  return (
    <div className="auth-container">
      {isLogin ? (
        <LoginForm
          onLogin={handleEmailLogin}
          onGoogleLogin={() => handleSocialSignup(googleProvider, 'Google')}
          onGithubLogin={() => handleSocialSignup(githubProvider, 'GitHub')}
          onTwitterLogin={() => handleSocialSignup(twitterProvider, 'X')}
          onFacebookLogin={() => handleSocialSignup(facebookProvider, 'Facebook')}
          onYahooLogin={() => handleSocialSignup(yahooProvider, 'Yahoo')}
          onSwitchToSignup={() => setIsLogin(false)}
          onForgotPassword={handleForgotPassword}
          error={error}
          isLoading={isLoading}
          isRecaptchaResolved={isRecaptchaResolved}
        />
      ) : (
        /* SignupForm buraya gelecek */
        <div>Kayıt Formu</div>
      )}
      <div id="recaptcha-container"></div>
    </div>
  );
}