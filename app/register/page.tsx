'use client';

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { registerUser } from '@/actions/authActions';

function SubmitButton() {
  const { pending } = useFormStatus();
  return <Button type="submit" disabled={pending} className="w-full">{pending ? 'Création...' : 'Créer mon compte'}</Button>;
}

export default function RegisterPage() {
  const [state, formAction] = useActionState(registerUser as any, { success: false, message: '' } as any);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl">Créer un compte</CardTitle>
          <CardDescription>Rejoignez notre communauté.</CardDescription>
        </CardHeader>
        <CardContent>
          {state.success ? (
            <div className="text-center text-green-700 bg-green-100 p-4 rounded-md">
              <p>{state.message}</p>
            </div>
          ) : (
            <form action={formAction} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div><Label htmlFor="prenom">Prénom</Label><Input id="prenom" name="prenom" required /></div>
                <div><Label htmlFor="nom">Nom</Label><Input id="nom" name="nom" required /></div>
              </div>
              <div><Label htmlFor="email">Email</Label><Input id="email" name="email" type="email" required /></div>
              <div><Label htmlFor="password">Mot de passe</Label><Input id="password" name="password" type="password" required /></div>
              {state.message && <p className="text-[var(--color-destructive)]">{state.message}</p>}
              <SubmitButton />
            </form>
          )}
          <div className="mt-4 text-center text-sm">
            <Link href="/login" className="underline text-[var(--color-foreground)]/70">Déjà un compte ? Connectez-vous</Link>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}


