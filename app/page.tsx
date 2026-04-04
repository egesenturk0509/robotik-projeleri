"use client";

import React, { useState, useEffect } from 'react';
import LoginForm from '../LoginForm';
import ManagementContent from './ManagementContent';
import { auth } from './firebase';
import { signInWithEmailAndPassword, signOut, onAuthStateChanged, setPersistence, browserLocalPersistence, browserSessionPersistence, User } from 'firebase/auth';

// --- ANA SAYFA (Main Page) ---

export default function RobotikProje() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
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

  const handleLogout = () => {
    signOut(auth);
  };

  if (!isLoggedIn) {
    return <LoginForm onLogin={handleLogin} error={error} />;
  }

  return <ManagementContent onLogout={handleLogout} />;
}