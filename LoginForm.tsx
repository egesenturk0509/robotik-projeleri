import React, { useState } from 'react';

interface LoginFormProps {
  onLogin: (email: string, password: string, rememberMe: boolean) => void;
  onGoogleLogin: () => void;
  onGithubLogin: () => void;
  onTwitterLogin: () => void;
  onSwitchToSignup: () => void;
  error: React.ReactNode;
  isLoading: boolean; // Yeni prop
}

export default function LoginForm({ onLogin, onGoogleLogin, onGithubLogin, onTwitterLogin, onSwitchToSignup, error, isLoading }: LoginFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoading) { // Çoklu gönderimi engelle
      onLogin(email, password, rememberMe);
    }
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
            disabled={isLoading} // Yüklenirken inputu devre dışı bırak
          />
          <div className="password-wrapper">
            <input 
              type={showPassword ? "text" : "password"} 
              placeholder="Şifre" 
              className="login-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading} // Yüklenirken inputu devre dışı bırak
            />
            <button 
              type="button" 
              className="toggle-password" 
              onClick={() => setShowPassword(!showPassword)}
              disabled={isLoading} // Yüklenirken düğmeyi devre dışı bırak
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
              disabled={isLoading} // Yüklenirken checkbox'ı devre dışı bırak
            />
            <label htmlFor="rememberMe">Beni Hatırla</label>
          </div>
          <button type="submit" className="btn-login" disabled={isLoading}> {/* Yüklenirken düğmeyi devre dışı bırak */}
            {isLoading ? "Giriş Yapılıyor..." : "Giriş Yap"} {/* Metni değiştir */}
          </button>
          
          <div className="google-login-separator">
            <span>veya</span>
          </div>
          
          <button type="button" className="btn-google" onClick={onGoogleLogin} disabled={isLoading}>
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