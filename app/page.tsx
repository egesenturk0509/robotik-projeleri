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
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);
  const [showStaySignedIn, setShowStaySignedIn] = useState(false);
  const [pendingUser, setPendingUser] = useState<any>(null);
  const [isDecisionPending, setIsDecisionPending] = useState(false);
  const [needsVerification, setNeedsVerification] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [isLoading, setIsLoading] = useState(false);
  const [pendingCredential, setPendingCredential] = useState<AuthCredential | null>(null);
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user && !isDecisionPending) {
        setIsLoggedIn(true);
        setNeedsVerification(!user.emailVerified);
      } else if (!user) {
        setIsLoggedIn(false);
      }
    });
    return () => unsubscribe();
  }, [isDecisionPending]);
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
      if (err.code === 'auth/invalid-credential' || err.code === 'auth/wrong-password' || err.code === 'auth/user-not-found') {
        setError('E-posta adresi veya şifre hatalı!');
      } else if (err.code === 'auth/account-exists-with-different-credential') {
        setPendingCredential(err.credential);
        setError(`Bu e-posta başka bir yöntemle kayıtlı. Lütfen şifrenizle giriş yapın, hesabınız otomatik bağlanacaktır.`);
        setAuthMode('login');
      } else {
        setError('Giriş yapılırken bir hata oluştu.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleStaySignedInChoice = async (stay: boolean) => {
    await setPersistence(auth, stay ? browserLocalPersistence : browserSessionPersistence);
    setIsDecisionPending(false);
    setIsLoggedIn(true);
    setNeedsVerification(!pendingUser?.emailVerified);
    setShowStaySignedIn(false);
    setPendingUser(null);
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
    setIsDecisionPending(true);
    setError('');
    try {
      const result = await signInWithPopup(auth, provider);
      setPendingUser(result.user);
      setShowStaySignedIn(true);
    } catch (err: any) {
      setIsDecisionPending(false);
      if (err.code === 'auth/account-exists-with-different-credential') {
        setPendingCredential(err.credential);
        setError(`Bu e-posta başka bir yöntemle kayıtlı. Lütfen şifrenizle giriş yapın, hesabınız otomatik bağlanacaktır.`);
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
    if (showStaySignedIn) {
      return (
        <div className="login-container">
          <div className="login-card" style={{ maxWidth: '450px' }}>
            <img src="https://www.gstatic.com/images/branding/googlelogo/2x/googlelogo_color_92x30dp.png" alt="Logo" style={{ height: '30px', marginBottom: '20px' }} />
            <h2 style={{ textAlign: 'left', fontSize: '1.5em', marginBottom: '10px' }}>Oturum açık kalsın mı?</h2>
            <p style={{ textAlign: 'left', color: '#666', fontSize: '0.95em', marginBottom: '20px' }}>
              Bunu, her zaman oturum açmak zorunda kalmamak için yapın.
            </p>
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '30px' }}>
              <button className="btn-modal-cancel" style={{ flex: 'none', width: '100px' }} onClick={() => handleStaySignedInChoice(false)}>Hayır</button>
              <button className="btn-login" style={{ flex: 'none', width: '100px', marginTop: 0 }} onClick={() => handleStaySignedInChoice(true)}>Evet</button>
            </div>
            <div style={{ textAlign: 'left', marginTop: '20px' }}>
              <input type="checkbox" id="dontShowAgain" />
              <label htmlFor="dontShowAgain" style={{ fontSize: '0.85em', marginLeft: '5px' }}>Bunu bir daha gösterme</label>
            </div>
          </div>
        </div>
      );
    }
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