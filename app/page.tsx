"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import SignupForm from '../../SignupForm';
import { auth, googleProvider, githubProvider, twitterProvider, facebookProvider, yahooProvider } from '../firebase';
import { createUserWithEmailAndPassword, updateProfile, signInWithPopup, getAdditionalUserInfo, onAuthStateChanged, setPersistence, browserLocalPersistence } from 'firebase/auth';

export default function SignupPage() {
  const [error, setError] = useState<React.ReactNode>('');
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) router.push('/'); // Zaten giriş yapmışsa ana sayfaya (dashboard) yolla
    });
    return () => unsubscribe();
  }, [router]);

  const handleEmailSignup = async (email: string, password: string, displayName: string) => {
    setIsLoading(true);
    try {
      await setPersistence(auth, browserLocalPersistence);
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(userCredential.user, { displayName });
      setError('');
      router.push('/');
    } catch (err: any) {
      console.error("Kayıt hatası:", err);
      setError(err.code === 'auth/email-already-in-use' ? 'Bu e-posta zaten kullanımda.' : 'Kayıt sırasında bir hata oluştu.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialSignup = async (provider: any, providerName: string) => {
    setIsLoading(true);
    try {
      await setPersistence(auth, browserLocalPersistence);
      const result = await signInWithPopup(auth, provider);
      const isNewUser = getAdditionalUserInfo(result)?.isNewUser;

      if (!isNewUser) {
        setError(
          <span>
            Böyle bir hesap zaten var.{" "}
            <a onClick={() => router.push('/')} style={{color: '#0078d7', cursor:'pointer', fontWeight:'bold', textDecoration:'underline'}}>Giriş Yap</a>
          </span>
        );
      } else {
        router.push('/');
      }
    } catch (err: any) {
      console.error(`${providerName} hatası:`, err);
      setError(`${providerName} ile kayıt yapılamadı.`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SignupForm 
      onSignup={handleEmailSignup} 
      onGoogleLogin={() => handleSocialSignup(googleProvider, 'Google')}
      onGithubLogin={() => handleSocialSignup(githubProvider, 'GitHub')}
      onTwitterLogin={() => handleSocialSignup(twitterProvider, 'X')}
      onFacebookLogin={() => handleSocialSignup(facebookProvider, 'Facebook')}
      onYahooLogin={() => handleSocialSignup(yahooProvider, 'Yahoo')}
      onSwitchToLogin={() => router.push('/')} 
      error={error} 
      isLoading={isLoading}
    />
  );
}