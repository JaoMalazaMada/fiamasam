'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

export default function Header() {
  const { data: session, status } = useSession();
  const isLoading = status === 'loading';
  const pathname = usePathname();
  const isAuthenticated = !!session?.user;
  const userRole = (session?.user as any)?.role as string | undefined;
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <header className="bg-[var(--color-primary)] text-[var(--color-primary-foreground)] shadow-sm">
      <nav className="max-w-screen-2xl mx-auto px-6 py-4 flex justify-between items-center">
        <Link href="/" className="flex items-center gap-2 text-xl font-bold hover:opacity-90">
          <Image src="/favicon/favicon-32x32.png" alt="" width={24} height={24} className="h-6 w-6" />
          <span>Fi.A.Ma.Sa.M</span>
        </Link>

        <div className="flex items-center gap-4">
          <Link
            href="/"
            className={cn(
              "hover:opacity-90 opacity-80",
              pathname === "/" && "opacity-100 underline underline-offset-8"
            )}
          >
            Accueil
          </Link>
          <Link
            href="/articles"
            className={cn(
              "hover:opacity-90 opacity-80",
              pathname?.startsWith("/articles") && "opacity-100 underline underline-offset-8"
            )}
          >
            Articles
          </Link>
          <Link
            href="/qcm"
            className={cn(
              "hover:opacity-90 opacity-80",
              pathname?.startsWith("/qcm") && "opacity-100 underline underline-offset-8"
            )}
          >
            QCM
          </Link>
          {mounted && isAuthenticated && (
            <Link
              href="/dashboard"
              className={cn(
                "hover:opacity-90 opacity-80",
                pathname?.startsWith("/dashboard") && "opacity-100 underline underline-offset-8"
              )}
            >
              Mon espace
            </Link>
          )}
          {mounted && userRole === 'ADMIN' && (
            <Link
              href="/admin/articles"
              className={cn(
                "hover:opacity-90 opacity-80",
                pathname?.startsWith("/admin") && "opacity-100 underline underline-offset-8"
              )}
            >
              Admin
            </Link>
          )}

          <div className="w-px h-6 bg-[var(--color-primary-foreground)]/30" />

          {isLoading ? (
            <div className="animate-pulse bg-[var(--color-primary-foreground)]/30 h-8 w-24 rounded-[var(--radius)]" />
          ) : session ? (
            <>
              <span>Bienvenue, {(session.user as any)?.nom || 'Utilisateur'}</span>
              <button
                onClick={() => signOut({ callbackUrl: '/' })}
                className="bg-[var(--color-destructive)] text-[var(--color-destructive-foreground)] hover:opacity-90 font-bold py-2 px-4 rounded-[var(--radius)]"
              >
                Déconnexion
              </button>
            </>
          ) : (
            <Link
              href="/login"
              className="bg-[var(--color-secondary)] text-[var(--color-secondary-foreground)] hover:opacity-90 font-bold py-2 px-4 rounded-[var(--radius)]"
            >
              Connexion
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
}


