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
}
export default function LoginForm({onLogin,onGoogleLogin,onGithubLogin,onTwitterLogin,onFacebookLogin,onYahooLogin,onSwitchToSignup,onForgotPassword,error,isLoading}: LoginFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isResetMode, setIsResetMode] = useState(false);
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoading) onLogin(email, password, rememberMe);
  };
  if (isResetMode) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 p-4 font-sans">
        <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-10 space-y-8">
          <div className="text-center"><h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Şifre Sıfırla</h1><p className="text-gray-500 mt-3 text-sm">Bağlantı için e-postanızı girin.</p></div>
          <div className="space-y-5">
            <input type="email" placeholder="E-posta" className="w-full px-5 py-4 rounded-xl bg-gray-50 border border-gray-200 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all" value={email} onChange={(e)=>setEmail(e.target.value)} disabled={isLoading} />
            <button onClick={()=>onForgotPassword(email)} disabled={isLoading||!email} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-500/30 transition-all active:scale-[0.98] disabled:opacity-50">{isLoading?"Gönderiliyor...":"Mail Gönder"}</button>
            <button onClick={()=>setIsResetMode(false)} className="w-full text-blue-600 font-semibold text-sm hover:text-blue-800 transition-colors">Geri Dön</button>
          </div>
          {error && <p className="bg-red-50 text-red-600 p-4 rounded-xl text-sm font-semibold border border-red-100 text-center">{error}</p>}
        </div>
      </div>
    );
  }
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 p-4 font-sans">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-10 space-y-8 border border-gray-100">
        <div className="text-center"><h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Giriş Yap</h1><p className="text-gray-500 mt-2 text-sm">Robotik Mühendisliği Portalı</p></div>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">E-Posta</label>
            <input type="email" placeholder="mail@example.com" className="w-full px-5 py-4 rounded-xl bg-gray-50 border border-gray-200 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all" value={email} onChange={(e)=>setEmail(e.target.value)} disabled={isLoading} required />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Şifre</label>
            <div className="relative">
              <input type={showPassword?"text":"password"} placeholder="••••••••" className="w-full px-5 py-4 rounded-xl bg-gray-50 border border-gray-200 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all" value={password} onChange={(e)=>setPassword(e.target.value)} disabled={isLoading} required />
              <button type="button" className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors" onClick={()=>setShowPassword(!showPassword)} disabled={isLoading}>{showPassword?"👁️‍🗨️":"👁️"}</button>
            </div>
          </div>
          <div className="flex items-center justify-between px-1">
            <label className="flex items-center space-x-3 cursor-pointer group"><input type="checkbox" className="w-5 h-5 rounded-lg border-gray-300 text-blue-600 focus:ring-blue-500 transition-all cursor-pointer" checked={rememberMe} onChange={(e)=>setRememberMe(e.target.checked)} disabled={isLoading} /><span className="text-sm font-medium text-gray-600 group-hover:text-gray-900 transition-colors">Beni Hatırla</span></label>
            <button type="button" onClick={()=>setIsResetMode(true)} className="text-sm font-semibold text-blue-600 hover:text-blue-800 transition-colors">Şifremi Unuttum</button>
          </div>
          <div className="flex justify-center"><div id="recaptcha-container" className="scale-90 origin-center"></div></div>
          <button type="submit" disabled={isLoading} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-500/30 transition-all active:scale-[0.98] disabled:opacity-50">{isLoading?"İşleniyor...":"Giriş Yap"}</button>
        </form>
        <div className="relative"><div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-100"></div></div><div className="relative flex justify-center text-xs uppercase font-bold tracking-widest"><span className="px-4 bg-white text-gray-400">Veya şununla devam et</span></div></div>
        <div className="grid grid-cols-5 gap-3">
          <SocialIconBtn onClick={onGoogleLogin} disabled={isLoading} icon="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" label="Google" />
          <SocialIconBtn onClick={onGithubLogin} disabled={isLoading} icon="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/github.svg" label="GitHub" />
          <SocialIconBtn onClick={onTwitterLogin} disabled={isLoading} icon="https://upload.wikimedia.org/wikipedia/commons/5/53/X_logo_2023_original.svg" label="X" />
          <SocialIconBtn onClick={onFacebookLogin} disabled={isLoading} icon="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/facebook.svg" label="Facebook" />
          <SocialIconBtn onClick={onYahooLogin} disabled={isLoading} icon="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/yahoo.svg" label="Yahoo" />
        </div>
        <p className="text-center text-sm text-gray-500 pt-2">Hesabın yok mu? <button onClick={onSwitchToSignup} className="text-blue-600 font-bold hover:underline">Kaydol</button></p>
        {error && <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm font-semibold border border-red-100 text-center animate-pulse">{error}</div>}
      </div>
    </div>
  );
}
function SocialIconBtn({onClick,disabled,icon,label}: {onClick:()=>void,disabled:boolean,icon:string,label:string}) {
  return (
    <button type="button" title={label} onClick={onClick} disabled={disabled} className="flex items-center justify-center p-3 rounded-xl border border-gray-100 hover:bg-gray-50 hover:border-gray-200 transition-all active:scale-90 disabled:opacity-50"><img src={icon} alt={label} className="w-6 h-6" /></button>
  );
}