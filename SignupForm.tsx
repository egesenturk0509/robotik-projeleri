import React, { useState } from 'react';

interface SignupFormProps {
  onSignup: (email: string, password: string, displayName: string) => void;
  onSwitchToLogin: () => void;
  error: string;
}

export default function SignupForm({ onSignup, onSwitchToLogin, error }: SignupFormProps) {
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
        </form>
        <a className="forgot-password" onClick={onSwitchToLogin}>
          Zaten hesabın var mı? Giriş Yap
        </a>
        {error && <p className="error-message">{error}</p>}
      </div>
    </div>
  );
}