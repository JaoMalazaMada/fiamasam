import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { updateArticleStatus, archiveArticle } from "@/actions/articleActions";
import { Badge } from "@/components/ui/badge";

export default async function AdminArticlesPage() {
  const session = await getServerSession(authOptions);
  if (!session || session.user?.role !== 'ADMIN') {
    redirect('/');
  }

  const articles = await prisma.article.findMany({
    orderBy: { updatedAt: 'desc' },
  });

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Gestion des Articles</h1>
        <Button asChild><Link href="/admin/articles/create">Créer un article</Link></Button>
      </div>
      <div className="bg-[var(--color-card)] text-[var(--color-card-foreground)] p-4 rounded-[var(--radius)] border border-[var(--color-border)]">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[var(--color-border)]">
              <th className="text-left p-2">Titre</th>
              <th className="text-left p-2">Statut</th>
              <th className="text-left p-2">Visibilité</th>
              <th className="text-left p-2">Dernière modif.</th>
              <th className="text-left p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {articles.map(article => (
              <tr key={article.id} className="border-b border-[var(--color-border)]">
                <td className="p-2">{article.title}</td>
                <td className="p-2">
                  <Badge variant={article.status === 'PUBLISHED' ? 'default' : 'secondary'}>{article.status}</Badge>
                </td>
                <td className="p-2">{article.visibility}</td>
                <td className="p-2">{new Date(article.updatedAt).toLocaleDateString('fr-FR')}</td>
                <td className="p-2">
                  <div className="flex gap-2">
                    <Button asChild variant="outline">
                      <Link href={`/admin/articles/${article.id}/edit`}>Éditer</Link>
                    </Button>
                    <form action={updateArticleStatus}>
                      <input type="hidden" name="id" value={article.id} />
                      <input type="hidden" name="status" value={article.status === 'PUBLISHED' ? 'DRAFT' : 'PUBLISHED'} />
                      <Button type="submit" variant={article.status === 'PUBLISHED' ? 'secondary' : 'default'}>
                        {article.status === 'PUBLISHED' ? 'Mettre en brouillon' : 'Publier'}
                      </Button>
                    </form>
                    <form action={archiveArticle}>
                      <input type="hidden" name="id" value={article.id} />
                      <Button type="submit" variant="destructive">Archiver</Button>
                    </form>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}


