import React, { useState } from 'react';

interface LoginFormProps {
  onLogin: (username: string, password: string, rememberMe: boolean) => void;
  error: string;
}

export default function LoginForm({ onLogin, error }: LoginFormProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin(username, password, rememberMe);
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h1>Robotik Mühendisliği Projeleri</h1>
        <form onSubmit={handleSubmit}>
          <input 
            type="text" 
            placeholder="Kullanıcı Adı" 
            className="login-input"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
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
        </form>
        <a className="forgot-password" onClick={() => alert('Yöneticiyle iletişime geçin.')}>
          Şifremi Unuttum
        </a>
        {error && <p className="error-message">{error}</p>}
      </div>
    </div>
  );
}