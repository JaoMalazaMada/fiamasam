import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import EditArticleForm from "@/components/admin/EditArticleForm";

export default async function EditArticlePage({ params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session || session.user?.role !== 'ADMIN') {
    redirect('/');
  }

  const { id } = await params;
  const articleId = parseInt(id, 10);
  const article = await prisma.article.findUnique({ where: { id: articleId } });
  if (!article) {
    redirect('/admin/articles');
  }

  return (
    <div className="container mx-auto px-6 py-8">
      <h1 className="text-3xl font-bold text-[var(--color-foreground)] mb-4">Modifier l'article</h1>
      <EditArticleForm
        id={article.id}
        title={article.title}
        content={article.content}
        visibility={article.visibility as any}
        status={article.status as any}
        imageUrl={article.imageUrl ?? ''}
        metaTitle={article.metaTitle ?? ''}
        metaDescription={article.metaDescription ?? ''}
      />
    </div>
  );
}


