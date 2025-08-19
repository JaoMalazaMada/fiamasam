import { getServerSession } from 'next-auth';
import { notFound } from 'next/navigation';
import prisma from '@/lib/prisma';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { Badge } from '@/components/ui/badge';
import type { Metadata } from 'next';

type Visibility = 'PUBLIC' | 'MEMBRE' | 'FONDATEUR';

const hasAccess = (articleVisibility: Visibility, userRole?: string) => {
  if (articleVisibility === 'PUBLIC') return true;
  if (articleVisibility === 'MEMBRE' && (userRole === 'MEMBRE' || userRole === 'FONDATEUR' || userRole === 'ADMIN')) return true;
  if (articleVisibility === 'FONDATEUR' && (userRole === 'FONDATEUR' || userRole === 'ADMIN')) return true;
  return false;
};

export default async function ArticleDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const session = await getServerSession(authOptions);
  const userRole = session?.user?.role as string | undefined;

  const article = await prisma.article.findUnique({
    where: { id: parseInt(id, 10), status: 'PUBLISHED' as any },
    include: {
      User: {
        select: { prenom: true, nom: true },
      },
    },
  });

  if (!article) {
    notFound();
  }

  if (!hasAccess(article.visibility as Visibility, userRole)) {
    notFound();
  }

  return (
    <article className="container mx-auto px-6 py-8 max-w-4xl">
      {article.imageUrl && (
        <img
          src={article.imageUrl}
          alt={article.title}
          className="w-full h-80 object-cover rounded-[var(--radius)] mb-6"
        />
      )}
      <div className="mb-6">
        <Badge
          variant={article.visibility === 'PUBLIC' ? 'secondary' : 'destructive'}
          className="mb-2"
        >
          {article.visibility}
        </Badge>
        <h1 className="text-4xl font-extrabold text-foreground mb-2">
          {article.title}
        </h1>
        <p className="text-muted-foreground">
          Publié par {article.User?.prenom ?? ''} {article.User?.nom ?? ''} le {new Date(article.createdAt).toLocaleDateString('fr-FR')}
        </p>
      </div>

      <div 
        className="article-content prose prose-lg max-w-none"
        dangerouslySetInnerHTML={{ __html: article.content }}
      />
    </article>
  );
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const article = await prisma.article.findUnique({ where: { id: parseInt(id, 10) } });
  if (!article) {
    return { title: 'Article non trouvé' };
  }
  return {
    title: article.metaTitle || article.title,
    description: article.metaDescription || article.content.substring(0, 160),
  };
}


