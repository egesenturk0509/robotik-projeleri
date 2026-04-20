"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import SignupForm from '../SignupForm';
import LoginForm from '../LoginForm';
import ManagementContent from './ManagementContent';

// DİKKAT: Eğer hata devam ederse './lib/firebase' kısmını '../lib/firebase' olarak değiştir!
import { auth, googleProvider, githubProvider, twitterProvider, facebookProvider, yahooProvider } from './firebase';
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
  const [pendingUser, setPendingUser] = useState<any>(null); // Onay bekleyen kullanıcı
  const [providerLogo, setProviderLogo] = useState(''); // Girilen sağlayıcı logosu

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!pendingUser) setIsLoggedIn(!!user);
    });
    return () => unsubscribe();
  }, [pendingUser]);

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
      const result = await signInWithPopup(auth, provider);
      if (result.user) {
        // Logo belirle
        let logo = "";
        if (providerName === 'Google') logo = "https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg";
        else if (providerName === 'GitHub') logo = "https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/github.svg";
        else if (providerName === 'X') logo = "https://upload.wikimedia.org/wikipedia/commons/5/53/X_logo_2023_original.svg";
        else if (providerName === 'Facebook') logo = "https://upload.wikimedia.org/wikipedia/commons/0/05/Facebook_Logo_%282019%29.png";
        else if (providerName === 'Yahoo') logo = "https://upload.wikimedia.org/wikipedia/commons/e/ed/Yahoo%21_logo.svg";
        
        setProviderLogo(logo);
        setPendingUser(result.user);
      }
    } catch (err: any) {
      if (err.code !== 'auth/popup-closed-by-user') {
        setError(`${providerName} hatası oluştu.`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const confirmPersistence = async (stay: boolean) => {
    await setPersistence(auth, stay ? browserLocalPersistence : browserSessionPersistence);
    setIsLoggedIn(true);
    setPendingUser(null);
    router.refresh();
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
      const res = await fetch('/api', {
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

  // Oturum Açık Kalsın mı Ekranı (login.live.com stili)
  if (pendingUser) {
    return (
      <div className="login-container">
        <div className="login-card" style={{ textAlign: 'center' }}>
          {providerLogo && <img src={providerLogo} alt="Provider" width="48" height="48" style={{ marginBottom: '20px' }} />}
          <h2 style={{ fontSize: '24px', marginBottom: '10px' }}>Oturumunuz açık kalsın mı?</h2>
          <p className="header-sub">Bunu, hesabınıza her seferinde girmek zorunda kalmamanız için yapıyoruz.</p>
          
          <div className="form-flex-row" style={{ marginTop: '30px', gap: '10px' }}>
            <button className="btn-save" style={{ flex: 1 }} onClick={() => confirmPersistence(true)}>Evet</button>
            <button className="btn-logout" style={{ flex: 1, backgroundColor: '#ccc' }} onClick={() => confirmPersistence(false)}>Hayır</button>
          </div>
        </div>
      </div>
    );
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