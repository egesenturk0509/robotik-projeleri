"use client";

import React, { useState, useEffect } from 'react';
import LoginForm from '../LoginForm';
import ManagementContent from './ManagementContent';

// --- ANA SAYFA (Main Page) ---

export default function RobotikProje() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const savedLogin = localStorage.getItem('isLoggedIn');
    if (savedLogin === 'true') { setIsLoggedIn(true); }
  }, []);

  const handleLogin = (username: string, password: string, rememberMe: boolean) => {
    if (username === 'ege.senturk' && password === 'ege052014') {
      setIsLoggedIn(true);
      if (rememberMe) { localStorage.setItem('isLoggedIn', 'true'); }
      setError('');
    } else { setError('Hatalı kullanıcı adı veya şifre!'); }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem('isLoggedIn');
  };

  if (!isLoggedIn) {
    return <LoginForm onLogin={handleLogin} error={error} />;
  }

  return <ManagementContent onLogout={handleLogout} />;
}