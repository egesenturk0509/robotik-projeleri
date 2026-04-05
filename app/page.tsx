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
  sendEmailVerification,
  linkWithCredential,
  AuthCredential 
} from 'firebase/auth';

export default function HomePage() {
  const [error, setError] = useState<React.ReactNode>('');
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null); // null: kontrol ediliyor
  const [needsVerification, setNeedsVerification] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [isLoading, setIsLoading] = useState(false);
  const [pendingCredential, setPendingCredential] = useState<AuthCredential | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsLoggedIn(!!user);
      setNeedsVerification(!!user && !user.emailVerified);
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
      
      // Doğrulama e-postası gönder
      await sendEmailVerification(userCredential.user);
      alert("Hesabınız oluşturuldu ve doğrulama e-postası gönderildi. Lütfen e-postanızı onaylayın. 📧");
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
        setError(`Bu e-posta adresi başka bir yöntemle kayıtlı. Güvenliğiniz için mevcut hesabınızla giriş yapın; ${providerName} hesabınız bu hesaba otomatik eklenecektir.`);
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
      console.error("Password reset error:", err.code, err.message);
      setError(`Hata: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendVerification = async () => {
    if (!auth.currentUser) return;
    setIsLoading(true);
    try {
      await sendEmailVerification(auth.currentUser);
      alert("Doğrulama e-postası tekrar gönderildi. Lütfen kutunuzu kontrol edin.");
    } catch (err: any) {
      setError("E-posta gönderilirken bir hata oluştu. Çok sık deniyor olabilirsiniz.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCheckVerification = async () => {
    if (!auth.currentUser) return;
    await auth.currentUser.reload(); // Firebase'den güncel kullanıcı durumunu çek
    setNeedsVerification(!auth.currentUser.emailVerified);
    if (auth.currentUser.emailVerified) {
      setError("");
      alert("E-posta adresiniz doğrulandı! Hoş geldiniz.");
    } else {
      alert("E-posta henüz doğrulanmamış gibi görünüyor. Lütfen gelen kutunuzdaki bağlantıya tıkladığınızdan emin olun.");
    }
  };

  if (isLoggedIn === null) return null; // Yüklenme anında boş sayfa göster

  if (isLoggedIn) {
    if (needsVerification) {
      return (
        <div className="login-container">
          <div className="login-card">
            <h1>E-posta Doğrulaması Gerekli</h1>
            <p style={{ marginBottom: '20px', color: '#666' }}>Lütfen e-posta adresinize gönderilen doğrulama bağlantısına tıklayın.</p>
            <button className="btn-login" onClick={handleCheckVerification}>Doğrulamayı Kontrol Et</button>
            <button className="btn-social" style={{ marginTop: '10px' }} onClick={handleResendVerification} disabled={isLoading}>
              {isLoading ? "Gönderiliyor..." : "Maili Tekrar Gönder"}
            </button>
            <button className="btn-logout" style={{ marginTop: '20px', width: '100%', padding: '12px', borderRadius: '8px' }} onClick={() => signOut(auth)}>Çıkış Yap</button>
            {error && <p className="error-message">{error}</p>}
          </div>
        </div>
      );
    }
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