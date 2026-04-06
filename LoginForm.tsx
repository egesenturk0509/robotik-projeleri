"use client";
import React, { useState } from 'react';
interface LoginFormProps {
  onLogin: (email: string, password: string, rememberMe: boolean) => void;
  onGoogleLogin: () => void;
  onGithubLogin: () => void;
  onTwitterLogin: () => void;
  onFacebookLogin: () => void;
  onYahooLogin: () => void;
  onSwitchToSignup: () => void;
  onForgotPassword: (email: string) => void;
  error: React.ReactNode;
  isLoading: boolean;
  isRecaptchaResolved: boolean;
}
export default function LoginForm({onLogin,onGoogleLogin,onGithubLogin,onTwitterLogin,onFacebookLogin,onYahooLogin,onSwitchToSignup,onForgotPassword,error,isLoading,isRecaptchaResolved}: LoginFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isResetMode, setIsResetMode] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoading && isRecaptchaResolved) onLogin(email, password, rememberMe);
  };

  if (isResetMode) {
    return (
      <div className="login-container">
        <div className="login-card">
          <h1>Şifre Sıfırla</h1>
          <p className="header-sub">Bağlantı için e-postanızı girin.</p>
          <input type="email" placeholder="E-posta" className="login-input" value={email} onChange={(e)=>setEmail(e.target.value)} disabled={isLoading} />
          <button onClick={()=>onForgotPassword(email)} disabled={isLoading||!email} className="btn-login">{isLoading?"Gönderiliyor...":"Mail Gönder"}</button>
          <a className="forgot-password" onClick={()=>setIsResetMode(false)}>Geri Dön</a>
          {error && <p className="error-message">{error}</p>}
        </div>
      </div>
    );
  }

  return (
    <div className="login-container">
      <div className="login-card">
        <h1>Giriş Yap</h1>
        <p className="header-sub">Robotik Mühendisliği Portalı</p>
        <form onSubmit={handleSubmit}>
          <input type="email" placeholder="E-Posta" className="login-input" value={email} onChange={(e)=>setEmail(e.target.value)} disabled={isLoading} required />
          <div className="password-wrapper">
            <input type={showPassword?"text":"password"} placeholder="Şifre" className="login-input" value={password} onChange={(e)=>setPassword(e.target.value)} disabled={isLoading} required />
            <button type="button" className="toggle-password" onClick={()=>setShowPassword(!showPassword)} disabled={isLoading}>{showPassword?"👁️‍🗨️":"👁️"}</button>
          </div>
          
          <div className="remember-me-container">
            <input type="checkbox" checked={rememberMe} onChange={(e)=>setRememberMe(e.target.checked)} disabled={isLoading} />
            <span className="form-label">Beni Hatırla</span>
          </div>

          <div style={{ marginTop: '15px', display: 'flex', justifyContent: 'center' }}>
            <div id="recaptcha-container"></div>
          </div>

          <button type="submit" disabled={isLoading || !isRecaptchaResolved} className="btn-login">
            {isLoading ? "İşleniyor..." : "Giriş Yap"}
          </button>

          <div className="google-login-separator">
            <span>veya</span>
          </div>

          <button type="button" className="btn-social btn-google" onClick={onGoogleLogin} disabled={isLoading}>
            <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" width="18" height="18" />
            Google ile Giriş Yap
          </button>
          
          <button type="button" className="btn-social btn-github" onClick={onGithubLogin} disabled={isLoading}>
            <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/github.svg" alt="GitHub" width="18" height="18" />
            GitHub ile Giriş Yap
          </button>

          <button type="button" className="btn-social btn-x" onClick={onTwitterLogin} disabled={isLoading}>
            <img src="https://upload.wikimedia.org/wikipedia/commons/5/53/X_logo_2023_original.svg" alt="X" width="18" height="18" />
            X ile Giriş Yap
          </button>
          
          <button type="button" className="btn-social btn-yahoo" onClick={onYahooLogin} disabled={isLoading}>
            <img src="https://upload.wikimedia.org/wikipedia/commons/e/ed/Yahoo%21_logo.svg" alt="Yahoo" width="18" height="18" />
            Yahoo ile Giriş Yap
          </button>
        </form>

        <a className="forgot-password" onClick={onSwitchToSignup}>
          Hesabın yok mu? Kaydol
        </a>
        <a className="forgot-password" onClick={()=>setIsResetMode(true)}>
          Şifremi Unuttum
        </a>
        {error && <p className="error-message">{error}</p>}
      </div>
    </div>
  );
}