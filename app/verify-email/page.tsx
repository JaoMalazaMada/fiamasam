import prisma from '@/lib/prisma';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default async function VerifyEmailPage({ searchParams }: { searchParams: { token?: string } }) {
  const { token } = searchParams;

  if (!token) {
    return <div>Token manquant.</div>;
  }

  const user = await prisma.user.findUnique({ where: { verificationToken: token } });

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Card className="w-full max-w-md text-center">
          <CardHeader><CardTitle className="text-[var(--color-destructive)]">Erreur de vérification</CardTitle></CardHeader>
          <CardContent>
            <p>Ce jeton de vérification est invalide ou a déjà été utilisé.</p>
            <Button asChild className="mt-4"><Link href="/register">Créer un nouveau compte</Link></Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  await prisma.user.update({
    where: { id: user.id },
    data: { emailVerified: new Date(), verificationToken: null },
  });

  return (
    <div className="flex min-h-screen items-center justify-center">
      <Card className="w-full max-w-md text-center">
        <CardHeader><CardTitle className="text-[var(--color-primary)]">Email vérifié !</CardTitle></CardHeader>
        <CardContent>
          <p>Merci ! Votre compte est maintenant activé.</p>
          <Button asChild className="mt-4"><Link href="/login">Se connecter</Link></Button>
        </CardContent>
      </Card>
    </div>
  );
}


