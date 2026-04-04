import React, { useState } from 'react';

interface SignupFormProps {
  onSignup: (email: string, password: string, displayName: string) => void;
  onGoogleLogin: () => void;
  onGithubLogin: () => void;
  onAppleLogin: () => void;
  onMicrosoftLogin: () => void;
  onSwitchToLogin: () => void;
  error: React.ReactNode;
}

export default function SignupForm({ 
  onSignup, 
  onGoogleLogin, 
  onGithubLogin, 
  onAppleLogin, 
  onMicrosoftLogin, 
  onSwitchToLogin, 
  error 
}: SignupFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSignup(email, password, displayName);
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h1>Yeni Hesap Oluştur</h1>
        <form onSubmit={handleSubmit}>
          <input 
            type="text" 
            placeholder="Adınız Soyadınız" 
            className="login-input"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            required
          />
          <input 
            type="email" 
            placeholder="E-posta" 
            className="login-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <div className="password-wrapper">
            <input 
              type={showPassword ? "text" : "password"} 
              placeholder="Şifre" 
              className="login-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button 
              type="button" 
              className="toggle-password" 
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? "👁️‍🗨️" : "👁️"}
            </button>
          </div>
          <button type="submit" className="btn-login">Kayıt Ol</button>

          <div className="google-login-separator">
            <span>veya</span>
          </div>

          <button type="button" className="btn-social btn-google" onClick={onGoogleLogin}>
            <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" width="18" height="18" />
            Google ile Kayıt Ol
          </button>

          <button type="button" className="btn-social btn-github" onClick={onGithubLogin}>
            <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/github.svg" alt="GitHub" width="18" height="18" />
            GitHub ile Kayıt Ol
          </button>

          <button type="button" className="btn-social btn-apple" onClick={onAppleLogin}>
            <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/apple.svg" alt="Apple" width="18" height="18" />
            Apple ile Kayıt Ol
          </button>

          <button type="button" className="btn-social btn-microsoft" onClick={onMicrosoftLogin}>
            <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/microsoft.svg" alt="Microsoft" width="18" height="18" />
            Microsoft ile Kayıt Ol
          </button>
        </form>
        <a className="forgot-password" onClick={onSwitchToLogin}>
          Zaten hesabın var mı? Giriş Yap
        </a>
        {error && <p className="error-message">{error}</p>}
      </div>
    </div>
  );
}