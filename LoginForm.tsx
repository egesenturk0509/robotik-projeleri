import React, { useState } from 'react';

interface LoginFormProps {
  onLogin: (email: string, password: string, rememberMe: boolean) => void;
  onGoogleLogin: () => void;
  onGithubLogin: () => void;
  onAppleLogin: () => void;
  onMicrosoftLogin: () => void;
  onSwitchToSignup: () => void;
  error: string;
}

export default function LoginForm({ onLogin, onGoogleLogin, onGithubLogin, onAppleLogin, onMicrosoftLogin, onSwitchToSignup, error }: LoginFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin(email, password, rememberMe);
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h1>Robotik Mühendisliği Projeleri</h1>
        <form onSubmit={handleSubmit}>
          <input 
            type="email" 
            placeholder="E-posta" 
            className="login-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <div className="password-wrapper">
            <input 
              type={showPassword ? "text" : "password"} 
              placeholder="Şifre" 
              className="login-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button 
              type="button" 
              className="toggle-password" 
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? "👁️‍🗨️" : "👁️"}
            </button>
          </div>
          <div className="remember-me-container">
            <input 
              type="checkbox" 
              id="rememberMe"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
            />
            <label htmlFor="rememberMe">Beni Hatırla</label>
          </div>
          <button type="submit" className="btn-login">Giriş Yap</button>
          
          <div className="google-login-separator">
            <span>veya</span>
          </div>
          
          <button type="button" className="btn-google" onClick={onGoogleLogin}>
            <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" width="18" height="18" />
            Google ile Giriş Yap
          </button>

          <button type="button" className="btn-social btn-github" onClick={onGithubLogin}>
            <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/github.svg" alt="GitHub" width="18" height="18" />
            GitHub ile Giriş Yap
          </button>

          <button type="button" className="btn-social btn-apple" onClick={onAppleLogin}>
            <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/apple.svg" alt="Apple" width="18" height="18" />
            Apple ile Giriş Yap
          </button>

          <button type="button" className="btn-social btn-microsoft" onClick={onMicrosoftLogin}>
            <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/microsoft.svg" alt="Microsoft" width="18" height="18" />
            Microsoft ile Giriş Yap
          </button>



        </form>
        <a className="forgot-password" onClick={() => alert('Yöneticiyle iletişime geçin.')}>
          Şifremi Unuttum
        </a>
        <a className="forgot-password" style={{ marginTop: '5px' }} onClick={onSwitchToSignup}>
          Hesabın yok mu? Yeni hesap oluştur
        </a>
        {error && <p className="error-message">{error}</p>}
      </div>
    </div>
  );
}