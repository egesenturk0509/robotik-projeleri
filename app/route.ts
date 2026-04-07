import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { email, projectName, projectDescription, imageUrl } = await req.json();

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f7f6; margin: 0; padding: 40px 0; }
          .wrapper { width: 100%; table-layout: fixed; background-color: #f4f7f6; }
          .main { background-color: #ffffff; margin: 0 auto; width: 100%; max-width: 600px; border-spacing: 0; color: #333333; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.05); border: 1px solid #e1e4e8; }
          .header { background-color: #0078d7; padding: 40px 20px; text-align: center; color: #ffffff; }
          .header h1 { margin: 0; font-size: 26px; font-weight: 700; color: #ffffff; }
          .content { padding: 40px 30px; }
          .description { font-size: 16px; line-height: 1.6; color: #555555; margin-bottom: 25px; }
          .image-container { margin-bottom: 25px; text-align: center; }
          .project-img { width: 100%; max-width: 540px; height: auto; border-radius: 8px; border: 1px solid #eee; }
          .footer { padding: 20px; text-align: center; font-size: 12px; color: #999; background-color: #fafbfc; border-top: 1px solid #eee; }
          .btn { background-color: #0078d7; color: #ffffff !important; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 600; display: inline-block; }
        </style>
      </head>
      <body>
        <div class="wrapper">
          <table class="main" align="center">
            <tr><td class="header"><h1>${projectName}</h1></td></tr>
            <tr><td class="content">
              <p class="description">${projectDescription || ''}</p>
              ${imageUrl ? `<div class="image-container"><img src="${imageUrl}" class="project-img" alt="${projectName}" /></div>` : ''}
              <div style="text-align: center;"><a href="https://robotik-projelerim.vercel.app" class="btn">Portalı Ziyaret Et</a></div>
            </td></tr>
            <tr><td class="footer">Bu mail Robotik Mühendisliği Portalı üzerinden gönderilmiştir.</td></tr>
          </table>
        </div>
      </body>
      </html>
    `;

    const response = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'api-key': process.env.BREVO_API_KEY as string,
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        sender: { name: 'Robotik Portalı', email: 'ege@robotik.com' },
        to: [{ email }],
        subject: `Proje Detayı: ${projectName}`,
        htmlContent,
      }),
    });

    if (!response.ok) return NextResponse.json({ error: 'Brevo API Error' }, { status: response.status });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Server Error' }, { status: 500 });
  }
}