import prisma from '@/lib/prisma';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, FileText, HelpCircle, Edit } from 'lucide-react';
import Link from 'next/link';

export default async function AdminDashboard() {
  const [userCount, publishedArticleCount, draftArticleCount, questionCount] = await Promise.all([
    prisma.user.count(),
    prisma.article.count({ where: { status: 'PUBLISHED' as any } }),
    prisma.article.count({ where: { status: 'DRAFT' as any } }),
    prisma.question.count(),
  ]);

  return (
    <div className="mt-8 space-y-6">
      <div>
        <h2 className="text-2xl font-semibold mb-4">Statistiques du site</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Utilisateurs inscrits</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{userCount}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Articles publiés</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{publishedArticleCount}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Articles en brouillon</CardTitle>
              <Edit className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{draftArticleCount}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Questions du QCM</CardTitle>
              <HelpCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{questionCount}</div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-semibold mb-4">Actions rapides</h2>
        <div className="flex space-x-4">
          <Button asChild><Link href="/admin/articles">Gérer les Articles</Link></Button>
          <Button asChild variant="secondary"><Link href="/admin/qcm">Gérer le QCM</Link></Button>
          <Button asChild variant="outline"><Link href="/admin/users">Gérer les Utilisateurs</Link></Button>
        </div>
      </div>
    </div>
  );
}


