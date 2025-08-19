'use server';

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from 'zod';

export async function createQuestion(prevState: any, formData: FormData) {
  const session = await getServerSession(authOptions);
  if (!session || session.user?.role !== 'ADMIN') {
    return { message: "Accès non autorisé." };
  }

  const schema = z.object({
    questionText: z.string().min(1),
    correctAnswerIndex: z.coerce.number(),
    answersCount: z.coerce.number().min(2),
  });

  const parsed = schema.safeParse(Object.fromEntries(formData.entries()));
  if (!parsed.success) {
    return { message: "Données du formulaire invalides." };
  }

  const { questionText, correctAnswerIndex, answersCount } = parsed.data;

  const answers = [] as Array<{ answerText: string; isCorrect: boolean }>;
  for (let i = 0; i < answersCount; i++) {
    const answerText = formData.get(`answer_${i}`) as string;
    if (!answerText) return { message: `La réponse ${i + 1} est vide.` };
    answers.push({ answerText, isCorrect: i === correctAnswerIndex });
  }

  try {
    await prisma.question.create({
      data: {
        questionText,
        Answer: {
          create: answers,
        },
      },
    });
  } catch (error) {
    return { message: "Erreur lors de la création de la question." };
  }

  revalidatePath('/admin/qcm');
  redirect('/admin/qcm');
}


