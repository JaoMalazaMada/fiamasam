// src/actions/authActions.ts
'use server';

import prisma from '@/lib/prisma';
import bcrypt from 'bcrypt';
import { z } from 'zod';
import crypto from 'crypto';
import { sendEmail } from '@/lib/mailer';
import { createVerificationEmailTemplate, createPasswordResetEmailTemplate } from '@/lib/email-template';
import { redirect } from 'next/navigation';

const RegisterSchema = z.object({
  prenom: z.string().min(2, "Le prénom est trop court"),
  nom: z.string().min(2, "Le nom est trop court"),
  email: z.string().email("L'adresse email est invalide"),
  password: z.string().min(8, "Le mot de passe doit faire au moins 8 caractères"),
});

export async function registerUser(prevState: any, formData: FormData) {
  const validatedFields = RegisterSchema.safeParse(Object.fromEntries(formData.entries()));

  if (!validatedFields.success) {
    // Transforme les erreurs de Zod en un message simple
    return { success: false, message: validatedFields.error.errors[0].message };
  }

  const { prenom, nom, email, password } = validatedFields.data;

  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    return { success: false, message: "Un compte avec cet email existe déjà." };
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const verificationToken = crypto.randomBytes(32).toString('hex');

  await prisma.user.create({
    data: {
      prenom,
      nom,
      email,
      hashedPassword,
      verificationToken,
    },
  });

  const baseUrlVerify = (process.env.NEXT_PUBLIC_URL || process.env.NEXTAUTH_URL || 'http://localhost:3001').replace(/\/$/, '');
  const verificationLink = `${baseUrlVerify}/verify-email?token=${verificationToken}`;
  
  const { html, text } = createVerificationEmailTemplate(verificationLink);
  
  try {
    await sendEmail({
      to: email,
      subject: "Vérifiez votre adresse email - Fi.A.Ma.Sa.M",
      html,
      text,
    });
  } catch (error) {
    // Même si l'email ne part pas, on ne bloque pas l'utilisateur
    console.error("Échec de l'envoi de l'email de vérification : ", error);
    // On pourrait ajouter ici une logique pour renvoyer l'email plus tard
  }
  
  // N'utilisez pas redirect ici, renvoyez un état de succès.
  return { success: true, message: "Compte créé ! Un email de vérification vous a été envoyé. Veuillez consulter votre boîte de réception." };
}

// --- Action pour demander une réinitialisation ---
export async function forgotPassword(prevState: any, formData: FormData) {
  const email = formData.get('email') as string;
  if (!email) return { success: false, message: "L'email est requis." };
  
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    return { success: true, message: "Si un compte existe pour cet email, un lien de réinitialisation a été envoyé." };
  }
  
  const passwordResetToken = crypto.randomBytes(32).toString('hex');
  const passwordResetExpires = new Date(Date.now() + 3600000);

  await prisma.user.update({
    where: { email },
    data: { passwordResetToken, passwordResetExpires },
  });

  const baseUrl = (process.env.NEXT_PUBLIC_URL || process.env.NEXTAUTH_URL || 'http://localhost:3001').replace(/\/$/, '');
  const resetLink = `${baseUrl}/reset-password?token=${passwordResetToken}`;
  
  const { html, text } = createPasswordResetEmailTemplate(resetLink);
  
  await sendEmail({
    to: email,
    subject: "Réinitialisation de votre mot de passe - Fi.A.Ma.Sa.M",
    html,
    text,
  });

  return { success: true, message: "Si un compte existe pour cet email, un lien de réinitialisation a été envoyé." };
}

const ResetPasswordSchema = z.object({
  password: z.string().min(8, "Le mot de passe doit faire au moins 8 caractères"),
  token: z.string().min(1, "Jeton manquant"),
});

export async function resetPassword(prevState: any, formData: FormData) {
  const validatedFields = ResetPasswordSchema.safeParse(Object.fromEntries(formData.entries()));
  if (!validatedFields.success) {
    return { success: false, message: validatedFields.error.errors[0].message };
  }

  const { password, token } = validatedFields.data;
  
  const user = await prisma.user.findFirst({
    where: {
      passwordResetToken: token,
      passwordResetExpires: { gte: new Date() },
    },
  });

  if (!user) {
    return { success: false, message: "Ce jeton est invalide ou a expiré." };
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  await prisma.user.update({
    where: { id: user.id },
    data: {
      hashedPassword,
      passwordResetToken: null,
      passwordResetExpires: null,
    },
  });

  redirect('/login');
}