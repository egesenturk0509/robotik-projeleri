"use client";

import React, { useState, useEffect } from 'react';
import LoginForm from '../LoginForm';
import SignupForm from '../SignupForm';
import ManagementContent from './ManagementContent';
import { auth } from './firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile, signOut, onAuthStateChanged, setPersistence, browserLocalPersistence, browserSessionPersistence, User } from 'firebase/auth';

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

  const handleSignup = async (email: string, password: string, displayName: string) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      // Kullanıcının adını Firebase profiline kaydet
      await updateProfile(userCredential.user, { displayName });
      setError('');
    } catch (err: any) {
      if (err.code === 'auth/email-already-in-use') {
        setError('Bu e-posta adresi zaten kullanımda!');
      } else if (err.code === 'auth/weak-password') {
        setError('Şifre en az 6 karakter olmalıdır!');
      } else {
        setError('Kayıt sırasında bir hata oluştu.');
      }
    }
  };

  const handleLogout = () => {
    signOut(auth);
  };

  if (!isLoggedIn) {
    return authMode === 'login' 
      ? <LoginForm onLogin={handleLogin} onSwitchToSignup={() => setAuthMode('signup')} error={error} />
      : <SignupForm onSignup={handleSignup} onSwitchToLogin={() => setAuthMode('login')} error={error} />;
  }

  return <ManagementContent onLogout={handleLogout} />;
}