// Template d'email avec logo et styling

interface EmailTemplateOptions {
  title: string;
  content: string;
  buttonText?: string;
  buttonUrl?: string;
  footerText?: string;
}

export function createEmailTemplate({
  title,
  content,
  buttonText,
  buttonUrl,
  footerText = "Cet email a été envoyé par Fi.A.Ma.Sa.M - Fikambanan'Ampanja Manjaka Sakalava Eto Madagasikara"
}: EmailTemplateOptions): string {
  const baseUrl = (process.env.NEXT_PUBLIC_URL || process.env.NEXTAUTH_URL || 'http://localhost:3001').replace(/\/$/, '');
  const logoUrl = `${baseUrl}/logo/logo-400-200-corail.webp`;

  return `
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    <style>
        body { 
            font-family: Arial, sans-serif; 
            line-height: 1.6; 
            color: #333; 
            margin: 0; 
            padding: 0;
            background-color: #f9f9f9;
        }
        .container { 
            max-width: 600px; 
            margin: 0 auto; 
            background: white; 
            border-radius: 8px; 
            overflow: hidden;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        .header { 
            background: linear-gradient(135deg, #eb6864, #f29c9a); 
            padding: 30px 20px; 
            text-align: center; 
        }
        .logo { 
            max-width: 200px; 
            height: auto; 
            margin-bottom: 10px;
        }
        .header h1 { 
            color: white; 
            margin: 0; 
            font-size: 24px; 
            font-weight: bold;
        }
        .content { 
            padding: 30px 20px; 
        }
        .content p { 
            margin-bottom: 15px; 
            font-size: 16px;
        }
        .button { 
            display: inline-block; 
            background: #eb6864; 
            color: white !important; 
            padding: 12px 30px; 
            text-decoration: none; 
            border-radius: 5px; 
            font-weight: bold;
            margin: 20px 0;
        }
        .button:hover { 
            background: #d85652; 
        }
        .footer { 
            background: #f8f9fa; 
            padding: 20px; 
            text-align: center; 
            font-size: 12px; 
            color: #666; 
            border-top: 1px solid #eee;
        }
        .code { 
            background: #f1f3f4; 
            padding: 10px; 
            border-radius: 4px; 
            font-family: monospace; 
            word-break: break-all;
            margin: 10px 0;
        }
        @media (max-width: 600px) {
            .container { margin: 10px; }
            .header, .content { padding: 20px 15px; }
            .logo { max-width: 150px; }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <img src="${logoUrl}" alt="Fi.A.Ma.Sa.M Logo" class="logo">
            <h1>${title}</h1>
        </div>
        <div class="content">
            ${content}
            ${buttonText && buttonUrl ? `
            <div style="text-align: center; margin: 30px 0;">
                <a href="${buttonUrl}" class="button">${buttonText}</a>
            </div>
            ` : ''}
        </div>
        <div class="footer">
            <p>${footerText}</p>
            <p>Si vous avez des questions, contactez-nous à l'adresse : ${process.env.EMAIL_FROM || process.env.SMTP_USER}</p>
        </div>
    </div>
</body>
</html>
  `.trim();
}

// Template pour email de vérification
export function createVerificationEmailTemplate(verificationLink: string): { html: string; text: string } {
  const html = createEmailTemplate({
    title: "Vérification de votre compte",
    content: `
      <p>Bienvenue dans notre association !</p>
      <p>Pour finaliser votre inscription, veuillez vérifier votre adresse email en cliquant sur le bouton ci-dessous :</p>
      <p>Si le bouton ne fonctionne pas, copiez et collez ce lien dans votre navigateur :</p>
      <div class="code">${verificationLink}</div>
      <p><strong>Ce lien expirera dans 24 heures.</strong></p>
    `,
    buttonText: "Vérifier mon email",
    buttonUrl: verificationLink
  });

  const text = `Bienvenue dans notre association !

Pour finaliser votre inscription, veuillez vérifier votre adresse email en ouvrant ce lien :
${verificationLink}

Ce lien expirera dans 24 heures.

Si vous n'êtes pas à l'origine de cette inscription, ignorez cet email.

---
Fi.A.Ma.Sa.M - Fikambanan'Ampanja Manjaka Sakalava Eto Madagasikara`;

  return { html, text };
}

// Template pour réinitialisation de mot de passe
export function createPasswordResetEmailTemplate(resetLink: string): { html: string; text: string } {
  const html = createEmailTemplate({
    title: "Réinitialisation de votre mot de passe",
    content: `
      <p>Vous avez demandé une réinitialisation de votre mot de passe.</p>
      <p>Cliquez sur le bouton ci-dessous pour définir un nouveau mot de passe :</p>
      <p>Si le bouton ne fonctionne pas, copiez et collez ce lien dans votre navigateur :</p>
      <div class="code">${resetLink}</div>
      <p><strong>Ce lien expirera dans une heure.</strong></p>
      <p>Si vous n'êtes pas à l'origine de cette demande, ignorez cet email. Votre mot de passe actuel reste inchangé.</p>
    `,
    buttonText: "Réinitialiser mon mot de passe",
    buttonUrl: resetLink
  });

  const text = `Vous avez demandé une réinitialisation de votre mot de passe.

Ouvrez ce lien pour définir un nouveau mot de passe :
${resetLink}

Ce lien expirera dans une heure.

Si vous n'êtes pas à l'origine de cette demande, ignorez cet email. Votre mot de passe actuel reste inchangé.

---
Fi.A.Ma.Sa.M - Fikambanan'Ampanja Manjaka Sakalava Eto Madagasikara`;

  return { html, text };
}
