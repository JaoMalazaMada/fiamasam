import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function AdminQcmPage() {
  const session = await getServerSession(authOptions);
  if (!session || session.user?.role !== 'ADMIN') {
    redirect('/');
  }

  const questions = await prisma.question.findMany({
    include: {
      Answer: true,
    },
    orderBy: { createdAt: 'desc' as const },
  });

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Gestion du QCM</h1>
        <Button asChild><Link href="/admin/qcm/create">Créer une question</Link></Button>
      </div>
      <div className="space-y-4">
        {questions.map((q) => (
          <Card key={q.id}>
            <CardHeader>
              <CardTitle>{q.questionText}</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-disc pl-5">
                {q.Answer.map((a) => (
                  <li key={a.id} className={a.isCorrect ? 'font-bold text-[var(--color-primary)]' : ''}>
                    {a.answerText} {a.isCorrect && '(Réponse correcte)'}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}


