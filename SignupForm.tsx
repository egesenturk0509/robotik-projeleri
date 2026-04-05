import React, { useState } from 'react';

interface SignupFormProps {
  onSignup: (email: string, password: string, displayName: string) => void;
  onGoogleLogin: () => void;
  onGithubLogin: () => void;
  onTwitterLogin: () => void;
  onSwitchToLogin: () => void;
  error: React.ReactNode;
  isLoading: boolean; // Yeni prop
}

export default function SignupForm({ 
  onSignup, 
  onGoogleLogin, 
  onGithubLogin, 
  onTwitterLogin,
  onSwitchToLogin, 
  error,
  isLoading // Yeni prop
}: SignupFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoading) { // Çoklu gönderimi engelle
      onSignup(email, password, displayName);
    }
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
            disabled={isLoading} // Yüklenirken inputu devre dışı bırak
          />
          <input 
            type="email" 
            placeholder="E-posta" 
            className="login-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={isLoading} // Yüklenirken inputu devre dışı bırak
          />
          <div className="password-wrapper">
            <input 
              type={showPassword ? "text" : "password"} 
              placeholder="Şifre" 
              className="login-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
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
          <button type="submit" className="btn-login" disabled={isLoading}> {/* Yüklenirken düğmeyi devre dışı bırak */}
            {isLoading ? "Kayıt Olunuyor..." : "Kayıt Ol"} {/* Metni değiştir */}
          </button>

          <div className="google-login-separator">
            <span>veya</span>
          </div>

          <button type="button" className="btn-social btn-google" onClick={onGoogleLogin} disabled={isLoading}>
            <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" width="18" height="18" />
            Google ile Kayıt Ol
          </button>

          <button type="button" className="btn-social btn-github" onClick={onGithubLogin} disabled={isLoading}>
            <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/github.svg" alt="GitHub" width="18" height="18" />
            GitHub ile Kayıt Ol
          </button>

          <button type="button" className="btn-social btn-x" onClick={onTwitterLogin} disabled={isLoading}>
            <img src="https://upload.wikimedia.org/wikipedia/commons/5/53/X_logo_2023_original.svg" alt="X" width="18" height="18" />
            X ile Kayıt Ol
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