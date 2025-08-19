export const runtime = 'nodejs';
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import bcrypt from 'bcrypt';

export async function GET() {
  try {
    const email = 'admin@fiamasam.mg';
    const hashedPassword = await bcrypt.hash('password123', 10);

    try {
      await prisma.user.update({
        where: { email },
        data: {
          hashedPassword,
          emailVerified: new Date(),
        },
      });
      return NextResponse.json({ ok: true, message: 'Mot de passe admin réinitialisé à password123.' });
    } catch (e: any) {
      // Si l'utilisateur n'existe pas, on le crée
      if (e?.code === 'P2025') {
        try {
          await prisma.user.create({
            data: {
              email,
              hashedPassword,
              nom: 'ADMIN',
              prenom: 'Super',
              role: 'ADMIN' as any,
              emailVerified: new Date(),
            },
          });
          return NextResponse.json({ ok: true, message: "Admin créé et mot de passe défini à password123." });
        } catch (createErr: any) {
          console.error('reset-admin create error:', createErr);
          return NextResponse.json({ ok: false, message: 'Erreur lors de la création de l’admin.', detail: createErr?.message ?? String(createErr) }, { status: 500 });
        }
      }
      console.error('reset-admin update error:', e);
      return NextResponse.json({ ok: false, message: 'Erreur lors de la réinitialisation.', detail: e?.message ?? String(e) }, { status: 500 });
    }
  } catch (outer: any) {
    console.error('reset-admin outer error:', outer);
    return NextResponse.json({ ok: false, message: 'Erreur lors de la réinitialisation.', detail: outer?.message ?? String(outer) }, { status: 500 });
  }
}


