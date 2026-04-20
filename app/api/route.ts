import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { email, type } = await request.json();

    if (!email || !type) {
      return NextResponse.json({ message: 'Missing email or type' }, { status: 400 });
    }

    console.log(`Received request to send email: ${type} to ${email}`);

    // Brevo API Çağrısı
    const response = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'api-key': process.env.BREVO_API_KEY || '',
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        sender: { name: "Robotik Projeleri", email: "info@siteniz.com" }, // Brevo'da onaylanmış gönderici adresiniz
        to: [{ email: email }],
        subject: type === 'reset' ? 'Şifre Sıfırlama İsteği' : 'Hesap İşlemleri',
        htmlContent: type === 'reset'
          ? `<h3>Şifre Sıfırlama</h3><p>Merhaba, ${email} adresi için şifre sıfırlama talebi aldık.</p>` 
          : `<h3>Bilgilendirme</h3><p>Hesabınızla ilgili bir işlem gerçekleştirildi.</p>`,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Brevo API Error:', errorData);
      return NextResponse.json({ message: 'Email could not be sent' }, { status: 500 });
    }

    return NextResponse.json({ message: 'E-posta başarıyla gönderildi! 🚀' }, { status: 200 });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}