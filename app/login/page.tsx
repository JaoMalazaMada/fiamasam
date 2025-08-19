// src/app/login/page.tsx
'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    const result = await signIn('credentials', {
      redirect: false, // Très important pour gérer les erreurs manuellement
      email,
      password,
    });

    setIsLoading(false);

    if (result?.error) {
      // Afficher le message d'erreur exact envoyé par la fonction 'authorize'
      setError(result.error);
    } else if (result?.ok) {
      // Si la connexion réussit, rediriger vers le dashboard
      router.push('/dashboard');
      router.refresh(); // Force un rafraîchissement des données serveur
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl">Connexion</CardTitle>
          <CardDescription>Entrez vos identifiants pour accéder à votre espace.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Adresse Email</Label>
              <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Mot de passe</Label>
              <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>

            {error && (
              <div className="bg-destructive/10 text-destructive p-3 rounded-md">
                <p>{error}</p>
              </div>
            )}

            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading ? 'Connexion en cours...' : 'Se connecter'}
            </Button>
          </form>
          <div className="mt-4 text-center text-sm">
            <Link href="/forgot-password" className="underline text-muted-foreground hover:text-primary">Mot de passe oublié ?</Link>
            <span className="text-muted-foreground mx-2">|</span>
            <Link href="/register" className="underline text-muted-foreground hover:text-primary">Pas encore de compte ?</Link>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}