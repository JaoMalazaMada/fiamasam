import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

type Visibility = 'PUBLIC' | 'MEMBRE' | 'FONDATEUR';

// Fonction pour extraire le texte brut du HTML
function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').trim();
}

const getAllowedVisibilities = (role?: string) => {
  const visibilities: Visibility[] = ['PUBLIC'];
  if (role === 'MEMBRE') {
    visibilities.push('MEMBRE');
  }
  if (role === 'FONDATEUR' || role === 'ADMIN') {
    visibilities.push('MEMBRE', 'FONDATEUR');
  }
  return visibilities;
};

export default async function ArticlesPage({
  searchParams,
}: {
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const session = await getServerSession(authOptions);
  const userRole = session?.user?.role as string | undefined;

  const allowedVisibilities = getAllowedVisibilities(userRole);

  const params = (await searchParams) || {};
  const rawQuery = params.q;
  const q = Array.isArray(rawQuery) ? rawQuery[0] : rawQuery || '';
  const rawPage = params.page;
  const page = Math.max(1, Number(Array.isArray(rawPage) ? rawPage[0] : rawPage) || 1);
  const rawSort = params.sort;
  const sort = (Array.isArray(rawSort) ? rawSort[0] : rawSort) === 'asc' ? 'asc' : 'desc';
  const rawVis = params.vis;
  const visParam = Array.isArray(rawVis) ? rawVis[0] : rawVis;
  const requestedVisibility = visParam === 'PUBLIC' || visParam === 'MEMBRE' || visParam === 'FONDATEUR' ? visParam : 'ALL';
  const perPage = 6;
  const skip = (page - 1) * perPage;

  const effectiveVisList = requestedVisibility === 'ALL'
    ? allowedVisibilities
    : allowedVisibilities.filter(v => v === requestedVisibility);

  const where = {
    status: 'PUBLISHED' as const,
    visibility: { in: effectiveVisList },
    ...(q
      ? {
          OR: [
            { title: { contains: q, mode: 'insensitive' as const } },
            { content: { contains: q, mode: 'insensitive' as const } },
          ],
        }
      : {}),
  };

  const [totalCount, articles] = await Promise.all([
    prisma.article.count({ where }),
    prisma.article.findMany({
      where,
      orderBy: { createdAt: sort },
      skip,
      take: perPage,
      include: {
        User: {
          select: { prenom: true, nom: true },
        },
      },
    }),
  ]);

  const totalPages = Math.max(1, Math.ceil(totalCount / perPage));

  return (
    <div className="max-w-screen-2xl mx-auto px-6 py-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
        <h1 className="text-3xl font-bold">Tous les articles</h1>
        <div className="flex gap-2">
          <form action="/articles" className="flex flex-wrap gap-2">
            <Input name="q" placeholder="Rechercher..." defaultValue={q} />
            <select
              name="vis"
              defaultValue={requestedVisibility}
              className="h-10 rounded-[var(--radius)] border border-[var(--color-border)] bg-[var(--color-background)] px-3 text-sm"
            >
              <option value="ALL">Toutes</option>
              <option value="PUBLIC">Public</option>
              <option value="MEMBRE">Membre</option>
              <option value="FONDATEUR">Fondateur</option>
            </select>
            <select
              name="sort"
              defaultValue={sort}
              className="h-10 rounded-[var(--radius)] border border-[var(--color-border)] bg-[var(--color-background)] px-3 text-sm"
            >
              <option value="desc">Plus récent</option>
              <option value="asc">Plus ancien</option>
            </select>
            <input type="hidden" name="page" value="1" />
            <Button type="submit">Appliquer</Button>
          </form>
          {userRole === 'ADMIN' && (
            <Link href="/admin/articles/create" className="bg-[var(--color-primary)] text-[var(--color-primary-foreground)] hover:opacity-90 px-4 py-2 rounded-[var(--radius)]">
              Créer un article
            </Link>
          )}
        </div>
      </div>

      <p className="text-[var(--color-foreground)]/60 mb-4">
        {totalCount} résultat{totalCount > 1 ? 's' : ''}{q ? ` pour "${q}"` : ''}
      </p>

      {articles.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((article) => (
            <Card key={article.id} className="flex flex-col">
              {article.imageUrl && (
                <img
                  src={article.imageUrl}
                  alt={article.title}
                  className="w-full h-48 object-cover rounded-t-[var(--radius)]"
                />
              )}
              <CardHeader>
                <Badge
                  variant={article.visibility === 'PUBLIC' ? 'secondary' : 'destructive'}
                  className="w-fit mb-2"
                >
                  {article.visibility}
                </Badge>
                <CardTitle>{article.title}</CardTitle>
                <CardDescription>
                  Par {article.User?.prenom || 'Auteur inconnu'} {article.User?.nom || ''} • {new Date(article.createdAt).toLocaleDateString('fr-FR')}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <p className="text-[var(--color-foreground)]/70">{stripHtml(article.content).substring(0, 150)}...</p>
              </CardContent>
              <CardFooter>
                <Link href={`/articles/${article.id}`} className="text-[var(--color-primary)] hover:underline">
                  Lire la suite →
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <p className="text-center text-[var(--color-foreground)]/60 mt-8">Aucun article trouvé.</p>
      )}

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-8">
          <Link
            href={`/articles?${new URLSearchParams({ q, vis: requestedVisibility, sort, page: String(Math.max(1, page - 1)) }).toString()}`}
            className="px-3 py-2 rounded-[var(--radius)] border border-[var(--color-border)] text-sm opacity-90 hover:opacity-100"
            aria-disabled={page === 1}
          >
            ← Précédent
          </Link>
          <span className="text-sm opacity-70">Page {page} / {totalPages}</span>
          <Link
            href={`/articles?${new URLSearchParams({ q, vis: requestedVisibility, sort, page: String(Math.min(totalPages, page + 1)) }).toString()}`}
            className="px-3 py-2 rounded-[var(--radius)] border border-[var(--color-border)] text-sm opacity-90 hover:opacity-100"
            aria-disabled={page === totalPages}
          >
            Suivant →
          </Link>
        </div>
      )}
    </div>
  );
}


