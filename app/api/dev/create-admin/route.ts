export const runtime = 'nodejs';
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import bcrypt from 'bcrypt';

export async function GET() {
  try {
    const email = 'admin@fiamasam.mg';
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json({ ok: true, message: 'Admin déjà présent.' });
    }

    const hashedPassword = await bcrypt.hash('password123', 10);
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
    return NextResponse.json({ ok: true, message: 'Admin créé (password123).' });
  } catch (e: any) {
    return NextResponse.json({ ok: false, message: 'Erreur création admin.', detail: e?.message ?? String(e) }, { status: 500 });
  }
}


