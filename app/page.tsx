"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import SignupForm from '../SignupForm';
import LoginForm from '../LoginForm';
import { auth, googleProvider, githubProvider, twitterProvider, facebookProvider, yahooProvider } from './firebase';
import { 
  createUserWithEmailAndPassword, 
  updateProfile, 
  signInWithPopup, 
  getAdditionalUserInfo, 
  onAuthStateChanged, 
  setPersistence, 
  browserLocalPersistence, 
  browserSessionPersistence, 
  sendEmailVerification,
  signInWithEmailAndPassword,
  sendPasswordResetEmail
} from 'firebase/auth';

export default function SignupPage() {
const [error, setError] = useState<React.ReactNode>('');
const router = useRouter();
const [isLoading, setIsLoading] = useState(false);
const [isLogin, setIsLogin] = useState(true);
const [isRecaptchaResolved, setIsRecaptchaResolved] = useState(false);

useEffect(() => {
const unsubscribe = onAuthStateChanged(auth, (user) => {
if (user) router.push('/');
});
return () => unsubscribe();
}, [router]);
const handleEmailSignup = async (email: string, password: string, displayName: string) => {
setIsLoading(true);
try {
await setPersistence(auth, browserLocalPersistence);
const userCredential = await createUserWithEmailAndPassword(auth, email, password);
await updateProfile(userCredential.user, { displayName });
await sendEmailVerification(userCredential.user);
setError('');
alert("Hesabınız oluşturuldu ve doğrulama e-postası gönderildi. Lütfen e-postanızı onaylayın. 📧");
router.push('/');
} catch (err: any) {
setError(err.code === 'auth/email-already-in-use' ? 'Bu e-posta zaten kullanımda.' : 'Kayıt sırasında bir hata oluştu.');
} finally {
setIsLoading(false);
}
};

const handleEmailLogin = async (email: string, password: string, rememberMe: boolean) => {
  setIsLoading(true);
  try {
    // Beni hatırla seçeneğine göre oturum kalıcılığını ayarla
    await setPersistence(auth, rememberMe ? browserLocalPersistence : browserSessionPersistence);
    await signInWithEmailAndPassword(auth, email, password);
    setError('');
  } catch (err: any) {
    setError('Giriş başarısız. Lütfen e-posta veya şifrenizi kontrol edin.');
  } finally {
    setIsLoading(false);
  }
};

const handleForgotPassword = (email: string) => {
  sendPasswordResetEmail(auth, email)
    .then(() => alert("Şifre sıfırlama bağlantısı e-postanıza gönderildi!"))
    .catch(() => setError("Şifre sıfırlama e-postası gönderilemedi."));
};

const handleSocialSignup = async (provider: any, providerName: string) => {
setIsLoading(true);
try {
await setPersistence(auth, browserLocalPersistence);
const result = await signInWithPopup(auth, provider);
const isNewUser = getAdditionalUserInfo(result)?.isNewUser;
if (!isNewUser && result.user.email) {
setError(
<span>
Bu e-posta adresiyle zaten bir hesap mevcut. Lütfen{' '}
<a onClick={() => router.push('/')} style={{color: '#0078d7', cursor:'pointer', fontWeight:'bold', textDecoration:'underline'}}>Giriş Yap</a>
ın.
</span>
);
} else {
router.push('/');
}
} catch (err: any) {
let errorMessage = `${providerName} ile kayıt yapılamadı.`;
if (err.code) {
switch (err.code) {
case 'auth/popup-closed-by-user':
errorMessage = 'Kayıt penceresi kapatıldı.';
break;
case 'auth/account-exists-with-different-credential':
errorMessage = `Bu e-posta adresi farklı bir sağlayıcı ile zaten kayıtlı.`;
break;
default:
errorMessage = `${providerName} hatası: ${err.message}`;
}
}
setError(errorMessage);
} finally {
setIsLoading(false);
}
};

if (isLogin) {
  return (
    <LoginForm
      onLogin={handleEmailLogin}
      onGoogleLogin={() => handleSocialSignup(googleProvider, 'Google')}
      onGithubLogin={() => handleSocialSignup(githubProvider, 'GitHub')}
      onTwitterLogin={() => handleSocialSignup(twitterProvider, 'X')}
      onFacebookLogin={() => handleSocialSignup(facebookProvider, 'Facebook')}
      onYahooLogin={() => handleSocialSignup(yahooProvider, 'Yahoo')}
      onSwitchToSignup={() => setIsLogin(false)}
      onForgotPassword={handleForgotPassword}
      error={error}
      isLoading={isLoading}
    />
  );
}

return (
<SignupForm 
onSignup={handleEmailSignup} 
onGoogleLogin={() => handleSocialSignup(googleProvider, 'Google')}
onGithubLogin={() => handleSocialSignup(githubProvider, 'GitHub')}
onTwitterLogin={() => handleSocialSignup(twitterProvider, 'X')}
onFacebookLogin={() => handleSocialSignup(facebookProvider, 'Facebook')}
onYahooLogin={() => handleSocialSignup(yahooProvider, 'Yahoo')}
onSwitchToLogin={() => setIsLogin(true)} 
error={error} 
isLoading={isLoading}
isRecaptchaResolved={isRecaptchaResolved}
/>
);
}