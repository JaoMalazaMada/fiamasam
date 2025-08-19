import prisma from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import QuizClient from "@/components/QuizClient";

export default async function QcmPage() {
  const questions = await prisma.question.findMany({
    include: {
      Answer: {
        select: {
          id: true,
          answerText: true,
        },
      },
    },
  });

  const shuffledQuestions = questions.sort(() => Math.random() - 0.5);

  return (
    <div className="container mx-auto p-6">
      <Card className="max-w-2xl mx-auto">
        <CardHeader><CardTitle>Quiz sur la Culture Sakalava</CardTitle></CardHeader>
        <CardContent>
          <QuizClient questions={shuffledQuestions as any} />
        </CardContent>
      </Card>
    </div>
  );
}


