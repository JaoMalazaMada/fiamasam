import prisma from '@/lib/prisma';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { HeartHandshake, BookOpen, TrendingUp } from 'lucide-react';

// Fonction pour extraire le texte brut du HTML
function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').trim();
}

export default async function HomePage() {
  const latestArticles = await prisma.article.findMany({
    where: {
      status: 'PUBLISHED',
      visibility: 'PUBLIC',
    },
    take: 3,
    orderBy: {
      createdAt: 'desc',
    },
  });

  return (
    <>
      {/* Section Héros */}
      <section className="text-center py-24 md:py-28 bg-card border-b">
        <div className="container mx-auto px-6">
          <h1 className="text-5xl font-extrabold tracking-tight">Réveiller, Promouvoir et Unir</h1>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
            L'association Fi.A.Ma.Sa.M se consacre à la solidarité des Mpanjaka Manjaka Sakalava et à la promotion des cultures traditionnelles Royales.
          </p>
          <Button asChild size="lg" className="mt-8">
            <Link href="/articles">Découvrir nos actions</Link>
          </Button>
        </div>
      </section>

      {/* Section Nos Missions */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12">Nos Missions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <Card className="text-center">
              <CardHeader><HeartHandshake className="mx-auto h-12 w-12 text-primary" /></CardHeader>
              <CardContent>
                <CardTitle>Solidarité</CardTitle>
                <CardDescription className="mt-2">Renforcer l'entraide socioculturelle entre les membres et les peuples Sakalava.</CardDescription>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardHeader><BookOpen className="mx-auto h-12 w-12 text-primary" /></CardHeader>
              <CardContent>
                <CardTitle>Culture</CardTitle>
                <CardDescription className="mt-2">Promouvoir et préserver la richesse des traditions et du patrimoine culturel Royal.</CardDescription>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardHeader><TrendingUp className="mx-auto h-12 w-12 text-primary" /></CardHeader>
              <CardContent>
                <CardTitle>Développement</CardTitle>
                <CardDescription className="mt-2">Participer activement au développement économique, social et culturel de Madagascar.</CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Section Derniers Articles */}
      <section className="py-20 bg-card border-t">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12">Nos dernières actualités</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {latestArticles.map((article) => (
              <Card key={article.id} className="flex flex-col">
                {article.imageUrl && <img src={article.imageUrl} alt={article.title} className="w-full h-48 object-cover rounded-t-lg" />}
                <CardHeader>
                  <CardTitle>{article.title}</CardTitle>
                  <CardDescription>{new Date(article.createdAt).toLocaleDateString('fr-FR')}</CardDescription>
                </CardHeader>
                <CardContent className="flex-grow">
                  <p className="text-sm text-muted-foreground">{stripHtml(article.content).substring(0, 100)}...</p>
                </CardContent>
                <CardFooter>
                  <Button asChild variant="outline" size="sm" className="w-full">
                    <Link href={`/articles/${article.id}`}>Lire la suite →</Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
          <div className="text-center mt-12">
            <Button asChild variant="secondary">
              <Link href="/articles">Voir tous les articles</Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
