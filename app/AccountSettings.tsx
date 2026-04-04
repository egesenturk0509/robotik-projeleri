import React, { useState } from 'react';

interface AccountSettingsProps {
  onBack: () => void;
  onLogout: () => void;
  userData: {
    email: string;
    displayName: string;
  };
  onSave: (newData: { email: string; password?: string; displayName: string }) => void;
}

export default function AccountSettings({ onBack, onLogout, userData, onSave }: AccountSettingsProps) {
  const [email, setEmail] = useState(userData.email);
  const [displayName, setDisplayName] = useState(userData.displayName);
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ email, displayName, password: password || undefined });
    alert('Bilgiler başarıyla güncellendi!');
  };

  return (
    <div className="detail-view">
      <button className="btn-back" onClick={onBack}>⬅ Geri</button>
      <h1 className="mb-25">Hesap Ayarları</h1>
      
      <form onSubmit={handleSubmit} className="form-group">
        <div className="form-group">
          <label htmlFor="displayName" className="form-label">
            Görünen Ad
          </label>
          <input 
            id="displayName"
            type="text" 
            className="login-input" 
            value={displayName} 
            onChange={(e) => setDisplayName(e.target.value)} 
            required
            placeholder="Adınızı giriniz"
          />
        </div>

        <div className="form-group">
          <label htmlFor="email" className="form-label">
            E-posta
          </label>
          <input 
            id="email"
            type="email" 
            className="login-input" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required
            placeholder="E-posta adresinizi giriniz"
          />
        </div>

        <div className="form-group">
          <label htmlFor="newPassword" className="form-label">
            Yeni Şifre
          </label>
          <input 
            id="newPassword"
            type="password" 
            className="login-input" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            placeholder="Değiştirmek istemiyorsanız boş bırakın"
          />
        </div>

        <div className="form-flex-row">
          <button type="submit" className="btn-save">Kaydet</button>
          <button type="button" onClick={onLogout} className="btn-logout">Çıkış Yap</button>
        </div>
      </form>
    </div>
  );
}