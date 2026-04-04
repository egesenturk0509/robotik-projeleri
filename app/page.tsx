"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import SignupForm from '../SignupForm';
import { auth, googleProvider, githubProvider, appleProvider, microsoftProvider } from './firebase';
import { createUserWithEmailAndPassword, updateProfile, signInWithPopup, getAdditionalUserInfo } from 'firebase/auth';

export default function SignupPage() {
  const [error, setError] = useState<React.ReactNode>('');
  const router = useRouter();

  const handleSignup = async (email: string, password: string, displayName: string) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(userCredential.user, { displayName });
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.code === 'auth/email-already-in-use' ? 'Bu e-posta zaten kullanımda.' : 'Kayıt hatası.');
    }
  };

  const handleSocialSignup = async (provider: any, providerName: string) => {
    try {
      const result = await signInWithPopup(auth, provider);
      const isNewUser = getAdditionalUserInfo(result)?.isNewUser;

      if (!isNewUser) {
        // İstediğin kural: Kayıt ekranında eski hesapla girilirse uyar
        setError(
          <span>
            Böyle bir hesap zaten var.{" "}
            <a onClick={() => router.push('/login')} style={{color: '#0078d7', cursor:'pointer', fontWeight:'bold', textDecoration:'underline'}}>Giriş Yap</a>
          </span>
        );
      } else {
        router.push('/dashboard');
      }
    } catch (err: any) {
      setError(`${providerName} ile kayıt yapılamadı.`);
    }
  };

  return (
    <SignupForm 
      onSignup={handleSignup} 
      onGoogleLogin={() => handleSocialSignup(googleProvider, 'Google')}
      onGithubLogin={() => handleSocialSignup(githubProvider, 'GitHub')}
      onAppleLogin={() => handleSocialSignup(appleProvider, 'Apple')}
      onMicrosoftLogin={() => handleSocialSignup(microsoftProvider, 'Microsoft')}
      onSwitchToLogin={() => router.push('/login')} 
      error={error} 
    />
  );
}